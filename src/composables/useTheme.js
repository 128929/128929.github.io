import { ref } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || '')
  const set = v => {
    theme.value = v
    localStorage.setItem('theme', v)
    document.documentElement.setAttribute('data-theme', v === 'dark' ? 'dark' : 'light')
  }
  const toggleTheme = () => set(theme.value === 'dark' ? 'light' : 'dark')
  if (!theme.value) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    set(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', e => !localStorage.getItem('theme') && set(e.matches ? 'dark' : 'light'))
  } else {
    set(theme.value)
  }
  return { theme, toggleTheme }
}
