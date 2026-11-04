import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.ts'],
      refresh: true,
      hotFile: process.env.VITE_HOT_FILE ?? 'public/hot',
    }),
    vue(),
  ],
  server: {
    host: '127.0.0.1',
    port: Number(process.env.VITE_PORT ?? 5173),
    strictPort: true,
    proxy: { '/api': process.env.APP_URL ?? 'http://127.0.0.1:8000' },
  },
})
