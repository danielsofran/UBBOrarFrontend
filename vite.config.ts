/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa"
import { defineConfig } from 'vite'

const apiBaseUrl = 'https://horatiu-udrea.github.io/cs-ubb-timetable-parser/'
const staticWebAppUrl = 'https://danielsofran.github.io/UBBOrarFrontend/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp(`^${apiBaseUrl}.*`),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 25,
                maxAgeSeconds: 60 * 60 * 24 * 7 * 4, // 4 week
              },
            },
          },
          {
            urlPattern: new RegExp(`^${staticWebAppUrl}.*`),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-web-app-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 * 4, // 4 week
              },
            },
          }
        ],
      },
      manifest: { // copy manifest from public/manifest.json
        "short_name": "UBB Orar",
        "name": "UBB Orar FMI",
        "description": "Orarul Facultății de Matematică și Informatică din cadrul Universității Babeș-Bolyai",
        "icons": [
          {
            "src": "/ubb.png",
            "sizes": "256x256 192x192 128x128 96x96 64x64 48x48 32x32 24x24 16x16",
            "type": "image/png"
          },
          {
            "src": "/ubb.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "maskable"
          }
        ],
        "screenshots": [
          {
            "src": "/ss-desk.png",
            "sizes": "1280x720",
            "type": "image/png",
            "focus_mode": "center",
            "form_factor": "wide"
          },
          {
            "src": "/ss-mobile.png",
            "sizes": "720x1280",
            "type": "image/png",
            "focus_mode": "center",
            "form_factor": "narrow"
          }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "#ffffff",
        "background_color": "#ffffff",
        "orientation": "portrait",
        "display_override": ["window-controls-overlay", "standalone", "browser"]
      }
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
