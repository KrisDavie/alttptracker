/// <reference types="vitest" />
import path from "path"
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    proxy: {
      "/api/ladder": {
        target: "https://alttpr.racing/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ladder/, ""),
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
      include: "**/*.tsx",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/components/tracker/__tests__/setup.ts"],
  },
});
