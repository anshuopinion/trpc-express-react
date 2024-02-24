import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  server: {
    host: true,
    strictPort: true,
    port: 3000,
  },
});
