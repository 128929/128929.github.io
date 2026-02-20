import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    files: ['src/**/*.{js,vue,ts}'],
    languageOptions: { ecmaVersion: 2021, sourceType: 'module', parser: vueParser },
    plugins: { vue },
    rules: {
      'no-unused-vars': 'warn'
    }
  }
]
