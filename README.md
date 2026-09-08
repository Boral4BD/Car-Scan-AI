# CarScan AI

Static one-page site. No build step.

## Deploy

- **GitHub Pages** — commit `index.html` and this README to the repo, then Settings → Pages → Deploy from branch → `main` / `/ (root)`.
- **Netlify / Cloudflare Pages** — drag the folder in, or connect the repo with an empty build command and `/` as the output directory.

## Contents

- `index.html` — the entire site: markup, styles, scripts, logo images and both 3D scanner views embedded inline.

## Runtime requests

Two public CDNs load at runtime, no key or account needed: Google Fonts (Barlow, Barlow Condensed) and unpkg (three.js 0.184.0, used by the 3D views). Everything else is local to the file.

## Notes

- The "copy message" button in the app demo needs HTTPS — fine on any host, won't work if you open the file straight off disk.
- Section 1.3 has an empty photo placeholder for a shot of the scanner in the OBD2 port.
