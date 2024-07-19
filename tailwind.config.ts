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
        'why-fresh-dark-green': '#0D889D',
      },
      dropShadow: {
        'style-1': '5px 5px 2px var(--tw-shadow-color)',
        'style-2': '10px 10px 5px var(--tw-shadow-color)',
        'style-3': '7px 7px 5px var(--tw-shadow-color)',
        'style-4': '-7px 7px 5px var(--tw-shadow-color)',
        'style-5': '3px 3px 1px var(--tw-shadow-color)',
        'style-6': '7px 7px 3px var(--tw-shadow-color)',
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
        baskerville: ['baskerville', 'emoji', 'serif'],
        jost: ['var(--font-jost)', ...defaultTheme.fontFamily.sans],
        'open-sans': ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans],
        zh: [
          'var(--font-jost)',
          '"PingFang HK"',
          'var(--font-noto-sans-tc)',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      padding: {
        tight: 'clamp(40px,2.4vw,50px)',
        normal: 'clamp(40px,3.5vw,80px)',
      },
      margin: {
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
