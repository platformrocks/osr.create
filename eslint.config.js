import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**', 
      'node_modules/**', 
      '*.js', 
      '*.mjs', 
      '*.cjs', 
      'eslint.config.js',
      'commitlint.config.js',
      '.husky/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // General JavaScript/TypeScript rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off', // CLI tool needs console
      eqeqeq: ['error', 'always'],
      'no-empty': 'off', // Allow empty catch blocks for optional operations

      // Error handling
      'no-throw-literal': 'error'
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  }
);
