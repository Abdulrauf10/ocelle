import type { Metadata } from 'next';
import { Jost, Open_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Notice from '@/components/Notice';
import clsx from 'clsx';

const jost = Jost({ subsets: ['latin'] });
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
      <body className={clsx(jost.className, openSans.variable)}>
        <Notice />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
