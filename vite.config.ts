import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative base so the app works when hosted in a sub-path (e.g. GitHub Pages /<repo>/).
  base: './',
  plugins: [react()],
})
