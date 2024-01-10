import type { Config } from 'tailwindcss';

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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dogfoot-icon': 'url("./dogfoot-icon.svg")',
        'email-contact': 'url("./contact-icon_mail.png")',
        'phone-contact': 'url("./contact-icon_phone.png")',
        'wts-contact': 'url("./contact-icon_whatsapp.png")',
        'newsletter-icon': 'url("./newsletter-icon.png")',
        'newsletter-btn': 'url("./newsletter-btn.png")',
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
    },
  },
  plugins: [],
};
export default config;
