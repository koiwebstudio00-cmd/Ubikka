import pageHandler from './api/page';
import seoHandler from './api/seo';
import { readFile } from 'node:fs/promises';
import siteHandler from './api/site';
import inquiriesHandler from './api/inquiries';
import propertiesHandler from './api/properties';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  return {
    plugins: [react(), tailwindcss(), {
      name: 'lokation-catalog',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const pathname = new URL(req.url || '/', 'http://local').pathname;
          if (['/robots.txt', '/sitemap.xml'].includes(pathname)) { await seoHandler(req, res, env); return; }
          if (pathname === '/' || (!/^\/(api|src|node_modules|assets|images|@)/.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname))) {
            const template = await server.transformIndexHtml(req.url || '/', await readFile(path.resolve('index.html'), 'utf8'));
            await pageHandler(req, res, env, template); return;
          }
          next();
        }); server.middlewares.use('/api/site', (req, res) => { void siteHandler(req, res, env); }); server.middlewares.use('/api/inquiries', (req, res) => { void inquiriesHandler(req, res, env); }); server.middlewares.use('/api/properties', (req, res) => { void propertiesHandler(req, res, env); }); },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = new URL(req.url || '/', 'http://local').pathname;
          if (['/robots.txt', '/sitemap.xml'].includes(pathname)) { void seoHandler(req, res, env); return; }
          if (pathname === '/' || (!/^\/(api|src|node_modules|assets|images|@)/.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname))) { void pageHandler(req, res, env); return; }
          next();
        }); server.middlewares.use('/api/site', (req, res) => { void siteHandler(req, res, env); }); server.middlewares.use('/api/inquiries', (req, res) => { void inquiriesHandler(req, res, env); }); server.middlewares.use('/api/properties', (req, res) => { void propertiesHandler(req, res, env); }); },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
