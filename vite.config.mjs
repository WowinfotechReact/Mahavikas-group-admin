import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  
  return {
    server: {
      open: true,
      port: 3000
    },
    define: {
      global: 'window'
    },
    base: '/', // Change this to root path
    preview: {
      open: true,
      port: 3000
    },
    plugins: [react(), jsconfigPaths()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});
