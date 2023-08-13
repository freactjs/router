import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.tsx'],
    alias: {
      '@': resolve('./src')
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['@freact/core'],
      input: {
        'freact-router': resolve(__dirname, 'src/index.ts')
      },
      output: {
        globals: {
          '@freact/core': 'Freact'
        }
      }
    },
    lib: {
      entry: '',
      name: 'FreactRouter',
      formats: ['es', 'umd', 'iife'],
      fileName: (format, name) => `${name}.${format}.js`
    }
  }
});
