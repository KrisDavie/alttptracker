/// <reference types="vitest" />
import path from "path"
import { execSync } from "node:child_process"
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Resolve a build/version identifier from git so exported state snapshots can be
// traced back to the exact commit a user was running. Falls back gracefully when
// git is unavailable (e.g. building from a tarball).
function resolveAppVersion(): string {
  try {
    const hash = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    let dirty = "";
    try {
      const porcelain = execSync("git status --porcelain", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      if (porcelain) dirty = "-dirty";
    } catch { /* ignore */ }
    return `${hash}${dirty}`;
  } catch {
    return "unknown";
  }
}

const appVersion = resolveAppVersion();

// https://vite.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
  },
  server: {
    host: true,
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
