import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: 'react'
  })],
  
  build: {
    // Code splitting optimizado
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react']
        }
      }
    },
    
    // Target modern browsers
    target: 'es2020',
    
    // Chunk size warning
    chunkSizeWarningLimit: 600,
    
    // Minify con esbuild (más rápido que terser)
    minify: 'esbuild',
    
    // No sourcemaps en production (más rápido)
    sourcemap: false,
    
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  },
  
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    transformMode: {
      web: [/\.[jt]sx?$/]
    },
    env: {
      VITE_API_URL: 'http://localhost:3000/api',
      VITE_NEURA_GW_URL: 'http://localhost:3000',
      VITE_NEURA_GW_KEY: 'test-key'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}'
      ]
    }
  },
  
})
