import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Permite ajustar o base path em tempo de build.
// Em CI usa BASE_PATH da env (ex.: './' para caminhos relativos).
// Em dev/local mantém '/'.
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
