import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const jqueryUiVersion = JSON.parse(
  readFileSync('./node_modules/jquery-ui/package.json', 'utf8')
).version;

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['jquery', 'jquery-ui'],
  }
});
