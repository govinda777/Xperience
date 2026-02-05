import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
        globalThis: true,
      },
      // Whether to polyfill `global`
      protocolImports: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },
      manifest: {
        name: "Xperience - Mentoria para Empreendedores",
        short_name: "Xperience",
        description:
          "Programa de mentoria para empreendedores que desejam transformar suas ideias em negócios de sucesso",
        theme_color: "#FD9526",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/logo.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/logo.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  base: "/", // Configurado para domínio personalizado
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [
        "unenv/node/process",
        "unenv/node/events",
      ],
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          analytics: ["react-ga4", "react-helmet-async"],
          wallet: [
            "@walletconnect/ethereum-provider",
            "@walletconnect/universal-provider",
          ],
          ton: [
            "ton",
            "ton-core",
            "ton-crypto",
            "@orbs-network/ton-access",
            "@tonconnect/ui-react",
          ],
          ui: ["styled-components", "lucide-react"],
        },
      },
      onwarn(warning, warn) {
        if (
          warning.code === "ANNOTATION_POSITION" ||
          warning.code === "MODULE_LEVEL_DIRECTIVE" ||
          warning.code === "UNUSED_EXTERNAL_IMPORT" ||
          warning.code === "EVAL" ||
          warning.message.includes("unenv/node/events") ||
          warning.message.includes("unenv/node/process")
        ) {
          return;
        }
        warn(warning);
      },
    },
    // Otimizações de performance
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
      format: {
        comments: false,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
  },
  // Otimizações de desenvolvimento
  server: {
    port: 5173,
    host: true,
    strictPort: true, // Falha se a porta já estiver em uso em vez de tentar a próxima porta disponível
  },
  // Resolve configuration to handle Node.js modules
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
      events: path.resolve(__dirname, "node_modules/events"),
      "unenv/node/process": path.resolve(
        __dirname,
        "node_modules/process/browser.js",
      ),
      // Removendo aliases problemáticos para valtio
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [],
    },
    include: [
      "process/browser",
      "events",
      "stream-browserify",
      "util",
    ],
  },
  // Define global variables
  define: {
    global: "globalThis",
    "process.env": {},
  },
});
