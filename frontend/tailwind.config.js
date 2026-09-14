/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        surface: '#141414',
        line: '#262626',
        accent: '#3b82f6',
        copy: '#ededed',
        muted: '#737373',
      },
    },
  },
  plugins: [],
};
