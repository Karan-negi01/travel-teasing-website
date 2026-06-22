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
      fontSize: {
        // Headings
        'display': ['clamp(48px, 6vw, 80px)', { lineHeight: '1.05', fontWeight: '800' }],
        'h1':      ['clamp(36px, 4.5vw, 60px)', { lineHeight: '1.1',  fontWeight: '700' }],
        'h2':      ['clamp(28px, 3vw,  44px)',  { lineHeight: '1.15', fontWeight: '700' }],
        'h3':      ['clamp(22px, 2vw,  32px)',  { lineHeight: '1.2',  fontWeight: '600' }],
        'h4':      ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h5':      ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        // Body
        'body-xl': ['20px', { lineHeight: '1.7' }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'body-xs': ['12px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};
