import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';

  // Real repository detection without guessing:
  // 1. Explicit VITE_BASE_PATH / BASE_PATH if set
  // 2. In GitHub Actions, GITHUB_REPOSITORY is automatically provided as 'OWNER/REPO' (e.g. SMANZAWMX7KAIH/SMANKAIH)
  // 3. Fallback to relative './' for production so it works under ANY repository name or custom domain without guessing
  // 4. In development, use '/'
  let base = '/';
  if (isProduction) {
    if (process.env.VITE_BASE_PATH) {
      base = process.env.VITE_BASE_PATH;
    } else if (process.env.GITHUB_REPOSITORY) {
      const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
      base = repoName ? `/${repoName}/` : './';
    } else {
      base = './';
    }
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
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
