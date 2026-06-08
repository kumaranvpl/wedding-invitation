import { resolve } from "node:path";
import { defineConfig } from "vite";

// Dev-only: redirect "/generate" -> "/generate/" so the form loads with or
// without the trailing slash. (GitHub Pages does this redirect itself in prod.)
const trailingSlashRedirect = () => ({
  name: "generate-trailing-slash",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/generate") {
        res.writeHead(301, { Location: "/generate/" });
        res.end();
        return;
      }
      next();
    });
  },
});

// Base path differs by mode:
//   dev (serve) -> "/"                  nice local URLs (localhost:5173/)
//   prod (build) -> "/wedding-invitation/"  the GitHub Pages project-page path
//
// When you move to a custom domain (or a <user>.github.io user page), change the
// build base below to "/" and add public/CNAME — see README ("Custom domain").
const PROD_BASE = "/wedding-invitation/";

export default defineConfig(({ mode }) => ({
  // mode is "production" for `vite build` and `vite preview`, "development" for
  // `vite dev`. Keying on mode (not command) makes `npm run preview` match prod.
  base: mode === "production" ? PROD_BASE : "/",
  // "mpa" disables the SPA history fallback that otherwise serves the home page
  // (index.html) for unknown paths — which made /generate look like home.
  appType: "mpa",
  plugins: [trailingSlashRedirect()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        generate: resolve(__dirname, "generate/index.html"),
      },
    },
  },
  test: {
    environment: "jsdom",
  },
}));
