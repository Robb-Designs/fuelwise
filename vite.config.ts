import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages serves this app from /fuelwise/, so asset URLs must be rooted at that base.
  base: "/fuelwise/",
  plugins: [react(), tailwindcss()],
});
