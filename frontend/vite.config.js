import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/HRMS-Lite/', // Production base path: kapilraghav.info/HRMS-Lite/
  build: {
    outDir: 'dist',
    minify: 'terser', // Better minification
    sourcemap: false, // Smaller build size
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
