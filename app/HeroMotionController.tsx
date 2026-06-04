"use client";

import { useEffect } from "react";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeInOut = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const FLOATER_PATHS = [
  { pull: [28, -8], wave: [18, 24], exit: [-80, -26], rotate: 7 },
  { pull: [-34, 4], wave: [-22, 28], exit: [86, -30], rotate: -6 },
  { pull: [30, -20], wave: [12, -24], exit: [-72, 42], rotate: -5 },
  { pull: [-28, -24], wave: [-16, -28], exit: [78, 44], rotate: 6 },
] as const;

const MOBILE_FLOATER_PATHS = [
  { pull: [-4, -4], wave: [-24, -18], exit: [-54, -20], rotate: 4 },
  { pull: [4, -4], wave: [24, -14], exit: [58, -22], rotate: -4 },
  { pull: [-6, -2], wave: [-22, 14], exit: [-48, 32], rotate: -3 },
  { pull: [6, -2], wave: [22, 14], exit: [50, 32], rotate: 3 },
] as const;

export function HeroMotionController() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const floaterPaths = isMobile ? MOBILE_FLOATER_PATHS : FLOATER_PATHS;
    let frame = 0;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      const span = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = reduced ? 0 : clamp01(-rect.top / span);
      const pull = easeInOut(clamp01(progress / 0.35));
      const wave = easeInOut(clamp01((progress - 0.35) / 0.35));
      const exit = easeInOut(clamp01((progress - 0.7) / 0.3));

      hero.style.setProperty("--hero-progress", progress.toFixed(4));
      hero.style.setProperty("--hero-pull", pull.toFixed(4));
      hero.style.setProperty("--hero-wave", wave.toFixed(4));
      hero.style.setProperty("--hero-exit", exit.toFixed(4));
      hero.style.setProperty("--hero-warmth", (0.08 + pull * 0.2 + wave * 0.14).toFixed(4));
      hero.style.setProperty("--crumb-opacity", (wave * 0.78 * (1 - exit * 0.45)).toFixed(4));
      hero.style.setProperty("--crumb-y", `${(exit * 24).toFixed(2)}px`);
      hero.style.setProperty("--crumb-scale", (0.6 + wave * 0.8).toFixed(3));

      hero.querySelectorAll<HTMLElement>(".floater").forEach((floater, index) => {
        const path = floaterPaths[index];
        if (!path) return;
        const x = path.pull[0] * pull + path.wave[0] * wave + path.exit[0] * exit;
        const y = path.pull[1] * pull + path.wave[1] * wave + path.exit[1] * exit;
        const rot = path.rotate * wave - path.rotate * 0.55 * exit;
        const scale = 1 + 0.035 * pull - 0.025 * exit;
        floater.style.setProperty("--motion-x", `${x.toFixed(2)}px`);
        floater.style.setProperty("--motion-y", `${y.toFixed(2)}px`);
        floater.style.setProperty("--motion-rot", `${rot.toFixed(2)}deg`);
        floater.style.setProperty("--motion-scale", scale.toFixed(3));
      });
      frame = 0;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
