import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import defaultTranslationValues from './defaultTranslationValues';

// Can be imported from a shared config
const locales = ['en', 'zh'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    timeZone: 'Asia/Hong_Kong',
    messages: (await import(`../messages/${locale}.json`)).default,
    defaultTranslationValues,
  };
});
