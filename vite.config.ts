import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      "$app/environment",
      "$app/forms",
      "$app/stores",
      "$app/navigation",
    ],
  },

  plugins: [svelte()],

  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
      $app: path.resolve("./src/sveltekit/app"),
    },
  },
});
