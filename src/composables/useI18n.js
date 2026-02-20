import { ref } from 'vue'

const messages = {
  zh: { comment: '评论' },
  en: { comment: 'Comments' }
}

export function useI18n() {
  const lang = ref(localStorage.getItem('lang') || 'zh')
  const setLang = v => { lang.value = v; localStorage.setItem('lang', v) }
  const t = k => messages[lang.value][k] || k
  return { lang, setLang, t }
}
