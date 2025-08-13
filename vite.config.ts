import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  // Optimización de build para producción
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['lucide-react', 'framer-motion', 'clsx'],
          ai: ['@google/generative-ai']
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    sourcemap: false
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gemini-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      manifest: {
        name: 'MAIS Centro de Mando Político',
        short_name: 'MAIS',
        description: 'Plataforma de gestión y monitoreo para campañas políticas del Movimiento Alternativo Indígena y Social. Desarrollado por Daniel Lopez DSimnivaciones.',
        theme_color: '#DC2626',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['politics', 'business', 'productivity'],
        lang: 'es-CO',
        icons: [
          {
            src: '/app.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/app.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/app.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/app.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/screenshot-narrow.png', 
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ],
      },
      // Configuración para generar iconos PNG a partir del SVG
      // Esto requiere que el SVG sea compatible con la generación de PNGs
      // y que el plugin tenga las dependencias necesarias (ej. sharp)
      // Si esto falla, necesitarás generar los PNGs manualmente a partir del SVG.
      includeAssets: ['mais-logo.svg'],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
