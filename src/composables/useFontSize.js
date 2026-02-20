import { ref } from 'vue'

export function useFontSize() {
  const base = ref(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)
  const apply = v => { document.documentElement.style.fontSize = v + 'px' }
  const increase = () => { base.value = Math.min(22, base.value + 1); apply(base.value) }
  const decrease = () => { base.value = Math.max(14, base.value - 1); apply(base.value) }
  return { base, increase, decrease }
}
