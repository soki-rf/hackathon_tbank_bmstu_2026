// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,           // порт, на котором работает Vite (по умолчанию)
    proxy: {
      '/api': {
        target: 'http://195.19.38.239:8080',   // адрес Spring Boot приложения
        changeOrigin: true,                // меняем Origin заголовок
        secure: false,                     // для разработки с HTTP
        // rewrite: (path) => path         // опционально
      }
    }
  }
})