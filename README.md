# Wedding Invitation — Amrutha & Kumaran

A small static website inviting guests to the wedding of **Amrutha Vijayakumar &
Kumaran Rajendhiran**, hosted on GitHub Pages and auto-deployed on every push to
`main`.

- **Wedding:** Sunday, 13 September 2026, 8:00 AM – 9:30 AM
- **Reception:** Saturday, 12 September 2026, 6:30 PM onwards
- **Venue:** Kalyaani Thirumana Mandapam, Valasaravakkam, Chennai

## Pages

- `/` — the invitation card. A personalized greeting can be passed via a hidden,
  base64-encoded URL param `?g=<token>` (e.g. shows `Hello Mahandril Alagusabai,`).
  Includes a QR code to the venue location, a petal effect (ambient drift + click
  burst), and a **Download** button (PNG / PDF) at the bottom-left.
- `/generate/` — type a guest's name and open their personalized invitation in a
  new tab.

> **Note:** the `?g=` token is base64 — obfuscation, not security. Anyone with the
> URL can decode the name. Don't put anything sensitive in it.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # run unit tests (encode round-trip)
npm run build    # outputs static site to dist/
npm run preview  # serve the production build locally
```

A devcontainer is included (`.devcontainer/`) — open in a container and deps install
automatically.

## Couple photo

Drop a square-ish photo at `public/assets/couple.jpg`. It appears in the circular
frame on the invitation. If the file is absent, a floral medallion is shown instead.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages
on every push to `main`.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment →
Source** and select **GitHub Actions**.

## Hosting at the site root

The site is built with `base: "/"` (see `vite.config.js`), so the invitation lives
at `/`, not `/wedding-invitation/`. This is correct for:

- a **custom domain** (recommended — you plan to add one), or
- a **user/org page** repo named `<your-user>.github.io`.

It is **not** correct for a bare project page served at
`https://<your-user>.github.io/wedding-invitation/` — there the asset paths would
break. If you deploy that way before setting up a custom domain, change `base` back
to `"/wedding-invitation/"` temporarily.

## Custom domain

1. Create `public/CNAME` containing your domain (e.g. `amrutha-kumaran.com`).
2. Configure the domain's DNS and set it under **Settings → Pages → Custom domain**.
3. Push to `main` — the site redeploys at the custom domain (base is already `/`).
