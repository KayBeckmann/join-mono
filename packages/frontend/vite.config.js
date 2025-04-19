import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Definiere hier den '@'-Alias, der auf das 'src'-Verzeichnis zeigt
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  // Optional: Stelle sicher, dass der devServer korrekt konfiguriert ist,
  // falls du Probleme mit Backend-Aufrufen hast (Proxy)
  /*
  server: {
    proxy: {
      '/api': { // Leitet Anfragen an /api an dein Backend weiter
        target: 'http://localhost:3000', // Dein Backend-Port
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: /api Präfix entfernen
      }
    }
  }
  */
})
