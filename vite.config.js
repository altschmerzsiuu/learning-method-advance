import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Reverted to root base for Vercel deployment
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    cors: true,
  }
})
