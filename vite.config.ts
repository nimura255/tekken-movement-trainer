import react from '@vitejs/plugin-react'
import path from "node:path";
import { defineConfig } from 'vite'

const srcPath = path.resolve(__dirname, 'src');

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      $: path.resolve(srcPath)
    },
  },
})
