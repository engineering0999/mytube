import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps
    minify: 'terser', // Use Terser for minification
    terserOptions: {
      mangle: {
        properties: {
          reserved: ['uy'], // Reserve the variable name to avoid renaming
        },
      },
    },
  },
});
