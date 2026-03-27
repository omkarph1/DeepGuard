import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replace(/\\/g, '/')
          if (path.includes('/node_modules/')) {
            if (
              path.includes('/node_modules/react/') ||
              path.includes('/node_modules/react-dom/') ||
              path.includes('/node_modules/react-router/') ||
              path.includes('/node_modules/react-router-dom/')
            ) {
              return 'react-vendor'
            }
            if (path.includes('/node_modules/framer-motion/')) return 'motion-vendor'
            if (
              path.includes('/node_modules/three/') ||
              path.includes('/node_modules/@react-three/fiber/') ||
              path.includes('/node_modules/@react-three/drei/')
            ) {
              return 'three-vendor'
            }
            if (path.includes('/node_modules/recharts/')) return 'charts-vendor'
            if (
              path.includes('/node_modules/jspdf/') ||
              path.includes('/node_modules/html2canvas/')
            ) {
              return 'pdf-vendor'
            }
          }
          return undefined
        },
      },
    },
  },
})
