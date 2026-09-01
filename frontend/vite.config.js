import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: false,
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/graphql': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
