/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steampunk: {
          dark: '#120f0d',
          panel: '#1e1815',
          slot: '#2a221d',
          slotBorder: '#4a3b32',
          brass: '#d4a359',
          brassLight: '#f3c98b',
          copper: '#c86d51',
          copperGlow: '#e07a5f',
          bronze: '#8c5338',
          gear: '#70645c',
          steam: '#cbd5e1',
          electric: '#00f2fe',
          electricPulse: '#4facfe',
          gaugeGreen: '#4ade80',
          gaugeRed: '#ef4444',
          overdrive: '#f97316'
        }
      },
      boxShadow: {
        'steampunk': '0 8px 30px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(212, 163, 89, 0.3)',
        'brass-glow': '0 0 15px rgba(212, 163, 89, 0.5)',
        'electric-glow': '0 0 15px rgba(0, 242, 254, 0.7)',
        'overdrive-glow': '0 0 25px rgba(249, 115, 22, 0.8)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' }
        },
        gearRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'spin-slow': 'gearRotate 12s linear infinite'
      }
    },
  },
  plugins: [],
}
