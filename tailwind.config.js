/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js}',
    './templates/**/*.js',
    './dist/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        // khrome grayscale palette (High Key / Low Key)
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Functional colors (muted)
        success: {
          DEFAULT: '#4ade80',
          text: '#166534',
          bg: '#f0fdf4',
        },
        error: {
          DEFAULT: '#f87171',
          text: '#991b1b',
          bg: '#fef2f2',
        },
        warning: {
          DEFAULT: '#fbbf24',
          text: '#92400e',
          bg: '#fffbeb',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
