import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['tests/**/*.{spec,test}.{js,ts}'],
    exclude: ['node_modules/**', 'tests/openclaw-feishu-layout.spec.ts', 'tests/console-errors.spec.ts'],
    environment: 'jsdom'
  }
})
