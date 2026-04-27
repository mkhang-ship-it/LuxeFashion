import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    cors: true,        // Cho phép Laravel fetch từ port khác
    origin: 'http://localhost:5173',
  },
  base: process.env.NODE_ENV === 'production' ? '/build/' : '/',
  build: {
    outDir: '../../public/build',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'assets/main.js',
        assetFileNames: 'assets/[name][extname]',
      }
    }
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

})
