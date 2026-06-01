/* ============================================================
   NOVI PAK — bundled client runtime (peanut-bake + particles + interaction)
   Loaded once via <Script src="/novipak.js" strategy="afterInteractive"/>
   ============================================================ */

/* ---- peanut-bake.js ---- */
/* ============================================================
   PEANUT BAKE — renders the real 3D peanut model into a small
   sprite atlas (with alpha) once, then everything else just
   draws cheap 2D sprites. Result is cached in localStorage.
   Exposes: window.bakePeanutAtlas() -> Promise<{atlas,COLS,ROWS,CELL}>
   ============================================================ */
(function () {
  const CACHE_KEY = 'np_peanut_atlas_v2';
  const COLS = 8, ROWS = 4, CELL = 256;        // 8 yaw angles x 4 tilts
  const THREE_URL = 'https://unpkg.com/three@0.128.0/build/three.min.js';
  const OBJ_LOADER_URL = 'https://unpkg.com/three@0.128.0/examples/js/loaders/OBJLoader.js';
  const OBJ_URL = '/peanut/source/SketchfabPeanut/SketchfabPeanut.obj';
  const TEX_URL = '/peanut/textures/peanut.jpeg';
  const BUMP_URL = '/peanut/textures/peanutbump.jpeg';

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src));
      document.head.appendChild(s);
    });
  }
  function loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  async function bake() {
    // 1) cached?
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) { const img = await loadImage(cached); return { atlas: img, COLS, ROWS, CELL }; }
    } catch (e) { /* ignore */ }

    // 2) load three + loader
    if (!window.THREE) await loadScript(THREE_URL);
    if (!THREE.OBJLoader) await loadScript(OBJ_LOADER_URL);

    // 3) textures
    const texLoader = new THREE.TextureLoader();
    const load = (u) => new Promise((res, rej) => texLoader.load(u, res, undefined, rej));
    const [tex, bump] = await Promise.all([load(TEX_URL), load(BUMP_URL)]);
    if ('sRGBEncoding' in THREE) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;

    // 4) model
    const obj = await new Promise((res, rej) => new THREE.OBJLoader().load(OBJ_URL, res, undefined, rej));
    let geo = null;
    obj.traverse(o => { if (o.isMesh && !geo) geo = o.geometry; });
    if (!geo) throw new Error('no mesh in OBJ');
    geo.center();
    geo.computeBoundingSphere();
    const R = geo.boundingSphere.radius || 1;

    // 5) scene + warm side lighting (left brighter)
    const scene = new THREE.Scene();
    const mat = new THREE.MeshStandardMaterial({ map: tex, bumpMap: bump, bumpScale: 0.5, roughness: 0.62, metalness: 0.0 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    scene.add(new THREE.AmbientLight(0xffffff, 0.42));
    const key = new THREE.DirectionalLight(0xfff1d6, 1.35); key.position.set(-1.3, 0.85, 0.9); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffcf7a, 0.7); rim.position.set(0.7, 0.5, -1.1); scene.add(rim);
    const fill = new THREE.DirectionalLight(0x5a3d18, 0.5); fill.position.set(1.4, -0.4, 0.4); scene.add(fill);

    // 6) renderer (transparent bg -> atlas keeps alpha)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(CELL, CELL);

    const fov = 26;
    const cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 5000);
    const dist = (R / Math.sin((fov * Math.PI / 180) / 2)) * 1.05;
    cam.position.set(0, 0, dist); cam.lookAt(0, 0, 0);

    // 7) render the grid into one atlas canvas
    const atlas = document.createElement('canvas');
    atlas.width = COLS * CELL; atlas.height = ROWS * CELL;
    const actx = atlas.getContext('2d');
    const TILT0 = -0.42, TILT1 = 0.42;
    for (let r = 0; r < ROWS; r++) {
      const pitch = TILT0 + (ROWS === 1 ? 0 : (r / (ROWS - 1)) * (TILT1 - TILT0));
      for (let c = 0; c < COLS; c++) {
        const yaw = (c / COLS) * Math.PI * 2;
        mesh.rotation.set(pitch, yaw, 0);
        renderer.render(scene, cam);
        actx.drawImage(renderer.domElement, c * CELL, r * CELL, CELL, CELL);
      }
    }

    // 8) cache (best-effort) + cleanup
    try { localStorage.setItem(CACHE_KEY, atlas.toDataURL('image/png')); } catch (e) { /* quota */ }
    try { geo.dispose(); mat.dispose(); tex.dispose(); bump.dispose(); renderer.dispose(); } catch (e) {}

    return { atlas, COLS, ROWS, CELL };
  }

  window.bakePeanutAtlas = bake;
})();


