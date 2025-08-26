const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#161B22',
        'dark-card': '#1F242B',
        'dark-border': '#3A3F48',
        'dark-text': '#B4BCC5',
        'dark-text-secondary': '#7E8995',
        'amoled-bg': '#000000',
        'amoled-card': '#000000',
        'amoled-border': '#333333',
        'amoled-text': '#FFFFFF',
        'amoled-text-secondary': '#AAAAAA',
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('amoled', '.amoled & ');
    }),
  ],
};
