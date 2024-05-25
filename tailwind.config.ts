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
    languages: ['en', 'zh'],
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
        'how-it-works-dark-green': '#269D9E',
      },
      boxShadow: {
        block: '5px 5px 20px rgba(0, 0, 0, 0.2)',
        backdrop: '13px 13px 15px rgba(0, 0, 0, 0.4)',
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
        jost: ['var(--font-jost)', ...defaultTheme.fontFamily.sans],
        'open-sans': ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans],
        zh: ['"PingFang HK"', 'var(--font-noto-sans-tc)', ...defaultTheme.fontFamily.sans],
      },
      padding: {
        tight: 'clamp(40px,2.4vw,50px)',
        normal: 'clamp(40px,3.5vw,80px)',
      },
    },
  },
  plugins: [
    require('@ganmahmud/tailwindcss-language-variant'),
    plugin(function ({ addVariant }) {
      addVariant('mouse', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
};
export default config;
