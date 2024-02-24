'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import HamburgerMenu from './icons/HamburgerMenu';
import { useAuth } from '@/contexts/auth';
import { Link, usePathname } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { logout } from '@/actions';

interface HeaderProps {
  sticky?: boolean;
  nav?: React.ReactNode;
  menu?: boolean;
  languageSwitch?: boolean;
  getStarted?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export default function Header({
  sticky = true,
  nav,
  menu = true,
  languageSwitch = true,
  getStarted = true,
  startAdornment,
  endAdornment,
}: HeaderProps) {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const auth = useAuth();
  const headerRef = React.useRef<HTMLElement>(null);
  const [isOpened, setIsOpened] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useLayoutEffect(() => {
    setIsOpened(false);
  }, [pathname]);

  React.useLayoutEffect(() => {
    function handler() {
      if (headerRef.current) {
        const { top } = headerRef.current.getBoundingClientRect();
        setIsSticky(top <= 0 && window.scrollY > 0);
      }
    }
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={clsx(
        'bg-white px-[2vw] py-3 max-lg:px-4',
        sticky ? 'sticky top-0 z-30' : 'relative',
        sticky && isSticky && 'shadow-[0_5px_10px_#ccc]'
      )}
    >
      <div className="-mx-2 flex flex-row flex-wrap items-center justify-between">
        {startAdornment}
        {menu && (
          <div className="hidden px-2 max-lg:flex">
            <button onClick={() => setIsOpened((v) => !v)}>
              <HamburgerMenu className="w-[26px]" />
            </button>
          </div>
        )}
        <Link href="/" className="relative z-10 px-2">
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
            'w-full flex-1  px-2 pt-4 max-lg:absolute max-lg:left-0 max-lg:top-[72px] max-lg:z-30 max-lg:bg-[#EEF3F7] max-lg:px-4',
            !isOpened && 'max-lg:hidden'
          )}
        >
          <div
            className={clsx(
              '-mx-2 flex flex-1 flex-row items-center justify-between max-lg:h-screen max-lg:flex-col-reverse max-lg:pb-3 max-lg:pt-5'
            )}
          >
            <div className="flex-1 px-2">{nav && <div className="max-lg:pt-4">{nav}</div>}</div>
            {(languageSwitch || getStarted) && (
              <div className="relative z-10 px-2">
                <div className="-m-2 flex flex-nowrap items-center whitespace-nowrap max-lg:flex-col">
                  {languageSwitch && (
                    <div className="p-2">
                      <div className="-mx-3 max-lg:flex-col [&_a:hover]:text-primary [&_a:hover]:underline">
                        <Link
                          className={clsx(
                            'border-r border-[#ccc] px-3',
                            locale === 'en' && 'text-primary underline'
                          )}
                          href={pathname}
                          locale="en"
                        >
                          EN
                        </Link>
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
                  {getStarted && (
                    <div className="p-2">
                      <Link
                        href="/get-started"
                        className="rounded-2xl bg-secondary px-4 py-0.5 text-white"
                      >
                        {t('get-started')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative z-10 px-2 pt-4 ">
          {auth.logined ? (
            <button className="whitespace-nowrap hover:underline max-lg:mr-0" onClick={logout}>
              {t('log-out')}
            </button>
          ) : (
            <Link href="/auth/login" className="whitespace-nowrap hover:underline max-lg:mr-0">
              {t('log-in')}
            </Link>
          )}
        </div>
        {endAdornment}
      </div>
    </header>
  );
}
