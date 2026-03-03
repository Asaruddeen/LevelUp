/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          900: '#1a1035',
          800: '#2d1b4f',
          700: '#4c2a7a',
          600: '#6b3fa0',
          500: '#8b5cf6',
          400: '#a78bfa',
          300: '#c4b5fd',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}