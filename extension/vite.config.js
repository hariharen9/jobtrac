import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
// Plugin to copy extension files after build
var copyExtensionFiles = function () { return ({
    name: 'copy-extension-files',
    closeBundle: function () {
        // Copy manifest.json
        copyFileSync(resolve(__dirname, 'manifest.json'), resolve(__dirname, 'dist/manifest.json'));
        // Copy icons
        var iconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(iconsDir)) {
            mkdirSync(iconsDir, { recursive: true });
        }
        copyFileSync(resolve(__dirname, 'public/icons/icon.svg'), resolve(__dirname, 'dist/icons/icon.svg'));
        console.log('✓ Copied manifest.json and icons to dist/');
    },
}); };
// Chrome Extension Vite Config
export default defineConfig({
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
                entryFileNames: function (chunkInfo) {
                    // Keep specific names for extension scripts
                    if (chunkInfo.name === 'content')
                        return 'content.js';
                    if (chunkInfo.name === 'background')
                        return 'background.js';
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
