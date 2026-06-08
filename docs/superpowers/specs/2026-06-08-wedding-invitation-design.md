# Wedding Invitation Website — Design Spec

**Date:** 2026-06-08
**Author:** Kumaran Rajendhiran
**Status:** Approved

## Purpose

A static website inviting guests to the wedding of **Amrutha Vijayakumar & Kumaran
Rajendhiran**. Hosted on GitHub Pages, auto-deployed on merge to `main`. Visitors see a
digital invitation card; a separate generator page personalizes the greeting per guest and
the card is downloadable as PNG or PDF.

Aesthetic reference: the engagement invitation (`Amrutha Kumaran Engagement Invitation.jpeg`)
— warm cream background with mandala texture, pink lotus accents, marigold garland, magenta
serif names, soft and celebratory.

## Event Details (canonical content)

- **Couple:** Amrutha & Kumaran (both invite, together with their families)
- **Wedding:** Sunday, 13 September 2026, 8:00 AM – 9:30 AM
- **Reception:** Saturday, 12 September 2026, 6:30 PM onwards
- **Venue:** Kalyaani Thirumana Mandapam, Valasaravakkam, Chennai
- **Maps link (QR target):** https://maps.app.goo.gl/LKoMtmw6nNMmhF9T8

Invitation copy:
> Hello[ {Name}],
>
> Together with our families, **Amrutha & Kumaran** joyfully invite you to celebrate their
> wedding as they begin a beautiful journey together.

## Scope

In scope:
- Invitation page (`/`) with personalized greeting via hidden base64 URL param.
- Generator page (`/generate/`) — enter a name, open the personalized invitation.
- QR code to the maps link.
- Download the card as PNG and PDF.
- Petal effect: ambient fall + click burst.
- GitHub Actions auto-deploy to GitHub Pages on push to `main`.
- Minimal devcontainer.

