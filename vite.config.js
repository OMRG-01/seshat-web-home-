import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the built site works both on a custom domain and on
  // the default github.io/<repo> address.
  base: './',
})
