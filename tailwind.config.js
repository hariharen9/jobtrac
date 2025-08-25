/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0D1117',
        'dark-card': '#161B22',
        'dark-border': '#30363D',
        'dark-text': '#C9D1D9',
        'dark-text-secondary': '#8B949E',
      },
    },
  },
  plugins: [],
};
