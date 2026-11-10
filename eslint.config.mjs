import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Layers, from the bottom up. A file may import from its own layer and from the layers
 * listed before it, never from the ones after (docs/ARCHITECTURE.md):
 *
 *   lib, i18n  ->  content  ->  components  ->  features  ->  app
 */
const forbid = (...layers) => ({
  patterns: layers.map((layer) => ({
    group: [`@/${layer}`, `@/${layer}/*`, `@/${layer}/**`],
    message: `This layer must not depend on "${layer}". See docs/ARCHITECTURE.md.`,
  })),
});

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/no-cycle': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['src/lib/**', 'src/i18n/**'],
    rules: {
      'no-restricted-imports': ['error', forbid('content', 'components', 'features', 'app')],
    },
  },
  {
    files: ['src/content/**'],
    rules: { 'no-restricted-imports': ['error', forbid('components', 'features', 'app')] },
  },
  {
    files: ['src/components/**'],
    rules: { 'no-restricted-imports': ['error', forbid('features', 'app')] },
  },
  {
    files: ['src/features/**'],
    rules: { 'no-restricted-imports': ['error', forbid('app')] },
  },
  {
    // Integrity tests check content against the layers that consume it.
    files: ['src/**/*.test.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    // Command-line tools report progress on stdout.
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
]);
