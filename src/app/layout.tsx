import type { Metadata } from 'next';
import { Jost, Open_Sans } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';

const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(jost.className, jost.variable, openSans.variable)}>{children}</body>
    </html>
  );
}
