'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  const headerRef = React.useRef<HTMLElement>(null);
  const [isOpened, setIsOpened] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    function handler() {
      if (headerRef.current) {
        const { top } = headerRef.current.getBoundingClientRect();
        setIsSticky(top <= 0);
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
        'sticky top-0 z-30 bg-white px-4 py-3',
        isSticky && 'shadow-[0_5px_10px_#ccc]'
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <button className="mr-6 hidden max-xl:block" onClick={() => setIsOpened((v) => !v)}>
          <svg viewBox="0 0 26 20" width={26}>
            <line stroke="#333333" strokeWidth="2" x1={0} x2={26} y1={1} y2={1} />
            <line stroke="#333333" strokeWidth="2" x1={0} x2={26} y1={10} y2={10} />
            <line stroke="#333333" strokeWidth="2" x1={0} x2={26} y1={19} y2={19} />
          </svg>
        </button>
        <Link href="/" className="px-2">
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
            'flex w-full flex-row items-center justify-between max-xl:hidden',
            isOpened &&
              'max-xl:absolute max-xl:left-0 max-xl:top-[68px] max-xl:z-30 max-xl:!flex max-xl:h-screen max-xl:flex-col-reverse max-xl:bg-[#EEF3F7] max-xl:pb-3 max-xl:pt-5'
          )}
        >
          <div className="h-full max-xl:pt-4">
            <ul className="mx-2 flex w-full flex-row max-xl:mx-0 max-xl:flex-col max-xl:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
              <li>
                <Link href="/how-works" className="block px-5 py-2">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="block px-5 py-2">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/why-fresh" className="block px-5 py-2">
                  Why Fresh?
                </Link>
              </li>
              <li>
                <Link href="/faq" className="block px-5 py-2">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="block px-5 py-2">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="block px-5 py-2">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="-m-2 flex flex-nowrap items-center max-xl:flex-col">
            <div className="p-2">
              <div className="-mx-3 max-xl:flex-col [&_a:hover]:text-primary [&_a:hover]:underline">
                <Link className="border-r border-[#ccc] px-3 text-primary underline" href="#">
                  EN
                </Link>
                <Link className="px-3" href="#">
                  中文
                </Link>
              </div>
            </div>
            <div className="p-2">
              <Link href="/get-started" className="rounded-2xl bg-secondary px-4 py-0.5 text-white">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <Link href="/auth/login" className="mx-3 whitespace-nowrap hover:underline max-xl:mr-0">
          Log In
        </Link>
      </div>
    </header>
  );
}
