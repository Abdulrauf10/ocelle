import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Jost, Open_Sans } from 'next/font/google';
import clsx from 'clsx';
import { AuthProvider } from '@/contexts/auth';
import '../globals.css';
import IntlProvider from '@/providers/intl';

const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Ocelle | Science in Every Recipe. Love in Every Bite.',
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={clsx(jost.className, jost.variable, openSans.variable)}>
        <IntlProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
