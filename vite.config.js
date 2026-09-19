import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Custom plugin to serve Vercel /api routes locally in Vite
function vercelApiPlugin() {
  return {
    name: 'vercel-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/scan-floor-plan') || req.url.startsWith('/api/meta-capi')) {
          try {
            // Read body
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
              req.body = body;
              
              // Mock res.status() and res.json() for Vercel API compatibility
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };

              // Import the handler dynamically (busting cache if needed, but this is simple)
              let handlerPath = '';
              if (req.url.startsWith('/api/scan-floor-plan')) {
                handlerPath = path.resolve(import.meta.dirname, './api/scan-floor-plan.js');
              } else {
                handlerPath = path.resolve(import.meta.dirname, './api/meta-capi.js');
              }
              const { default: handler } = await import(`file://${handlerPath}`);
              
              await handler(req, res);
            });
          } catch (err) {
            console.error('API Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/gemini/, ''),
      },
    },
  },
})
