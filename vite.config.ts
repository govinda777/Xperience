import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from 'vite-plugin-pwa';

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
      },
      // Whether to polyfill `global`
      protocolImports: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
      },
      manifest: {
        name: 'Xperience - Mentoria para Empreendedores',
        short_name: 'Xperience',
        description: 'Programa de mentoria para empreendedores que desejam transformar suas ideias em negócios de sucesso',
        theme_color: '#FD9526',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  base: '/', // Removido prefixo GitHub Pages
  build: {
    rollupOptions: {
      external: [
        'unenv/node/process',
        'unenv/node/global',
        'unenv/node/buffer'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          analytics: ['react-ga4', 'react-helmet-async']
        }
      }
    },
    // Otimizações de performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Otimizações de desenvolvimento
  server: {
    port: 5173,
    host: true
  },
  // Resolve configuration to handle Node.js modules
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  // Define global variables
  define: {
    global: 'globalThis',
  },
});