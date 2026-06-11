import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module environment constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Serverless function handlers directly to mount them on Express
import metricsHandler from './api/metrics.js';
import predictHandler from './api/predict.js';

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API endpoints before routing static files or Vite assets
  app.get('/api/metrics', (req, res) => {
    metricsHandler(req, res);
  });

  app.all('/api/predict', (req, res) => {
    predictHandler(req, res);
  });

  // Hot module reloading is disabled in web containers for agent edits stability,
  // but we mount Vite dev middleware in non-production, and static assets in production.
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting local dev server with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Production mode: Serving static files from dist/');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA fallback route for React router / wouter
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Network Monitor Dashboard] Serving locally at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server boot failure:', err);
  process.exit(1);
});
