/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#d8f5f6',
          200: '#b9ecef',
          500: '#55bdc4',
          700: '#34979f',
        },
        surface: {
          100: '#eceff0',
          200: '#d7dcde',
        },
      },
    },
  },
  plugins: [],
};
