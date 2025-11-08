import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDocker = process.env.DOCKER_ENV === 'true'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: isDocker ? 'http://server:5000' : 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
