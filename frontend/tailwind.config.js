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
        saas: {
          sidebar: '#031B35', // Dark Navy Sidebar
          primary: '#006B83', // Primary Deep Cyan/Teal
          neoncyan: '#00E5FF', // Futuristic Neon Cyan Highlight
          emerald: '#00C9A7', // Vibrant Emerald
          bg: '#EFF8FF',      // Background Ice Tint
          cards: '#FFFFFF',   // Pure White Cards
          text: '#102A43',    // Dark Navy Typography
          secondary: '#64748B', // Secondary Slate Text
          borders: '#DCEAF5', // Crisp Ice Borders
        },
        brandteal: {
          sidebar: '#031B35', 
          navbar: '#006B83',  
          primary: '#006B83', 
          accent: '#00E5FF',  
          bg: '#EFF8FF',      
          hover: '#005568',   
        },
        midnight: {
          950: '#0a0e17', // Modern Obsidian Charcoal
          900: '#0f172a', // Deep Slate
          850: '#111827', // Crisp Card Background
          800: '#1e293b', // Elevated Surface / Border
          700: '#334155', // Hairline Border
        },
        electric: {
          500: '#2563eb', // Royal Blue Precision Accent
          400: '#3b82f6',
          600: '#1d4ed8',
        },
        neonviolet: {
          500: '#3b82f6', // Refined Slate Cobalt
          400: '#60a5fa',
          600: '#2563eb',
        },
        cybercyan: {
          500: '#0284c7', // Sky Blue Technical Accent
          400: '#38bdf8',
        },
        emeraldgreen: {
          500: '#10b981', // Clean Metric Green
          400: '#34d399',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Precision Royal Blue
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0f172a',
        },
        accent: {
          500: '#0284c7',
          600: '#0369a1'
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
