import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function resolverBase(valorBruto: string | undefined): string {
  if (valorBruto === undefined) {
    return '/';
  }

  const base = valorBruto.trim();
  if (!base.startsWith('/')) {
    throw new Error(
      `VITE_APP_BASE inválida: "${valorBruto}". Use um caminho começando com "/" (ex.: "/" ou "/bits-planning/").`,
    );
  }

  return base;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: resolverBase(env.VITE_APP_BASE),
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});