/* ---- particles.js ---- */
/* ============================================================
   GOLDEN STORM — cinematic scroll-driven peanut field
   Real baked 3D peanut sprites, depth-of-field, bokeh,
   atmospheric dust, slow camera sway.
   Phases (hero scroll progress p, 0..1):
     idle  p≈0       breathing peanut field w/ DOF
     0–.42 vortex    orbit + zoom-in galaxy
     .42–.66 explode burst + shockwave + ingredients
     .66–1  calm     drift/shrink, bg → charcoal, text slams
   ============================================================ */
(function () {
  const canvas = document.getElementById('storm');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');

  const isMobile = matchMedia('(max-width:768px)').matches;
  const PEANUTS = isMobile ? 55 : 130;
  const DUST = isMobile ? 24 : 80;
  const INGRED = isMobile ? 12 : 54;

  let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, minDim = 0, maxDim = 0;

  /* ---- baked peanut atlas (filled in asynchronously) ---- */
  let ATLAS = null, A_COLS = 8, A_ROWS = 4, A_CELL = 256;
  function startBake() {
    if (!window.bakePeanutAtlas) { signalReady(); return; }
    window.bakePeanutAtlas().then(res => {
      ATLAS = res.atlas; A_COLS = res.COLS; A_ROWS = res.ROWS; A_CELL = res.CELL; signalReady();
    }).catch(err => { console.warn('peanut bake failed, using fallback', err); signalReady(); });
  }
  let readySent = false;
  function signalReady() { if (readySent) return; readySent = true; if (window.__peanutReady) window.__peanutReady(); }

  /* ---- fallback drawn peanut sprite ---- */
  const SP = 90;
  const sprite = document.createElement('canvas');
  sprite.width = SP; sprite.height = SP;
  (function buildSprite() {
    const s = sprite.getContext('2d');
    const cxs = SP / 2, cys = SP / 2, lobeR = SP * 0.235, off = SP * 0.17;
    const grad = s.createRadialGradient(cxs - off * 0.6, cys - off * 0.7, 2, cxs, cys, SP * 0.5);
    grad.addColorStop(0, '#F4D27A'); grad.addColorStop(0.45, '#D4A017'); grad.addColorStop(1, '#8B6914');
    s.fillStyle = grad;
    s.beginPath();
    s.ellipse(cxs - off, cys, lobeR, lobeR * 1.18, 0, 0, Math.PI * 2);
    s.ellipse(cxs + off, cys, lobeR, lobeR * 1.18, 0, 0, Math.PI * 2);
    s.fill();
    const hi = s.createRadialGradient(cxs - off, cys - lobeR * 0.5, 1, cxs - off, cys - lobeR * 0.5, lobeR);
    hi.addColorStop(0, 'rgba(255,255,255,0.55)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
    s.fillStyle = hi;
    s.beginPath(); s.ellipse(cxs - off, cys - lobeR * 0.35, lobeR * 0.6, lobeR * 0.7, 0, 0, Math.PI * 2); s.fill();
  })();

  /* ---- helpers ---- */
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---- particles ---- */
  let peanuts = [], dust = [], ingredients = [], order = [];
  const FOCAL = 0.62;                      // focal plane depth (sharp)
  function build() {
    peanuts = [];
    for (let i = 0; i < PEANUTS; i++) {
      const ang = Math.random() * Math.PI * 2;
      const radF = Math.pow(Math.random(), 0.7);
      const bokeh = Math.random() < 0.12;
      const z = bokeh ? rand(0.9, 1.0) : rand(0.16, 0.86);   // depth 0 far .. 1 near
      peanuts.push({
        baseAng: ang, radF, z, bokeh,
        size: rand(20, 40),
        dir: Math.random() < 0.5 ? 1 : -1,
        speedMul: rand(0.5, 1.4),
        spin: Math.random() * Math.PI * 2,
        spinMul: rand(0.2, 0.8) * (Math.random() < .5 ? 1 : -1),
        driftPh: Math.random() * Math.PI * 2,
        driftAmp: rand(7, 26),
        explAng: ang + rand(-0.5, 0.5),
        explForce: rand(0.7, 1.7),
        toCam: Math.random() < 0.14,
        yaw0: Math.random() * 8,
        yawSpeed: rand(0.25, 1.1) * (Math.random() < .5 ? 1 : -1),
        pitchRow: (Math.random() * 4) | 0
      });
    }
    order = peanuts.map((_, i) => i);

    dust = [];
    for (let i = 0; i < DUST; i++) {
      dust.push({
        ang: Math.random() * Math.PI * 2, rad: Math.pow(Math.random(), 0.5),
        ph: Math.random() * Math.PI * 2, sp: rand(0.05, 0.25) * (Math.random() < .5 ? 1 : -1),
        size: rand(0.6, 2.4), tw: rand(0.4, 1.2), z: Math.random()
      });
    }

    ingredients = [];
    const kinds = ['red', 'powder', 'spice'];
    for (let i = 0; i < INGRED; i++) {
      ingredients.push({
        ang: Math.random() * Math.PI * 2, force: rand(0.5, 1.6),
        size: rand(2, 6), kind: kinds[(Math.random() * kinds.length) | 0]
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2; cy = H * 0.47;
    minDim = Math.min(W, H); maxDim = Math.max(W, H);
  }

  /* ---- scroll progress + velocity ---- */
  let progress = 0, lastY = window.scrollY, vel = 0;
  function readProgress() {
    const rect = hero.getBoundingClientRect();
    const span = hero.offsetHeight - window.innerHeight;
    progress = clamp(-rect.top / span, 0, 1);
    const y = window.scrollY;
    vel = lerp(vel, Math.abs(y - lastY), 0.4); lastY = y;
  }

  /* ---- draw one peanut ---- */
  function drawPeanut(pt, x, y, size, alpha, spin, t, blur) {
    ctx.save();
    if (blur > 0.4) ctx.filter = 'blur(' + blur.toFixed(1) + 'px)';
    ctx.translate(x, y);
    ctx.rotate(spin);
    if (ATLAS) {
      let col = Math.floor(pt.yaw0 + t * pt.yawSpeed) % A_COLS;
      if (col < 0) col += A_COLS;
      const row = pt.pitchRow % A_ROWS;
      ctx.globalAlpha = clamp(alpha * lerp(1.05, 0.9, clamp(x / W, 0, 1)), 0, 1);
      ctx.drawImage(ATLAS, col * A_CELL, row * A_CELL, A_CELL, A_CELL, -size / 2, -size / 2, size, size);
    } else {
      const sideBright = lerp(1.25, 0.55, clamp(x / W, 0, 1));
      ctx.globalAlpha = clamp(alpha * sideBright, 0, 1);
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    }
    ctx.restore();
    ctx.filter = 'none';
  }

  /* ---- main loop ---- */
  let globalRot = 0, last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 16.67, 3); last = now;
    readProgress();
    const p = progress;
    const t = now / 1000;

    const vortex = clamp(p / 0.42, 0, 1);
    const explode = clamp((p - 0.42) / 0.24, 0, 1);
    const calm = clamp((p - 0.66) / 0.34, 0, 1);
    const settle = (1 - vortex);          // 1 at idle, 0 in vortex+

    const spinSpeed = (0.0014 + vortex * 0.010 + vel * 0.00018) * dt;
    globalRot += spinSpeed;

    // cinematic camera sway (calms during the storm)
    const swayX = Math.sin(t * 0.23) * W * 0.014 * settle;
    const swayY = Math.cos(t * 0.19) * H * 0.012 * settle;
    const ccx = cx + swayX, ccy = cy + swayY;
    const idleZoom = 1 + Math.sin(t * 0.3) * 0.02 * settle;

    // background trail fill (motion blur). bg lerps black -> charcoal in calm
    const bg = Math.round(lerp(0, 13, calm));
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(${bg},${bg},${bg},${lerp(0.32, 0.5, explode)})`;
    ctx.fillRect(0, 0, W, H);

    // layered cinematic glow: warm key from upper-left + amber core + red halo
    ctx.globalCompositeOperation = 'lighter';
    const key = ctx.createRadialGradient(ccx - W * 0.22, ccy - H * 0.26, 0, ccx - W * 0.22, ccy - H * 0.26, minDim * 0.9);
    key.addColorStop(0, `rgba(255,225,160,${0.05 * (1 - calm * 0.5)})`);
    key.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = key; ctx.fillRect(0, 0, W, H);

    const bloom = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, minDim * (0.42 + vortex * 0.16 + calm * 0.3));
    const bloomI = lerp(0.11, 0.22, vortex) * (1 - calm * 0.45);
    bloom.addColorStop(0, `rgba(212,160,23,${bloomI})`);
    bloom.addColorStop(0.4, `rgba(200,16,46,${bloomI * 0.42})`);
    bloom.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bloom; ctx.fillRect(0, 0, W, H);

    // atmospheric dust motes
    const dustR = minDim * 0.5;
    for (const d of dust) {
      const a = d.ang + globalRot * d.sp * 0.5 + t * d.sp * 0.3;
      const rr = d.rad * dustR * (1 - vortex * 0.4) + Math.sin(t * 0.5 + d.ph) * 8;
      const x = ccx + Math.cos(a) * rr, y = ccy + Math.sin(a) * rr * 0.85;
      const tw = (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * d.tw + d.ph))) * (1 - calm);
      ctx.globalAlpha = clamp(0.5 * tw * lerp(0.4, 1, d.z), 0, 1);
      ctx.fillStyle = d.z > 0.6 ? 'rgba(255,228,170,1)' : 'rgba(200,120,60,1)';
      ctx.beginPath(); ctx.arc(x, y, d.size * (0.6 + d.z), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    const zoom = lerp(idleZoom, 1.6, easeInOut(vortex));
    const baseRad = minDim * 0.36;

    // compute draw items then painter-sort by depth (far -> near)
    order.sort((ia, ib) => peanuts[ia].z - peanuts[ib].z);
    for (const idx of order) {
      const pt = peanuts[idx];
      const ang = pt.baseAng + globalRot * pt.dir * pt.speedMul * lerp(0.7, 1.3, pt.z);
      let r = baseRad * (0.12 + pt.radF * 0.88) * lerp(1, 0.78, vortex);
      const drift = Math.sin(t * 0.7 + pt.driftPh) * pt.driftAmp * settle;
      r += drift;
      let x = ccx + Math.cos(ang) * (r + drift);
      let y = ccy + Math.sin(ang) * (r + drift) * 0.82;

      // depth: near = bigger, brighter; far = smaller, dimmer
      const depthScale = lerp(0.5, 2.6, pt.z);
      let size = pt.size * depthScale * zoom;
      let alpha = lerp(0.5, 1.05, pt.z);
      let blur = pt.bokeh ? (pt.z - 0.86) * 46 : 0;          // foreground bokeh
      if (pt.bokeh) alpha *= 0.55;

      if (explode > 0) {
        const e = easeOut(explode);
        const dist = e * pt.explForce * maxDim * 0.95;
        x += Math.cos(pt.explAng) * dist;
        y += Math.sin(pt.explAng) * dist;
        if (pt.toCam) { size = lerp(size, 260, e); alpha = lerp(alpha, 0, clamp((explode - 0.55) / 0.45, 0, 1)); blur = e * 5; }
        else { alpha *= 1 - clamp((explode - 0.7) / 0.3, 0, 1); }
      }
      if (calm > 0) {
        size *= (1 - calm * 0.85);
        alpha *= (1 - easeOut(calm));
        const e = easeOut(calm);
        x += Math.cos(pt.explAng) * e * maxDim * 0.4;
        y += Math.sin(pt.explAng) * e * maxDim * 0.4;
      }
      if (alpha <= 0.01 || size < 0.5) continue;

      pt.spin += pt.spinMul * (0.007 + vortex * 0.022) * dt;
      drawPeanut(pt, x, y, size, alpha, pt.spin, t, blur);
    }

    // shockwave ring + flash
    if (explode > 0 && explode < 1) {
      ctx.globalCompositeOperation = 'lighter';
      const flash = clamp(1 - explode / 0.14, 0, 1) * 0.5;
      if (flash > 0) { ctx.fillStyle = `rgba(255,245,230,${flash})`; ctx.fillRect(0, 0, W, H); }
      const e = easeOut(explode), rr = e * maxDim * 0.85;
      ctx.strokeStyle = `rgba(200,16,46,${(1 - explode) * 0.7})`;
      ctx.lineWidth = lerp(22, 2, explode);
      ctx.beginPath(); ctx.arc(ccx, ccy, rr, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(212,160,23,${(1 - explode) * 0.5})`;
      ctx.lineWidth = lerp(8, 1, explode);
      ctx.beginPath(); ctx.arc(ccx, ccy, rr * 0.78, 0, Math.PI * 2); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }

    // ingredient particles
    if (explode > 0) {
      const e = easeOut(explode);
      const ia = clamp(explode / 0.2, 0, 1) * (1 - clamp((explode - 0.8) / 0.2, 0, 1));
      for (const g of ingredients) {
        const dist = e * g.force * maxDim * 0.7;
        const x = ccx + Math.cos(g.ang) * dist, y = ccy + Math.sin(g.ang) * dist;
        ctx.globalAlpha = ia;
        ctx.fillStyle = g.kind === 'red' ? '#C8102E' : g.kind === 'powder' ? '#F5F0E8' : '#C9A84C';
        ctx.beginPath(); ctx.arc(x, y, g.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(frame);
  }

  function init() { resize(); build(); startBake(); requestAnimationFrame(frame); }
  window.addEventListener('resize', resize);
  init();
})();


/* ---- main.js ---- */
/* ============================================================
   NOVI PAK — interaction layer
   ============================================================ */
function npInit(){

  /* ---- preloader (waits for the peanut bake, with a hard cap) ---- */
  const pre = document.getElementById('preloader');
  let preDone = false;
  const dismiss = () => { if (preDone) return; preDone = true; pre.classList.add('done'); };
  window.__peanutReady = dismiss;          // particles.js calls this when the atlas is ready
  setTimeout(dismiss, 2500);               // hard safety cap: never hide the page behind asset baking

  /* ---- custom cursor (lerp lag ring) ---- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  if (dot && ring && matchMedia('(hover:hover)').matches) {
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.btn,.pcard,input,select,textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---- magnetic buttons ---- */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  /* ---- navbar solid + hero text reveal (scroll driven) ---- */
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const hint = document.querySelector('.scroll-hint');
  const prog = document.getElementById('scrollProgress');
  function onScroll() {
    const rect = hero.getBoundingClientRect();
    const span = hero.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-rect.top / span, 0), 1);
    nav.classList.toggle('solid', -rect.top > innerHeight * 0.6);
    hero.classList.toggle('reveal', p > 0.70);
    if (hint) hint.style.opacity = p > 0.05 ? '0' : '1';
    if (prog) {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- language toggle ---- */
  document.querySelectorAll('.lang button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.lang button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  /* ---- mobile menu ---- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger) {
    const toggle = (open) => { burger.classList.toggle('open', open); menu.classList.toggle('open', open); };
    burger.addEventListener('click', () => toggle(!burger.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a, i) => {
      a.style.animationDelay = (0.06 * i + 0.05) + 's';
      a.addEventListener('click', () => toggle(false));
    });
  }

  /* ---- IntersectionObserver: section reveals + wipes ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-up,.wipe').forEach(el => io.observe(el));

  /* ---- count-up stats ---- */
  function countUp(el) {
    const target = +el.dataset.count;
    const dur = 2000, t0 = performance.now();
    (function step(now) {
      const t = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.firstChild.nodeValue = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target.querySelector('.cnt')); statIO.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat').forEach(s => statIO.observe(s));

  /* ---- why-us staggered pop ---- */
  const featIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const feats = [...e.target.querySelectorAll('.feat')];
        feats.forEach((f, i) => setTimeout(() => f.classList.add('pop'), i * 150));
        featIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.why__grid').forEach(g => featIO.observe(g));

  /* ---- contact icon stroke draw ---- */
  const drawIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('draw'); drawIO.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('.cinfo__item').forEach(i => drawIO.observe(i));

  /* ---- floating labels ---- */
  document.querySelectorAll('.field input,.field select,.field textarea').forEach(el => {
    const sync = () => el.classList.toggle('has', !!el.value);
    el.addEventListener('input', sync); el.addEventListener('change', sync); sync();
  });

  /* ---- form submit ---- */
  const form = document.getElementById('inquiry');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.querySelector('.form__msg');
    msg.textContent = 'Hvala! Vaš upit je poslat — javićemo vam se uskoro.';
    form.querySelectorAll('input,select,textarea').forEach(el => { el.value = ''; el.classList.remove('has'); });
  });
}
if (document.readyState !== 'loading') { npInit(); } else { document.addEventListener('DOMContentLoaded', npInit); }
