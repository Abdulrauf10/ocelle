'use client';

import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

export default function IntlProvider({
  locale,
  messages,
  children,
}: React.PropsWithChildren<{
  locale?: string;
  messages: AbstractIntlMessages;
}>) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      defaultTranslationValues={{
        important: (chunks) => <b>{chunks}</b>,
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
