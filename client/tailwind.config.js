/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'pitch': '#0a0f1a',
        'pitch-deep': '#060a12',
        'pitch-light': '#111827',
        'pitch-card': '#1a2235',
        'pitch-border': '#2a3450',
        'accent': '#00ff87',
        'accent-dim': '#00cc6a',
        'cyber-cyan': '#00f0ff',
        'cyber-magenta': '#ff00ea',
        'cyber-purple': '#a855f7',
        'cyber-blue': '#3b82f6',
        'hot': '#ff4444',
        'gold': '#fbbf24',
        'chat-bg': '#0d1321',
        'msg-self': '#1e40af',
        'msg-other': '#1f2937',
      },
      animation: {
        'float-up': 'float-up 2s ease-out forwards',
        'pulse-live': 'pulse-live 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'border-flow': 'border-flow 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '0.8', transform: 'translateY(-100px) scale(1.3)' },
          '100%': { opacity: '0', transform: 'translateY(-200px) scale(1.5)' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 135, 0.3), 0 0 10px rgba(0, 255, 135, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(0, 255, 135, 0.5), 0 0 30px rgba(0, 255, 135, 0.2)' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px rgba(0, 255, 135, 0.4), 0 0 20px rgba(0, 255, 135, 0.1)',
        'neon-strong': '0 0 10px rgba(0, 255, 135, 0.6), 0 0 40px rgba(0, 255, 135, 0.2), 0 0 80px rgba(0, 255, 135, 0.1)',
        'neon-cyan': '0 0 5px rgba(0, 240, 255, 0.4), 0 0 20px rgba(0, 240, 255, 0.1)',
        'neon-magenta': '0 0 5px rgba(255, 0, 234, 0.4), 0 0 20px rgba(255, 0, 234, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
