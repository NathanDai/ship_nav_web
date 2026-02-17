import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const TARGET1 = env.TARGET1 || env.REACT_APP_API_URL || 'http://127.0.0.1:7001'

  return {
    plugins: [react()],
    server: {
      host: true, // Allow IP access
      proxy: {
        '/rest': {
          target: TARGET1,
          changeOrigin: true,
        }
      }
    }
  }
})
