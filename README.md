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

The default project-page URL is `https://<your-user>.github.io/wedding-invitation/`.

## Custom domain (later)

1. In `vite.config.js`, change `base: "/wedding-invitation/"` to `base: "/"`.
2. Create `public/CNAME` containing your domain (e.g. `amrutha-kumaran.com`).
3. Configure the domain's DNS and set it under **Settings → Pages → Custom domain**.
4. Push to `main` — the site redeploys at the custom domain.
