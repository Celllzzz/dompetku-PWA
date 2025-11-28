import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // PENTING: Set false karena kita pakai PWABadge.jsx manual
      
      // Aset statis tambahan yang ingin di-cache
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      // Konfigurasi Manifest (Tampilan di HP)
      manifest: {
        name: 'DompetKu Cashflow',
        short_name: 'DompetKu',
        description: 'Aplikasi Pencatat Keuangan Pribadi',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Agar icon terlihat pas di Android
          }
        ]
      },

      // Konfigurasi Workbox (PENTING: Agar bisa jalan offline)
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'], // File yang akan di-cache
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      // Agar bisa dites di localhost (Mode Dev)
      devOptions: {
        enabled: true,
        type: 'module',
      }
    })
  ],
  
  // Konfigurasi agar bisa diakses dari HP (Network)
  server: {
    host: true, // Ini membuka akses ke IP Network (misal: 192.168.x.x)
    port: 5173  // Port default Vite
  }
})