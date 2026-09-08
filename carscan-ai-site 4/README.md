# CarScan AI — static site

Single self-contained page. No build step, no server-side code.

## Deploy

**Netlify (drag & drop):** drag this folder onto app.netlify.com/drop → live link.
**GitHub Pages:** commit the contents of this folder to a repo, then Settings → Pages → Deploy from branch → `/ (root)`.
**Cloudflare Pages:** connect the repo, leave build command empty, output directory `/`.

## Contents

- `index.html` — the whole site: markup, styles, scripts, logo images and the 3D scanner models are all embedded inline.
- `_headers`, `netlify.toml` — optional caching/config for Netlify; harmless elsewhere.
- `404.html` — falls back to the site.

## External requests

Two public CDNs are loaded at runtime (both CORS-enabled, no account or key needed):

- Google Fonts — Barlow / Barlow Condensed
- unpkg — three.js 0.184.0 (subresource-integrity pinned), used by the two 3D views

Everything else is local. If you need a fully offline build, download those files and swap the URLs in the `<link>` tag and the import map near the top of `index.html`.
