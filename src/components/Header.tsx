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
        'sticky top-0 z-30 bg-white px-[15px] py-[10px]',
        isSticky && 'shadow-[0_5px_10px_#ccc]'
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <button className="mr-[26px] hidden max-xl:block" onClick={() => setIsOpened((v) => !v)}>
          <svg viewBox="0 0 26 20" width={26}>
            <line stroke="#333333" strokeWidth="2" x1={0} x2={26} y1={1} y2={1} />
            <line stroke="#333333" strokeWidth="2" x1={0} x2={26} y1={10} y2={10} />
            <line stroke="#333333" strokeWidth="2" x1={0} x2={26} y1={19} y2={19} />
          </svg>
        </button>
        <Link href="/" className="px-[10px]">
          <Image alt="Ocelle" src="/ocelle-logo.png" width={160} height={48} />
        </Link>
        <div
          className={clsx(
            'flex w-full flex-row items-center justify-between max-xl:hidden',
            isOpened &&
              'max-xl:absolute max-xl:left-0 max-xl:top-[68px] max-xl:z-30 max-xl:!flex max-xl:h-screen max-xl:flex-col-reverse max-xl:bg-[#EEF3F7] max-xl:pb-[10px] max-xl:pt-[20px]'
          )}
        >
          <div className="h-full">
            <ul className="mx-[10px] flex w-full flex-row max-xl:mx-0 max-xl:flex-col max-xl:text-center [&_a:hover]:text-primary [&_a:hover]:underline [&_li]:list-none">
              <li>
                <Link href="/how-works" className="block px-[20px] py-[10px]">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="block px-[20px] py-[10px]">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/why-fresh" className="block px-[20px] py-[10px]">
                  Why Fresh?
                </Link>
              </li>
              <li>
                <Link href="/faq" className="block px-[20px] py-[10px]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="block px-[20px] py-[10px]">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="block px-[20px] py-[10px]">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-nowrap items-center max-xl:flex-col">
            <div className="m-[10px] max-xl:flex-col [&_a:hover]:text-primary [&_a:hover]:underline [&_a]:px-[10px]">
              <Link href="#" className="border-r border-[#ccc] text-primary underline">
                EN
              </Link>
              <Link href="#">中文</Link>
            </div>
            <Link
              href="/get-started"
              className="m-[10px] rounded-[15px] bg-secondary px-[15px] py-[2px] text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
        <Link href="#" className="mx-[10px] whitespace-nowrap hover:underline">
          Log In
        </Link>
      </div>
    </header>
  );
}
