import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleSiiCompanyRequest } from './api/sii-company.js'

function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/sii-company', (req, res) => {
        handleSiiCompanyRequest(req, res).catch((error) => {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ message: error.message }))
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [localApiPlugin(), react(), tailwindcss()],
})
