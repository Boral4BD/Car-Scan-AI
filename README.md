# CarScan AI — static site

Plain static site. No build step, no bundler.

## Deploy to GitHub Pages

1. Commit the **contents of this folder** (not the folder itself) to the repo root:
   `index.html`, `support.js`, `image-slot.js`, `carscan-3d-all.js`, `assets/`, `.nojekyll`
2. Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
3. Wait about a minute, then open the URL.

Commit `.nojekyll` too — without it GitHub's Jekyll step can skip files.

## Netlify / Cloudflare Pages

Drag the folder onto app.netlify.com/drop, or connect the repo with an empty build command and `/` as the publish directory.

## Files

- `index.html` — the whole site: markup, styles, page logic
- `support.js` — rendering runtime the page needs
- `carscan-3d-all.js` — both 3D views (hero scanner, exploded anatomy)
- `image-slot.js` — photo placeholder component
- `assets/` — logo images

All paths are relative, so it works from any repo, any subfolder, any domain.

## Runtime requests

Public CDNs, no key or account needed: unpkg (React 18.3.1, Babel standalone, three.js 0.184.0) and Google Fonts (Barlow, Barlow Condensed).

## Notes

- Must be served over http(s). Opening `index.html` by double-clicking it off disk will not work — browsers block script loading from `file://`.
- The app prototype lives at `#/app-demo`, linked from the page.
- Section 1.3 has an empty photo placeholder for a shot of the scanner plugged into an OBD2 port.
