import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'explay. Learning Platform',
        short_name: 'explay.',
        description: 'Aplikasi Pembelajaran Eksposisi untuk SMP',
        theme_color: '#FAFAF8',
        background_color: '#FAFAF8',
        display: 'standalone',
        icons: [
          {
            src: 'fkip-logo.jpg', // Menggunakan logo yang sudah ada
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'fkip-logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      },
      workbox: {
        // Keamanan: Cache hanya assets statis, BUKAN API calls Supabase
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest/,
            handler: 'NetworkOnly', // API Supabase TIDAK boleh di-cache (Selalu Ambil Fresh)
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage/,
            handler: 'CacheFirst',  // Gambar/Avatar boleh di-cache biar cepet
            options: {
              cacheName: 'supabase-storage',
              expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    cors: true,
  }
});
