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
      manifestFilename: 'manifest.json',
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
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
