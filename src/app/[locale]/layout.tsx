import clsx from 'clsx';
import type { Metadata } from 'next';
import { Jost, Noto_Sans_TC, Open_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';

import '../globals.css';

import { getCart, getClientLoginedMe, logout } from '@/actions';
import QueryClientProvider from '@/components/QueryClientProvider';
import { AuthProvider } from '@/contexts/auth';
import { CartContextProvider } from '@/contexts/cart';
import IntlProvider from '@/providers/intl';

const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
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
  const cart = await getCart();

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }

  return (
    <html lang={locale} className={clsx(jost.variable, openSans.variable, notoSansTC.variable)}>
      <body className="lang-en:font-jost lang-zh:font-zh">
        <IntlProvider locale={locale} messages={messages}>
          <QueryClientProvider>
            <AuthProvider me={me} logout={logout}>
              <CartContextProvider
                lines={cart ? cart.lines : []}
                subtotalPrice={cart?.subtotalPrice.gross}
                shippingPrice={cart?.shippingPrice.gross}
                totalPrice={cart?.totalPrice.gross}
              >
                {children}
              </CartContextProvider>
            </AuthProvider>
          </QueryClientProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
