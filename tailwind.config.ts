import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5289B1',
        secondary: '#F2892A',
        'dark-green': '#269D9E',
        gold: '#be873b',
        gray: '#9a9486',
        beige: '#FCF9F5',
        error: '#f00',
        brown: '#A98D72',
        'how-it-works-red': '#E9545D',
        'how-it-works-yellow': '#FCBB00',
        'how-it-works-green': '#93D06D',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        '3xl': '1920px',
        xs: '480px',
      },
      maxWidth: {
        '8xl': '1440px',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      fontFamily: {
        jost: ['--font-jost', ...defaultTheme.fontFamily.sans],
        'open-sans': ['--font-open-sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('mouse', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
};
export default config;
