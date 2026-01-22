import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'JobTrac',
        short_name: 'JobTrac',
        description: 'The Ultimate Job Search Command Center',
        theme_color: '#4f46e5',
        icons: [
          {
            src: 'assets/jtrac-logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/jtrac-logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase suite
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
          // Animation libraries
          'vendor-animation': ['framer-motion', 'lottie-react', 'react-spring', '@react-spring/web'],
          // Markdown editor and rendering (large)
          'vendor-markdown': ['@uiw/react-md-editor', 'react-markdown', 'react-syntax-highlighter'],
          // Charts library
          'vendor-charts': ['recharts'],
          // PDF generation
          'vendor-pdf': ['jspdf', 'html2canvas'],
          // Date utilities
          'vendor-date': ['date-fns'],
          // UI utilities
          'vendor-ui': ['react-hot-toast', 'react-confetti', 'react-draggable', 'react-helmet-async'],
          // Note: lucide-react removed - let Rollup tree-shake individual icons into their component chunks
        },
      },
    },
  },
});
