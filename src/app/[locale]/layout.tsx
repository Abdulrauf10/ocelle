import clsx from 'clsx';
import type { Metadata } from 'next';
import { Jost, Open_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

import '../globals.css';

import { getClientLoginedMe, logout } from '@/actions';
import QueryClientProvider from '@/components/QueryClientProvider';
import { AuthProvider } from '@/contexts/auth';
import IntlProvider from '@/providers/intl';

const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});
const pingFangHK = localFont({
  src: [
    {
      path: '../../../fonts/PingFangHK/PingFangHK-Thin.otf',
      weight: '100',
    },
    {
      path: '../../../fonts/PingFangHK/PingFangHK-Ultralight.otf',
      weight: '200',
    },
    {
      path: '../../../fonts/PingFangHK/PingFangHK-Light.otf',
      weight: '300',
    },
    {
      path: '../../../fonts/PingFangHK/PingFangHK-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../fonts/PingFangHK/PingFangHK-Medium.otf',
      weight: '500',
    },
    {
      path: '../../../fonts/PingFangHK/PingFangHK-Semibold.otf',
      weight: '600',
      style: 'bold',
    },
  ],
  variable: '--font-ping-fang-hk',
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
  const me = await getClientLoginedMe();

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }

  return (
    <html lang={locale} className={clsx(jost.variable, openSans.variable, pingFangHK.variable)}>
      <body className={clsx('font-jost')}>
        <IntlProvider locale={locale} messages={messages}>
          <QueryClientProvider>
            <AuthProvider me={me} logout={logout}>
              {children}
            </AuthProvider>
          </QueryClientProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
