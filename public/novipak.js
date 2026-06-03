/* Novi Pak interaction runtime: light premium snack motion */
(function () {
  const canvas = document.getElementById("storm");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  const isMobile = matchMedia("(max-width: 768px)").matches;
  const COUNT = isMobile ? 16 : 28;
  let W = 0;
  let H = 0;
  let DPR = 1;
  let particles = [];
  let progress = 0;
  let lastY = scrollY;
  let velocity = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function build() {
    particles = Array.from({ length: COUNT }, (_, index) => ({
      x: rand(-0.12, 1.12),
      y: rand(0.12, 0.86),
      z: rand(0.35, 1),
      size: rand(isMobile ? 28 : 34, isMobile ? 54 : 78),
      spin: rand(0, Math.PI * 2),
      speed: rand(0.08, 0.24),
      wave: rand(0.5, 1.8),
      seed: rand(0, Math.PI * 2),
      type: index % 5 === 0 ? "crumb" : "peanut",
    }));
  }

  function readProgress() {
    const rect = hero.getBoundingClientRect();
    const span = Math.max(hero.offsetHeight - innerHeight, 1);
    progress = clamp(-rect.top / span, 0, 1);
    velocity = lerp(velocity, Math.abs(scrollY - lastY), 0.22);
    lastY = scrollY;
  }

  function drawPeanut(x, y, size, rotation, alpha, z) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    const grad = ctx.createRadialGradient(-size * 0.18, -size * 0.22, 2, 0, 0, size * 0.62);
    grad.addColorStop(0, "#fff0ba");
    grad.addColorStop(0.34, "#d99b45");
    grad.addColorStop(0.72, "#b8792f");
    grad.addColorStop(1, "#7f4e22");
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.ellipse(-size * 0.18, 0, size * 0.28, size * 0.42, -0.12, 0, Math.PI * 2);
    ctx.ellipse(size * 0.18, 0, size * 0.28, size * 0.42, 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.38;
    ctx.strokeStyle = "#6d3d18";
    ctx.lineWidth = Math.max(1, size * 0.018);
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-size * 0.36, i * size * 0.12);
      ctx.bezierCurveTo(-size * 0.1, i * size * 0.08, size * 0.12, i * size * 0.16, size * 0.36, i * size * 0.1);
      ctx.stroke();
    }

    ctx.globalAlpha = alpha * 0.55;
    ctx.fillStyle = "#fff7ce";
    ctx.beginPath();
    ctx.ellipse(-size * 0.24, -size * 0.2, size * 0.11, size * 0.16, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.2 * z;
    ctx.fillStyle = "#951c20";
    ctx.beginPath();
    ctx.ellipse(0, size * 0.52, size * 0.44, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCrumb(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffc53e";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function frame(now) {
    readProgress();
    const t = now / 1000;
    ctx.clearRect(0, 0, W, H);

    const wash = ctx.createLinearGradient(0, 0, W, H);
    wash.addColorStop(0, "rgba(255,255,255,0.42)");
    wash.addColorStop(0.45, "rgba(255,197,62,0.16)");
    wash.addColorStop(1, "rgba(235,29,36,0.08)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);

    const centerX = W * 0.5;
    const centerY = H * 0.48;
    for (const p of particles) {
      const drift = t * p.speed + progress * 1.35;
      const flowX = ((p.x + drift) % 1.28) - 0.14;
      const wave = Math.sin(t * p.wave + p.seed + progress * 4);
      const x = flowX * W;
      const y = p.y * H + wave * 28 * p.z - progress * H * 0.12;
      const pull = clamp((progress - 0.36) / 0.34, 0, 1);
      const settle = clamp((progress - 0.7) / 0.26, 0, 1);
      const px = lerp(x, centerX + Math.cos(p.seed) * W * 0.26, pull * 0.45);
      const py = lerp(y, centerY + Math.sin(p.seed) * H * 0.22, pull * 0.45) + settle * 90;
      const alpha = clamp(0.18 + p.z * 0.45 - settle * 0.34, 0, 0.7);
      const size = p.size * lerp(0.72, 1.08, p.z) * (1 + velocity * 0.0015);

      if (p.type === "crumb") drawCrumb(px, py, size, alpha * 0.9);
      else drawPeanut(px, py, size, p.spin + t * 0.38 + progress * 1.7, alpha, p.z);
    }

    requestAnimationFrame(frame);
  }

  resize();
  build();
  addEventListener("resize", () => {
    resize();
    build();
  });
  requestAnimationFrame(frame);
})();

function npInit() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let rx = mx;
  let ry = my;

  if (dot && ring && matchMedia("(hover:hover)").matches) {
    addEventListener("mousemove", (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a,button,.btn,.pcard,.product-card,input,select,textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  const nav = document.getElementById("nav");
  const hero = document.querySelector(".hero");
  const hint = document.querySelector(".scroll-hint");
  const progressBar = document.getElementById("scrollProgress");
  setTimeout(() => hero?.classList.add("reveal"), 180);
  function onScroll() {
    const y = scrollY;
    nav?.classList.toggle("solid", y > 24);
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const span = Math.max(hero.offsetHeight - innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / span, 0), 1);
      hero.classList.add("reveal");
      if (hint) hint.style.opacity = p > 0.05 ? "0" : "1";
    }
    if (progressBar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progressBar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    const toggle = (open) => {
      burger.classList.toggle("open", open);
      menu.classList.toggle("open", open);
    };
    burger.addEventListener("click", () => toggle(!burger.classList.contains("open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggle(false)));
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));

  document.querySelectorAll(".field input,.field select,.field textarea").forEach((el) => {
    const sync = () => el.classList.toggle("has", !!el.value);
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
    sync();
  });

  const form = document.getElementById("inquiry");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const msg = form.querySelector(".form__msg");
      if (msg) msg.textContent = "Hvala! Vaš upit je poslat - javićemo vam se uskoro.";
      form.querySelectorAll("input,select,textarea").forEach((el) => {
        el.value = "";
        el.classList.remove("has");
      });
    });
  }
}

if (document.readyState !== "loading") npInit();
else document.addEventListener("DOMContentLoaded", npInit);
