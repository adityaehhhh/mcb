/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#0a0d12',
          900: '#0f141c',
          850: '#141b26',
          800: '#1b2432',
          700: '#263447',
          600: '#384b63',
          500: '#526985',
          400: '#7e95b3',
          300: '#a8bcd4',
          200: '#d0ddef',
          100: '#eef3fa',
        },
        accent: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          electric: '#38bdf8',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 242, 254, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-rose': '0 0 20px rgba(244, 63, 94, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'electric-flow': 'electricFlow 2s linear infinite',
      },
      keyframes: {
        electricFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
