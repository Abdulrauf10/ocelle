import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],

  // Used when no locale matches
  defaultLocale: 'en',

  localePrefix: 'always',
});

export const config = {
  // Match only internationalized pathnames
  // matcher: ['/', '/(zh|en)/:path*'],

  // Skip all paths that should not be internationalized.
  // This skips the folders "_next" and all files with
  // an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
