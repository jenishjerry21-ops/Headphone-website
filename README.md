# Headphone Expo

A responsive editorial headphone showcase built with React, TypeScript, Vite, GSAP ScrollTrigger, and Lenis. The three headphone PNGs supplied with the request are included as transparent product assets in `public/assets/`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`; use `npm run preview` to view that build locally.

## Customize

- Product names, image paths, and color labels live in `src/App.tsx` in the `products` array.
- Replace files in `public/assets/` to use alternate transparent product photography. Keep the existing filenames or update the `image` values.
- Scroll effects are in the `useLayoutEffect` GSAP context in `src/App.tsx`.
- Layout and responsive styling are in `src/style.css`.

Fonts load from Google Fonts; system sans-serif fallbacks are included.
