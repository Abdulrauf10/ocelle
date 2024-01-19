import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'email-contact': 'url("./contact-icon_mail.png")',
        'phone-contact': 'url("./contact-icon_phone.png")',
        'wts-contact': 'url("./contact-icon_whatsapp.png")',
        'newsletter-icon': 'url("./newsletter-icon.png")',
        'newsletter-btn': 'url("./newsletter-btn.png")',
      },
      content: {
        dotted:
          '"...................................................................................................................................................................................................................."',
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
        'open-sans': ['--font-open-sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
