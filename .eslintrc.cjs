module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script'
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ['html'],
  extends: [
    'eslint:recommended'
  ],
  rules: {
    semi: ['error', 'always'],
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-console': 'off'
  }
};
