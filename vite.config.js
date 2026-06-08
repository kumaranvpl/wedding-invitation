import { resolve } from "node:path";
import { defineConfig } from "vite";

// Project-page base path. When you move to a custom domain, change this to "/"
// and add public/CNAME (see README).
export default defineConfig({
  base: "/wedding-invitation/",
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
