import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const repoName = env.GITHUB_REPOSITORY ? env.GITHUB_REPOSITORY.split('/')[1] : '';
  const base = env.VITE_BASE_PATH || (repoName ? `/${repoName}/` : './');

  return {
    base,
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
    build: {
      // Three.js is 747 kB uncompressed but about 192 kB gzipped.
      chunkSizeWarningLimit: 800,
    },
  };
});
