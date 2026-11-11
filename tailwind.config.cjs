/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          surface: '#12131c',
          card: '#161826',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1e2133',
        },
        primary: {
          DEFAULT: '#6366f1', // indigo
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'subtle': '10px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
      },
    },
  },
  plugins: [],
};
