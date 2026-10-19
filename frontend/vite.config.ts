import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite + React — ADR 001 (stack do projeto)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
})
