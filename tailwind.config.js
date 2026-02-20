module.exports = {
  darkMode: 'class',
  content: ['src/**/*.{vue,js,ts}', 'index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#49b1f5',
        card: '#ffffff',
        sidebar: '#f6f8fa',
        text: '#4c4948',
        lightgrey: '#eeeeee',
        darkgrey: '#cacaca'
      },
      screens: {
        '4k': '3840px'
      }
    }
  }
}
