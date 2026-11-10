import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"

/**
 * Emit a classic deferred <script> instead of type="module", so the built
 * index.html also works when opened straight from disk (file://), where
 * browsers refuse to load module scripts. GitHub Pages works either way.
 */
const classicScript = (): Plugin => ({
  name: "classic-script",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler: (html) =>
      html
        .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
        .replace(/<link rel="stylesheet" crossorigin href=/g, '<link rel="stylesheet" href='),
  },
})

// base "./" keeps every asset path relative, so the built site works on
// GitHub Pages at either username.github.io or username.github.io/repo-name.
export default defineConfig({
  base: "./",
  plugins: [react(), classicScript()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    modulePreload: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: { output: { format: "iife", inlineDynamicImports: true } },
  },
})
