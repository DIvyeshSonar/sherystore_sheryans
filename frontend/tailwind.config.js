/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#4F46E5',
        'primary-dark':  '#3730A3',
        'primary-light': '#818CF8',
        secondary:  '#7C3AED',
        accent:     '#EC4899',
        background: '#F8FAFC',
        'main-text':       '#0F172A',
        'secondary-text':  '#64748B',
        'muted-text':      '#94A3B8',
        border:     '#E2E8F0',
        success:    '#10B981',
        'success-light': '#D1FAE5',
        warning:    '#F59E0B',
        'warning-light': '#FEF3C7',
        danger:     '#EF4444',
        'danger-light':  '#FEE2E2',
        sale:       '#EC4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
      boxShadow: {
        'sm':       '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'DEFAULT':  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'md':       '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'lg':       '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'xl':       '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        '2xl':      '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        'inner':    'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
        'primary':  '0 4px 14px -2px rgb(79 70 229 / 0.3)',
        'card':     '0 2px 8px -2px rgb(0 0 0 / 0.07), 0 4px 16px -4px rgb(0 0 0 / 0.05)',
        'none':     'none',
      },
    },
  },
  plugins: [],
}
