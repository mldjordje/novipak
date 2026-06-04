# Hero Scroll Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Snack Orbit Reveal hero animation with scroll-driven 3D peanuts, product packshot parallax, mobile-specific choreography, and clean QA.

**Architecture:** Keep Three.js peanut rendering inside `app/HeroPeanutScene.tsx`. Add a separate client component, `app/HeroMotionController.tsx`, to update CSS variables for DOM packshots, hero warmth, and hero content settling. Remove unused `#storm` canvas code from `public/novipak.js`.

**Tech Stack:** Next.js App Router, React client components, Three.js, CSS variables, existing static assets.

---

### Task 1: Scroll Choreography In Three.js

**Files:**
- Modify: `app/HeroPeanutScene.tsx`

- [ ] **Step 1: Add phase helpers and path metadata**

Add easing helpers, path types, desktop/mobile choreography arrays, and interpolation helpers in `HeroPeanutScene.tsx`. Each peanut instance needs `start`, `orbit`, `wave`, `exit`, `scale`, `foreground`, `spinRate`, and `phase` metadata.

- [ ] **Step 2: Replace static layout mapping**

Replace `DESKTOP_LAYOUT` and `MOBILE_LAYOUT` with choreography presets:

- desktop: 10 peanuts
- mobile: 7 peanuts
- mobile must include one larger foreground edge pass

- [ ] **Step 3: Drive position from scroll progress**

Inside `animate`, compute the active point from progress:

- `0..0.35`: start to orbit
- `0.35..0.7`: orbit to wave
- `0.7..1`: wave to exit

Preserve subtle idle bob/rotation so the top state is not static.

- [ ] **Step 4: Keep reduced motion polished**

When `prefers-reduced-motion` is enabled, set the peanuts to their opening positions and render a stable scene without scroll choreography.

### Task 2: DOM Packshot Motion Controller

**Files:**
- Create: `app/HeroMotionController.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create client controller**

Create `HeroMotionController.tsx`. It reads hero scroll progress, writes `--hero-progress`, `--hero-warmth`, and `--floater-shift` style variables on `.hero`, and respects reduced motion.

- [ ] **Step 2: Mount controller in hero**

Import and render `<HeroMotionController />` inside the hero sticky container after `<HeroPeanutScene />`.

- [ ] **Step 3: Add packshot transform variables**

Update `.floater` and `.floater img` CSS so each packshot uses per-item motion variables:

- slight inward pull during early scroll
- vertical drift during mid scroll
- outward category-lane movement late in scroll
- no layout shift

### Task 3: Food Detail Layer

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add native crumb layer markup**

Add a `.hero__crumbs` element with 12 spans on desktop and usable CSS behavior on mobile. This stays DOM/CSS, not canvas.

- [ ] **Step 2: Animate crumbs with CSS variables**

Crumbs should appear during mid scroll, remain sparse, and never look like confetti or an explosion.

### Task 4: Remove Dead Canvas Runtime

**Files:**
- Modify: `public/novipak.js`

- [ ] **Step 1: Remove unused `#storm` IIFE**

Delete the initial canvas animation block that looks for `canvas#storm`, because the hero no longer renders that canvas.

- [ ] **Step 2: Keep nav/cursor/forms behavior intact**

Leave `npInit()` and everything after it in place.

### Task 5: QA And Commit

**Files:**
- Verify only unless fixes are required.

- [ ] **Step 1: Run static checks**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

- [ ] **Step 2: Visual QA**

Use Browser plugin if available. If unavailable, use temporary Playwright fallback, then remove it before commit.

Check:

- desktop `1440x950` at top, mid hero, late hero
- mobile `390x844` at top, mid hero, late hero
- `.hero__peanut3d.loaded === true`
- no horizontal overflow on mobile
- primary CTA readable and unobscured

- [ ] **Step 3: Commit and push**

Commit changed files with:

```bash
git add app/HeroPeanutScene.tsx app/HeroMotionController.tsx app/page.tsx app/globals.css public/novipak.js docs/superpowers/plans/2026-06-04-hero-scroll-animation.md
git commit -m "Upgrade hero scroll animation"
git push origin main
```
