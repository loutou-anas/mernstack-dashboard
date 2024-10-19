import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    sourcemap: false,
  },
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'leaflet', 'chart.js'],
  },
});
