import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        'game-bg': '#0f0f1a',
        'game-card': '#1a1a2e',
        'game-card-alt': '#16213e',
        'game-accent': '#22d3ee',
        'game-accent-2': '#e879f9',
        'game-success': '#10b981',
        'game-warning': '#f59e0b',
        'game-danger': '#ef4444',
        'game-reveal': '#f97316',
        'game-text': '#ffffff',
        'game-muted': '#94a3b8',
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 211, 238, 0.45)',
        card: '0 18px 55px rgba(0, 0, 0, 0.45)',
        reveal: '0 0 40px rgba(232, 121, 249, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.05)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulseSoft: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { opacity: '0.35' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0.35' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        spinSlow: 'spinSlow 20s linear infinite',
        pulseSoft: 'pulseSoft 1s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'pulse-slow': 'shimmer 2.5s ease-in-out infinite',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 40%), radial-gradient(circle at 50% 35%, rgba(232,121,249,0.18), transparent 25%), linear-gradient(180deg, #0a1114 0%, #0f0f1a 40%, #120d18 100%)',
        'button-violet': 'linear-gradient(90deg, #22d3ee 0%, #e879f9 100%)',
        'reveal-badge': 'linear-gradient(135deg, #ff9f1c 0%, #ff6b3d 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
