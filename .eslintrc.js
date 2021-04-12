module.exports = {
  root: true,
  env: {
    browser: true,
  },
  plugins: [],
  extends: [
    'plugin:node/recommended'
  ],
  rules: {
    'no-undef': ['error'],
    'global-require': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unsupported-features/es-builtins': 'off',
    'node/no-unsupported-features/node-builtins': 'off',
    'no-process-exit': 'off',
  },
};