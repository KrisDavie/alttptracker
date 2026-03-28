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
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          redux: ["@reduxjs/toolkit", "react-redux", "redux-remember"],
          ui: ["radix-ui", "@radix-ui/react-slot", "@base-ui/react", "lucide-react"],
          grpc: ["@protobuf-ts/grpcweb-transport", "@protobuf-ts/runtime-rpc", "rxjs"],
          logic: ["./src/data/logic/logic_regions.ts"],
          sram: ["./src/data/sramLocations.ts"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/components/tracker/__tests__/setup.ts"],
  },
});
