'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import HamburgerMenu from './icons/HamburgerMenu';
import { useAuth } from '@/contexts/auth';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const auth = useAuth();
  const headerRef = React.useRef<HTMLElement>(null);
  const [isOpened, setIsOpened] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    setIsOpened(false);
  }, [pathname]);

  React.useEffect(() => {
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
        'bg-white px-[2vw] py-3 max-xl:px-4',
        sticky ? 'sticky top-0 z-30' : 'relative',
        sticky && isSticky && 'shadow-[0_5px_10px_#ccc]'
      )}
    >
      <div className="-mx-2 flex flex-row flex-wrap items-center justify-between">
        {startAdornment}
        {menu && (
          <div className="hidden px-2 max-xl:flex">
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
            'w-full flex-1 px-2 max-xl:absolute max-xl:left-0 max-xl:top-[68px] max-xl:z-30 max-xl:bg-[#EEF3F7] max-xl:px-4',
            !isOpened && 'max-xl:hidden'
          )}
        >
          <div
            className={clsx(
              '-mx-2 flex flex-1 flex-row items-center justify-between max-xl:h-screen max-xl:flex-col-reverse max-xl:pb-3 max-xl:pt-5'
            )}
          >
            <div className="flex-1 px-2">{nav && <div className="max-xl:pt-4">{nav}</div>}</div>
            {(languageSwitch || getStarted) && (
              <div className="relative z-10 px-2">
                <div className="-m-2 flex flex-nowrap items-center whitespace-nowrap max-xl:flex-col">
                  {languageSwitch && (
                    <div className="p-2">
                      <div className="-mx-3 max-xl:flex-col [&_a:hover]:text-primary [&_a:hover]:underline">
                        <Link
                          className="border-r border-[#ccc] px-3 text-primary underline"
                          href="#"
                        >
                          EN
                        </Link>
                        <Link className="px-3" href="#">
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
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative z-10 px-2">
          {auth.logined ? (
            <Link href="/auth/logout" className="whitespace-nowrap hover:underline max-xl:mr-0">
              Log Out
            </Link>
          ) : (
            <Link href="/auth/login" className="whitespace-nowrap hover:underline max-xl:mr-0">
              Log In
            </Link>
          )}
        </div>
        {endAdornment}
      </div>
    </header>
  );
}
