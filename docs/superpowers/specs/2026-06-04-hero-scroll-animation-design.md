# Hero Scroll Animation Design

## Goal

Upgrade the Novi Pak hero from a basic floating scene into a premium snack-brand scroll reveal. The hero should feel bright, playful, polished, and product-led on desktop and mobile.

The approved direction is **Snack Orbit Reveal**.

## Current Context

- The hero uses `app/HeroPeanutScene.tsx` for local 3D peanut rendering via Three.js.
- The local asset is `public/peanut/source/SketchfabPeanut/SketchfabPeanut.obj`.
- The local textures are `public/peanut/textures/peanut.jpeg` and `public/peanut/textures/peanutbump.jpeg`.
- Product/category packshots float in `app/page.tsx` through `.hero__floaters`.
- Scroll state is currently simple: the 3D peanuts drift slightly, and existing JS mostly handles nav, cursor, reveal classes, and scroll progress.

## Experience Concept

The hero becomes a three-act scroll animation.

### Act 1: Premium Opening

At rest, the page remains clean and readable:

- `Novi Pak` stays centered.
- CTA buttons remain immediately usable.
- Product packshots sit around the text with light float motion.
- 3D peanuts are visible around the frame with real depth, slow rotation, and warm lighting.
- The composition must not feel like space, galaxy, smoke, or explosion.

### Act 2: Product Pull

From roughly 0-35% hero scroll:

- 3D peanuts move from edge positions into a controlled orbit around the hero text.
- Product packshots move slightly inward and upward/downward at different rates for parallax.
- Background receives a very subtle red/gold warmth shift, not a dark glow.
- CTA shadow can gently intensify, but buttons must not jump or resize.

### Act 3: Snack Wave

From roughly 35-70% hero scroll:

- Peanuts form a wave/orbit path around the text.
- Some peanuts pass visually behind product packs, some closer to the foreground, but none should cover CTA text.
- Add a small amount of code-rendered golden crumbs or salt particles as food detail.
- Particles must be sparse and controlled, not confetti or explosion.

### Act 4: Category Transition

From roughly 70-100% hero scroll:

- The orbit opens outward into four directional lanes.
- The four packshots drift toward their later category-card positions conceptually, creating a transition into the catalog section.
- Hero content fades/settles cleanly instead of abruptly disappearing.

## Desktop Behavior

Desktop can use the full choreography:

- 8-12 3D peanut instances.
- Wider orbit paths.
- Stronger depth variation using z-position, scale, opacity, and rotation speed.
- Packshots use independent parallax offsets.
- The center area around headline and CTA remains protected by a clear zone.

## Mobile Behavior

Mobile must be designed separately, not scaled down from desktop:

- 6-8 3D peanut instances.
- Peanuts follow a vertical S-shaped path behind the headline and around the product packs.
- At least one larger foreground peanut may pass partially through an edge of the screen for a strong 3D moment.
- The headline, body copy, and CTA buttons must remain readable at all times.
- No horizontal overflow.
- No peanut should cover the primary CTA.

## Implementation Architecture

### `HeroPeanutScene.tsx`

Keep this as the owner of the Three.js scene.

Add:

- A scroll progress reader normalized to `0..1`.
- Desktop and mobile choreography presets.
- Per-instance path metadata: start, orbit, wave, exit, scale range, depth range, spin rate.
- Smooth interpolation using easing helpers.
- Reduced-motion handling that keeps a static but polished composition.

Avoid:

- Hardcoding behavior directly inside the render loop without named phases.
- Adding global scroll listeners outside the component for the 3D scene.

### Hero Packshots

Packshots should get scroll-aware transforms either through:

- CSS variables updated by one lightweight client component, or
- a small `HeroMotionController` client component that owns DOM transforms for packshots and hero text.

Recommended: create `HeroMotionController.tsx` so Three.js logic and DOM animation logic stay separate.

### Legacy Runtime

The old `#storm` canvas logic in `public/novipak.js` is now unused because the hero no longer renders `canvas#storm`.

During implementation, remove the unused storm block from `public/novipak.js` to reduce confusion and avoid dead animation code.

## Motion Rules

- Use scroll progress as the main driver.
- Use idle time only for subtle rotation/floating.
- Use easing, not linear movement.
- Avoid sudden starts/stops.
- Respect `prefers-reduced-motion`.
- Keep animation lightweight enough for mobile.

## Visual Constraints

- Bright palette only: existing red, gold, yellow, cream, white.
- No dark hero.
- No galaxy, smoke, explosion, neon, or heavy glow.
- Product packs remain visually important.
- 3D peanuts should be obvious, but decorative; they must not compete with the brand text.
- CTA buttons must stay stable, readable, and clickable.

## QA Criteria

Before completion:

- Run `npm run lint`.
- Run `npm run build`.
- Verify desktop hero at approximately `1440x950`.
- Verify mobile hero at approximately `390x844`.
- Confirm `.hero__peanut3d.loaded` is true.
- Confirm no horizontal overflow on mobile.
- Capture and inspect screenshots.
- Check at least three scroll positions: top, mid-hero, late-hero.
- Confirm primary CTA remains readable and unobscured in all checked states.

## Acceptance Criteria

The upgrade is accepted when:

- The hero has a visible scroll story rather than simple floating objects.
- Desktop feels premium and more memorable.
- Mobile has intentional 3D motion and does not feel like a reduced desktop afterthought.
- The 3D local peanut model remains the rendered snack asset.
- The animation stays bright, branded, and product-focused.
