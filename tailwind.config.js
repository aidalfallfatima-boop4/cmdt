/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        canvas: '#F5F6F8',
        surface: '#FFFFFF',
        line: '#E4E7EC',
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#EEF2F7',
          700: '#122A4C',
          800: '#0E2340',
          900: '#0B1F3A',
          950: '#081629',
        },
        leaf: {
          DEFAULT: '#1F7A4D',
          soft: '#B7E0C6',
          dark: '#155C39',
        },
        ink: {
          DEFAULT: '#1B2430',
          muted: '#5B6675',
          faint: '#8A94A3',
        },
        pos: '#1E7F53',
        posbg: '#E7F4EC',
        neg: '#C0392B',
        negbg: '#FBEAE8',
        warn: '#B8860B',
        warnbg: '#FBF3E0',
        info: '#1F5FA8',
        infobg: '#E8F0FA',
        soil: '#B5651D',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,58,0.06), 0 1px 3px rgba(11,31,58,0.05)',
        panel: '0 2px 8px rgba(11,31,58,0.08), 0 1px 3px rgba(11,31,58,0.06)',
        pop: '0 12px 32px rgba(8,22,41,0.18), 0 4px 12px rgba(8,22,41,0.12)',
      },
      borderRadius: {
        card: '10px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out both',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
