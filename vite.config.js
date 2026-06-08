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

// Served from the site root. This is correct for a custom domain or a
// <user>.github.io user/org page. For a bare project page
// (<user>.github.io/wedding-invitation/) without a custom domain, asset paths
// would break — see README ("Hosting at the site root").
export default defineConfig({
  base: "/",
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
});
