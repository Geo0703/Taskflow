import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const apiUrl = loadEnv(mode, process.cwd()).VITE_API_URL

  if (!apiUrl) {
    throw new Error('VITE_API_URL precisa estar definida no arquivo .env.')
  }

  const apiBase = new URL(apiUrl)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/crudcrud-api': {
          target: apiBase.origin,
          changeOrigin: true,
          rewrite: (path) => `${apiBase.pathname}${path.slice('/crudcrud-api'.length)}`,
        },
      },
    },
  }
})
