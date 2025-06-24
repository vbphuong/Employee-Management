// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#012626',
        'custom-teal': '#1F7363',
        'custom-green': '#72BF6F',
        'custom-yellow': '#EEF277',
        'custom-orange': '#F25922',
      },
    },
  },
  plugins: [],
};