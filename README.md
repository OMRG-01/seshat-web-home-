# Seshat Infotech website

Company front site for Seshat Infotech and its products (TryOnMe, Collab, PathoGen, and more to come).

Built with React and Vite. No 3D or animation libraries: the hero emblem is plain SVG driven by one small `requestAnimationFrame` loop.

## Run

```bash
npm install
npm run dev
npm run build
```

## Where things live

- `src/content.js` — contact email and the product list. Add a product here to add a panel.
- `src/components/TryOnMeShow.jsx`, `CollabShow.jsx`, `PathoGenShow.jsx` — each product's animated pictures. `useDepth.js` gives them the entrance and 3D tilt.
- `src/assets/` — optimised product images. Originals live in `assets/`, brand files in `assets/brand/`.
- `src/components/Chakra.jsx` — the hero emblem and its motion (speeds and friction are constants at the top).
- `src/index.css` — palette, fonts and base styles. `src/App.css` — layout.
- `previews/` — the three design options that were compared. Safe to delete.

## Palette

Soft ivory `#F4F0E3`, midnight black `#0A0E16`, neon lime `#C6FF2B`. Lime is only used as a fill or line, never as text on ivory.
