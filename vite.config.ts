import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Lovable-tagger removed — this config works on localhost, any cloud
// provider (Netlify, Vercel, Railway, VPS) or a self-hosted server.
export default defineConfig(({ mode }) => ({
  server: {
    // '0.0.0.0' lets you access from other devices on the same LAN
    // (e.g. your phone at http://YOUR_PC_IP:5173).
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },
  preview: {
    // For npm run preview (serves the production build locally)
    host: '0.0.0.0',
    port: 4173,
  },
  plugins: [
    react(),
    // componentTagger() from lovable-tagger removed — it only works
    // inside the Lovable cloud editor and errors out everywhere else.
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Deploy the dist/ folder to Netlify, Vercel, Nginx, Apache,
    // GitHub Pages, Railway, or any static host.
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
          map: ['leaflet'],
          charts: ['recharts'],
        },
      },
    },
  },
}));
