/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#FDFBF7',
          100: '#FAF7F2', // Signature Raw Linen Canvas
          150: '#F4EFEA', // Subtle Parchment
          200: '#EFE8E0', // Muted Dossier Tint
          300: '#E3D8CB', // Hairline borders
          400: '#D1C2AF',
          500: '#B5A28D',
        },
        obsidian: {
          DEFAULT: '#111215', // Core Deep Black
          950: '#0A0B0D',
          900: '#111215',
          850: '#18191E',
          800: '#22232A',
          700: '#343640',
          600: '#4C4E5C',
          500: '#696C7D',
          400: '#8E91A1',
          300: '#B5B8C5',
        },
        gilt: {
          50: '#FAF6EF',
          100: '#F3ECE0',
          200: '#E5D7BF',
          300: '#D2BD97',
          400: '#B89B6C',
          DEFAULT: '#9E7A4A', // Signature Aged Gilt Bronze
          600: '#846337',
          700: '#6A4D26',
          800: '#4F3818',
          900: '#34230D',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Didot', 'Bodoni MT', 'Georgia', 'serif'],
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      letterSpacing: {
        'tight-display': '-0.025em',
        'kicker': '0.22em',
        'editorial': '0.18em',
        'widest-luxury': '0.26em',
      },
      boxShadow: {
        'luxury': '0 2px 8px -2px rgba(17, 18, 21, 0.05), 0 16px 32px -8px rgba(17, 18, 21, 0.06)',
        'luxury-hover': '0 4px 12px -2px rgba(17, 18, 21, 0.08), 0 24px 48px -12px rgba(158, 122, 74, 0.15)',
        'gilt-sm': '0 2px 10px rgba(158, 122, 74, 0.22)',
        'dossier': '0 1px 3px rgba(0,0,0,0.04), 0 12px 30px -4px rgba(17, 18, 21, 0.05)',
      },
    },
  },
  plugins: [],
};
