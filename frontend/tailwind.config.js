/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#020817', // Deep midnight navy background
          900: '#040d21',
          850: '#07152B', // Layered dark navy card
          800: '#0B1933', // Elevated card / border
          700: '#112244',
        },
        electric: {
          500: '#258BFF', // Electric blue primary accent
          400: '#4da1ff',
          600: '#1b74de',
        },
        neonviolet: {
          500: '#773BFF', // Neon violet secondary accent
          400: '#9461ff',
          600: '#5c22df',
        },
        cybercyan: {
          500: '#16D9F5', // Highlight accent cyan
          400: '#47e4f8',
        },
        emeraldgreen: {
          500: '#19D3A2', // Success emerald green
          400: '#3ce0b4',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          500: '#16D9F5', // Cyan accent
          600: '#0891b2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
