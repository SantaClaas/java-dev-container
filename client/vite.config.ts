import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    // Needs to be exposed to run in dev container
    host: true,
    // Reverse proxy the server to simulate running on the same domain like in production
     proxy: {
      "/api": {
        target: "http://127.0.0.1:8080/",
        changeOrigin: true,
        // ws: true,
      },
    },
  }
})
