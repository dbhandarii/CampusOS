/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed', // electric purple accent
        secondary: '#6366f1', // indigo accent
        accent: '#2563eb', // blue accent
        background: '#0a0a0a', // deep charcoal
        surface: '#1a1a1a', // dark surface for cards
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
};

