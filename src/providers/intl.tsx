'use client';

import defaultTranslationValues from '@/defaultTranslationValues';
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
      timeZone="Asia/Hong_Kong"
      defaultTranslationValues={defaultTranslationValues}
    >
      {children}
    </NextIntlClientProvider>
  );
}
