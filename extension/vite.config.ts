import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin to copy extension files after build
const copyExtensionFiles = () => ({
  name: 'copy-extension-files',
  closeBundle() {
    const distDir = resolve(__dirname, 'dist');

    // Ensure dist directory exists
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    // Copy manifest.json
    copyFileSync(
      resolve(__dirname, 'manifest.json'),
      resolve(distDir, 'manifest.json')
    );

    // Copy icons
    const iconsDir = resolve(distDir, 'icons');
    if (!existsSync(iconsDir)) {
      mkdirSync(iconsDir, { recursive: true });
    }

    // Copy the logo file used in manifest
    const logoSrc = resolve(__dirname, 'public/icons/jtrac-logo.png');
    if (existsSync(logoSrc)) {
      copyFileSync(logoSrc, resolve(iconsDir, 'jtrac-logo.png'));
    }

    console.log('✓ Copied manifest.json and icons to dist/');
  },
});

// Chrome Extension Vite Config
export default defineConfig({
  root: __dirname, // Set root to extension directory
  plugins: [react(), copyExtensionFiles()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content.ts'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep specific names for extension scripts
          if (chunkInfo.name === 'content') return 'content.js';
          if (chunkInfo.name === 'background') return 'background.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Don't minify for easier debugging during development
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
