import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8f4', 100: '#e3f1e7', 200: '#c5e2cf', 300: '#9bcdb0', 400: '#5fae85',
          500: '#2f8f65', 600: '#1f8a5b', 700: '#14573e', 800: '#10392a', 900: '#0b261c'
        },
        ink: '#16241d',
        page: '#f2f5ee'
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'] }
    }
  },
  plugins: []
};
export default config;
