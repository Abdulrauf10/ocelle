'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Container from './Container';
import HamburgerMenu from './icons/HamburgerMenu';

import { useAuth } from '@/contexts/auth';
import { Link, usePathname } from '@/navigation';

interface HeaderProps {
  nav?: React.ReactNode;
  disableLoginButton?: boolean;
  disableMenuButton?: boolean;
  disableLanguageSwitch?: boolean;
  disableGetStartedButton?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export default function Header({
  nav,
  disableLoginButton,
  disableMenuButton,
  disableLanguageSwitch,
  disableGetStartedButton,
  startAdornment,
  endAdornment,
}: HeaderProps) {
  const locale = useLocale();
  const t = useTranslations();
  const b = useTranslations('Button');
  const pathname = usePathname();
  const { me, logout } = useAuth();
  const [isOpened, setIsOpened] = React.useState(false);

  React.useLayoutEffect(() => {
    setIsOpened(false);
  }, [pathname]);

  return (
    <header className="relative bg-white py-3">
      <Container screen>
        <div className="-mx-2 flex flex-row flex-wrap items-center justify-between">
          {startAdornment}
          {!disableMenuButton && (
            <div className="hidden px-2 max-lg:flex">
              <button onClick={() => setIsOpened((v) => !v)}>
                <HamburgerMenu className="w-[26px]" />
              </button>
            </div>
          )}
          <Link href="/" className="relative z-10 mx-auto px-2" onClick={() => setIsOpened(false)}>
            <Image
              alt="Ocelle"
              src="/ocelle-logo.png"
              width={160}
              height={48}
              className="min-w-[160px]"
            />
          </Link>
          <div
            className={clsx(
              'w-full flex-1 px-2 max-lg:absolute max-lg:left-0 max-lg:top-[72px] max-lg:z-30 max-lg:bg-[#EEF3F7] max-lg:px-4',
              !isOpened && 'max-lg:hidden'
            )}
          >
            <div
              className={clsx(
                '-mx-2 flex flex-1 flex-row items-center justify-between max-lg:h-screen max-lg:flex-col-reverse max-lg:pb-3 max-lg:pt-5'
              )}
            >
              <div className="flex-1 pl-2 pr-1">
                {nav && <div className="max-lg:pt-4">{nav}</div>}
              </div>
              {(!disableLanguageSwitch || !disableGetStartedButton) && (
                <div className="relative z-10 px-2">
                  <div className="-m-2 flex flex-nowrap items-center whitespace-nowrap max-lg:flex-col">
                    {!disableLoginButton && me && (
                      <div className="p-2 lg:hidden">
                        <button
                          className="whitespace-nowrap hover:underline"
                          onClick={() => logout()}
                        >
                          {t('log-out')}
                        </button>
                      </div>
                    )}
                    {!disableLanguageSwitch && (
                      <div className="p-2">
                        <div className="-mx-3 flex [&_a:hover]:text-primary [&_a:hover]:underline">
                          <Link
                            className={clsx('px-3', locale === 'en' && 'text-primary underline')}
                            href={pathname}
                            locale="en"
                          >
                            EN
                          </Link>
                          <div>|</div>
                          <Link
                            className={clsx('px-3', locale === 'zh' && 'text-primary underline')}
                            href={pathname}
                            locale="zh"
                          >
                            中文
                          </Link>
                        </div>
                      </div>
                    )}
                    {!disableGetStartedButton && (
                      <div className="p-2">
                        <Link
                          href="/get-started"
                          className="rounded-2xl border-2 border-secondary bg-secondary px-4 py-[3px] font-open-sans text-white mouse:hover:bg-white mouse:hover:text-secondary"
                        >
                          {b('get-started')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {!disableLoginButton && (
            <div className="relative z-10 px-2">
              {me ? (
                <Link
                  href="/account/plan"
                  className="whitespace-nowrap hover:underline max-lg:mr-0"
                >
                  {me.firstName}
                </Link>
              ) : (
                <Link href="/auth/login" className="whitespace-nowrap hover:underline max-lg:mr-0">
                  {t('log-in')}
                </Link>
              )}
            </div>
          )}
          {!disableLoginButton && me && (
            <div className="px-2 max-lg:hidden">
              <button className="whitespace-nowrap hover:underline" onClick={() => logout()}>
                {t('log-out')}
              </button>
            </div>
          )}

          {endAdornment}
        </div>
      </Container>
    </header>
  );
}
