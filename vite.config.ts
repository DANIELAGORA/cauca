import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  // OPTIMIZACIÓN INTEGRAL DE BUILD PARA PRODUCCIÓN
  build: {
    rollupOptions: {
      output: {
        // CHUNKING ESTRATÉGICO OPTIMIZADO PARA CARGA DIFERIDA
        manualChunks: (id) => {
          // CHUNK 1: VENDOR CORE (React + DOM - carga crítica)
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-core';
          }
          
          // CHUNK 2: SUPABASE + AUTH (funcionalidad crítica)
          if (id.includes('@supabase') || id.includes('auth')) {
            return 'supabase-auth';
          }
          
          // CHUNK 3: UI COMPONENTS (lazy load por rutas)
          if (id.includes('lucide-react') || id.includes('framer-motion') || 
              id.includes('clsx') || id.includes('tailwind')) {
            return 'ui-components';
          }
          
          // CHUNK 4: CHARTS (solo para dashboards específicos)
          if (id.includes('recharts') || id.includes('chart')) {
            return 'charts-analytics';
          }
          
          // CHUNK 5: IA GENERATIVA (diferida hasta uso)
          if (id.includes('@google/generative-ai') || id.includes('ai')) {
            return 'ai-features';
          }
          
          // CHUNK 6: DASHBOARDS (por role - lazy loading)
          if (id.includes('dashboard') || id.includes('Dashboard')) {
            return 'dashboards';
          }
          
          // CHUNK 7: WIDGETS (modularizado)
          if (id.includes('widget') || id.includes('Widget')) {
            return 'widgets';
          }
          
          // RESTO: vendor general
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
        },
        // OPTIMIZACIÓN DE NOMBRES DE ARCHIVO
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'img/[name]-[hash].[ext]';
          }
          if (/css/i.test(extType)) {
            return 'css/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      },
      // OPTIMIZACIÓN ADICIONAL
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'], // Funciones puras a eliminar
      },
      mangle: {
        safari10: true, // Compatibilidad Safari
      },
      format: {
        comments: false, // Eliminar comentarios
      }
    },
    sourcemap: false,
    // CHUNK SIZE LIMITS OPTIMIZADOS
    chunkSizeWarningLimit: 1000, // 1MB limit
    assetsInlineLimit: 4096, // 4KB inline limit
  },
  // OPTIMIZACIÓN DE SERVIDOR DE DESARROLLO
  server: {
    hmr: {
      overlay: false,
      port: 24678, // Puerto personalizado para HMR
    },
    host: true, // Permitir acceso desde red local
    port: 5173,
    open: false, // No abrir navegador automáticamente
    cors: true,
    // PRE-BUNDLING OPTIMIZADO
    fs: {
      strict: false, // Permitir acceso a archivos fuera del root
    }
  },
  // OPTIMIZACIÓN DE DEPENDENCIAS DE DESARROLLO
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: [
      '@google/generative-ai', // Cargar bajo demanda
      'recharts' // Charts solo cuando se necesiten
    ],
    // CONFIGURACIÓN DE ESBuild PARA PRE-BUNDLING
    esbuildOptions: {
      target: 'esnext',
      minify: false, // En desarrollo no minificar
      sourcemap: true
    }
  },
  // CONFIGURACIÓN DE CSS Y ASSETS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Configuración para PostCSS/TailwindCSS
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
          // CACHE ESTRATÉGICO PARA API DE IA
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gemini-ai-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                // Cache diferenciado por tipo de contenido
                const url = new URL(request.url);
                return `${url.origin}${url.pathname}?v=2.1.0`;
              }
            }
          },
          // CACHE PARA ASSETS DE SUPABASE
          {
            urlPattern: /^https:\/\/.*\.supabase\.co/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-data-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 6 // 6 horas
              }
            }
          },
          // CACHE PARA IMÁGENES Y ASSETS ESTÁTICOS
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          // CACHE PARA ARCHIVOS JS/CSS
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
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
  // CONFIGURACIÓN FINAL DE DEPENDENCIAS (CORREGIDA)
  define: {
    // Variables de entorno para optimización
    __MAIS_VERSION__: JSON.stringify('2.1.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  // CONFIGURACIÓN DE RESOLUCIÓN DE MÓDULOS
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@lib': '/src/lib',
      '@types': '/src/types',
      '@assets': '/src/assets'
    }
  }
});
