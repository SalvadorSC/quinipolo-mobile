module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'unused-imports'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    'react-native/react-native': true,
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    // Enforce unused variables as errors (blockers)
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // React specific rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',

    // React Native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off',

    // TypeScript specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error', // Changed to error
    '@typescript-eslint/no-non-null-assertion': 'error', // Changed to error
    '@typescript-eslint/strict-boolean-expressions': 'off', // Can enable for stricter null checks
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'off', // Too strict for now
    '@typescript-eslint/no-unsafe-assignment': 'off', // Too strict for now
    '@typescript-eslint/no-unsafe-call': 'off', // Too strict for now

    // General rules
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '*.config.js',
    'metro.config.js',
    'babel.config.js',
  ],
};
