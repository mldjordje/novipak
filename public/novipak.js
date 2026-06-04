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
