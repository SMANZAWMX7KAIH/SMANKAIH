import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * Determines the correct public base path:
 * 1. Explicit VITE_BASE_PATH or BASE_PATH if set (e.g. from GitHub Actions)
 * 2. GITHUB_REPOSITORY (e.g. SMANZAWMX7KAIH/SMANKAIH -> /SMANKAIH/)
 * 3. Default production path for SMANKAIH repository is '/SMANKAIH/'
 * 4. Development mode uses '/'
 */
function resolveBasePath(mode: string): string {
  const explicitBase = process.env.VITE_BASE_PATH || process.env.BASE_PATH;
  if (explicitBase !== undefined && explicitBase.trim() !== '') {
    let b = explicitBase.trim();
    if (!b.startsWith('/') && !b.startsWith('.')) {
      b = '/' + b;
    }
    if (!b.endsWith('/')) {
      b = b + '/';
    }
    return b;
  }

  if (process.env.GITHUB_REPOSITORY) {
    const repoParts = process.env.GITHUB_REPOSITORY.split('/');
    const repoName = repoParts[1] || 'SMANKAIH';
    return `/${repoName}/`;
  }

  if (mode === 'production' || process.env.NODE_ENV === 'production') {
    return '/SMANKAIH/';
  }

  return '/';
}

export default defineConfig(({ mode }) => {
  const base = resolveBasePath(mode);

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/canvas-confetti')) {
              return 'vendor-confetti';
            }
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
