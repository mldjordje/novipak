# Novi Pak — Next.js landing page

Premium dark landing page for **Novi Pak Premijum doo Niš** — featuring the
scroll-driven "Golden Storm" peanut hero, scattered product-category photos that
drift in once the *NOVI PAK* title lands, animated product cards, count-up stats,
and a contact form.

Built with **Next.js 15 (App Router) + TypeScript**.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

To build for production:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx      Root layout — fonts (Anton + Inter) + metadata
  page.tsx        The whole landing page (JSX markup)
  globals.css     All styles (design system + animations + responsive)
public/
  novipak.js      Bundled client runtime — loaded via next/script.
                  = peanut-bake (3D → sprite atlas) + particles (storm canvas)
                    + interaction layer (cursor, scroll reveals, form, etc.)
  assets/         Logo + 4 product-category photos
  peanut/         3D peanut model (.obj) + textures, baked into the hero atlas
```

## How the hero works

`public/novipak.js` runs after the page is interactive:

1. **peanut-bake** loads a small 3D peanut model (`/peanut/...`) with three.js
   (pulled from a CDN at runtime), renders it from several angles into one
   sprite-atlas canvas, and caches it in `localStorage`. If anything fails it
   falls back to a hand-drawn 2D peanut sprite — the hero still works offline.
2. **particles** draws the scroll-driven storm onto `#storm` (idle → vortex →
   explosion → calm) and reveals the hero text + floating product photos.
3. **interaction layer** wires the custom cursor, magnetic buttons, scroll
   progress bar, section reveals, count-up stats, mobile menu and contact form.

It is plain framework-agnostic JS attached to DOM ids/classes, so it needs no
React state. If you later refactor sections into components, keep the same
`id`/`className` hooks (e.g. `#storm`, `.hero`, `.reveal-up`, `#scrollProgress`).

## Notes / possible next steps

- **Fonts** load via Google Fonts `<link>` in `layout.tsx`. To self-host, swap
  in `next/font/google` and replace the literal `'Inter'` / `'Anton'` family
  names in `globals.css` with the generated CSS variables.
- **Images** use plain `<img>` (the hero floaters and product photos rely on
  `object-fit` / `drop-shadow`). Switch to `next/image` if you want automatic
  optimization — test the floating-photo layout afterwards.
- **Contact form** currently shows a success message client-side only. Wire the
  `#inquiry` submit handler in `public/novipak.js` to your API / email service.
- The 3D model files under `public/peanut/` are only needed for the baked hero
  peanuts; removing them simply triggers the 2D fallback sprite.
