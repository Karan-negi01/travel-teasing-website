/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#E8651A',
          50: '#FEF3EB',
          100: '#FDE3CC',
          500: '#E8651A',
          600: '#D4561A',
        },
        navy: '#1a1a2e',
        cream: '#fdf8f0',
        peach: '#fff8f3',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
