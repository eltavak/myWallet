
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Это критично для корректной работы путей на GitHub Pages
  build: {
    outDir: 'dist',
  }
})
