import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function jsonStoragePlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), 'data');
  const filePath = path.resolve(dataDir, 'bookmarks.json');

  const prefsFilePath = path.resolve(dataDir, 'preferences.json');

  const handler = (req: any, res: any, next: any) => {
    const isBookmarks = req.url === '/api/bookmarks' || req.url?.startsWith('/api/bookmarks?');
    const isPrefs = req.url === '/api/preferences' || req.url?.startsWith('/api/preferences?');

    if (isBookmarks || isPrefs) {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const targetPath = isBookmarks ? filePath : prefsFilePath;

      if (req.method === 'GET') {
        try {
          if (!fs.existsSync(targetPath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `${isBookmarks ? 'bookmarks.json' : 'preferences.json'} not found` }));
            return;
          }
          const content = fs.readFileSync(targetPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(content);
        } catch {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to read data file' }));
        }
        return;
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            fs.writeFileSync(targetPath, JSON.stringify(parsed, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ success: true }));
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }

      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.end();
        return;
      }
    }
    next();
  };

  return {
    name: 'json-storage-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsonStoragePlugin()],
});
