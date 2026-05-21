import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
  build: {
    // Не публикуем исходные карты — затрудняет чтение кода в проде.
    sourcemap: false,
    minify: "esbuild",
  },
  esbuild: {
    // В продакшене вырезаем console/debugger из бандла.
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
