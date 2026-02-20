const html = require('eslint-plugin-html');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly'
      }
    },
    rules: {
      semi: 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': 'off'
    }
  },
  {
    files: ['**/*.html'],
    plugins: {
      html
    },
    processor: 'html/html',
    rules: {
      semi: 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': 'off'
    }
  }
];
