import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isDocker = process.env.DOCKER_ENV === "true";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: isDocker ? "http://server:5000" : "http://localhost:5002",
        changeOrigin: true,
      },
      // Proxy uploaded documents to backend during development so links like
      // /uploads/<file> open the actual file instead of being handled by the SPA.
      "/uploads": {
        target: isDocker ? "http://server:5000" : "http://localhost:5002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, "/uploads"),
      },
    },
  },
});