Out of scope (YAGNI):
- RSVP / forms / backend.
- Copy-link and WhatsApp-share buttons on the generator (deferred; generator only "opens
  invitation" for now).
- Couple illustration (using a photo instead).
- Custom domain configuration (documented, applied later by the user).

## Tech Stack

- **Build:** Vite (vanilla JS), multi-page (two HTML entry points).
- **Libraries:** `qrcode` (QR generation), `html2canvas` (DOM capture), `jspdf` (PDF).
- **Fonts:** Google Fonts — Cormorant Garamond (names), EB Garamond / Marcellus (body).
  Must be loaded before any canvas capture (`await document.fonts.ready`).
- **No backend.** Fully static output in `dist/`.

## Design Direction

Layout **B — centered / symmetric**:
- Centered column on a cream + mandala-texture background.
- Pink lotus accents top-left and bottom-right; subtle marigold garland motif.
- Hello line (italic, magenta) at top — this is the personalized line.
- Intro sentence → large magenta serif names "Amrutha & Kumaran" → "begin a beautiful
  journey" subline.
- **Circular photo** of the couple (`assets/couple.jpg`, square-ish). If the asset is
  missing, fall back gracefully to a floral/mandala medallion (no broken image).
- Event details block (wedding, reception, venue).
- QR code (centered, below details).
- Download button fixed at **bottom-left**.

Final flowers/garland rendered with CSS art and/or real lotus/marigold images (not emoji —
emoji were placeholders during brainstorming).

## Page Behavior

### Invitation page (`/`, `index.html`)
1. On load, read URL param `?g=<base64>`.
2. If present and decodes to a non-empty name → first line = `Hello {Name},`.
   Otherwise → `Hello,`.
3. Render QR from the maps link.
4. Initialize petal effect (ambient + click burst).
5. Download button → PNG (default) and PDF. Implemented as two buttons or one button with a
   small PNG/PDF menu, anchored bottom-left.
   - PNG: `html2canvas` on the card element → `toDataURL('image/png')` → trigger download.
   - PDF: same canvas image embedded into a `jspdf` document sized to the card aspect ratio.
   - Filename: `amrutha-kumaran-wedding-invitation.png` / `.pdf`.

### Generator page (`/generate/`, `generate/index.html`)
1. Single text field "Name" + submit button.
2. On submit (click or Enter): trim input; if non-empty, encode → build
   `<base>/?g=<base64>` and open in a new tab (`window.open(url, '_blank')`).
3. Empty name → either disable submit or open the plain (no-param) invitation.

## Encoding (`src/encode.js`)

Unicode-safe base64 so any name survives a round-trip and the URL looks opaque:

```js
export const encodeName = (name) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(name)));

export const decodeName = (b64) => {
  try {
    return new TextDecoder().decode(
      Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    );
  } catch {
    return ""; // malformed param → treat as no name
  }
};
```

**Security note:** base64 is obfuscation, not encryption. The name is trivially decodable by
anyone with the URL. This satisfies the "hide the param from a casual glance" goal only — no
secrets belong in it.

## Module Breakdown (small, single-purpose)

| File | Responsibility | Depends on |
|------|----------------|-----------|
| `src/encode.js` | `encodeName` / `decodeName` | — |
| `src/qr.js` | render QR for a given URL into an element | `qrcode` |
| `src/petals.js` | ambient petal fall + click-burst from cursor | — |
| `src/download.js` | capture card → PNG and PDF download | `html2canvas`, `jspdf` |
| `src/invitation.js` | wire home page (read param, set greeting, QR, petals, download) | encode, qr, petals, download |
| `src/generate.js` | wire generator form → open personalized URL | encode |
| `src/styles.css` | shared theme (colors, fonts, card, floral, petals, button) | — |

Each module is independently testable: pure functions in `encode.js`; DOM-effecting modules
take an explicit target element so they can be exercised in isolation.

## Petal Effect (`src/petals.js`)

- **Ambient:** spawn lotus-pink and marigold petals at random x at the top, drift down with
  slow sway, recycle. Low density (calm).
- **Click burst:** on `click`/`pointerdown`, emit a short burst of petals from the pointer
  coordinates, radiating out and falling.
- Rendered on a full-page overlay layer that does not block clicks (`pointer-events: none`)
  and is excluded from the card capture so it never appears in downloads.
- Respect `prefers-reduced-motion`: reduce or disable animation.

## Deployment

- **GitHub Actions** workflow `.github/workflows/deploy.yml`, triggered on `push` to `main`:
  1. `actions/checkout`
  2. `actions/setup-node` (Node 20), `npm ci`
  3. `npm run build`
  4. `actions/upload-pages-artifact` with `dist/`
  5. `actions/deploy-pages`
- Permissions: `pages: write`, `id-token: write`. Concurrency group so overlapping runs
  don't clash.
- **One-time manual step (user):** Repo Settings → Pages → Source = "GitHub Actions".

### Vite base path
- Now (project page `https://<user>.github.io/wedding-invitation/`): `base:
  '/wedding-invitation/'` in `vite.config.js`.
- Later (custom domain): change `base` to `'/'` and add a `public/CNAME` file containing the
  domain. Documented in README.

## Devcontainer

Minimal `.devcontainer/devcontainer.json`:
- Image: `mcr.microsoft.com/devcontainers/javascript-node:20` (or `node:20`).
- `postCreateCommand`: `npm install`.
- Forward Vite dev port (5173).

## Repo Hygiene

- `.gitignore`: `node_modules/`, `dist/`, `.superpowers/`.
- `README.md`: project intro, local dev (`npm install`, `npm run dev`), build, deploy notes,
  custom-domain switch steps, where to drop `assets/couple.jpg`.
- Keep the engagement JPEG in the repo as the design reference (not shipped in `dist` unless
  placed in `public/`).

## Success Criteria

- `npm run dev` serves both pages locally; `npm run build` produces a working static `dist/`.
- Visiting `/` shows "Hello," ; visiting a generated `/?g=...` URL shows "Hello {Name},".
- Generator turns a typed name into the correct personalized URL and opens it.
- QR scans to the maps link.
- PNG and PDF downloads produce the card without the petal overlay.
- Push to `main` deploys the live site via Actions.
- Layout and palette read as a clear sibling of the engagement invitation.
