import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Container from './Container';

interface FooterProps {
  hideNav?: boolean;
}

function FooterLink({ href, children }: React.PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} className="mt-[20px] block">
      {children}
    </Link>
  );
}

export default function Footer({ hideNav }: FooterProps) {
  return (
    <footer className="bg-primary pb-[60px] pt-[30px] text-white">
      <Container>
        {!hideNav && (
          <div className="flex flex-wrap items-start justify-between gap-[30px]">
            <div className="py-[20px] [&_a:hover]:underline">
              <div className="font-bold uppercase">Product</div>
              <FooterLink href="/how-works">How It Works</FooterLink>
              <FooterLink href="#">Recipes</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="#">Shipping & Deliveries</FooterLink>
              <FooterLink href="#">Reviews</FooterLink>
            </div>
            <div className="py-[20px] [&_a:hover]:underline">
              <div className="font-bold uppercase">About</div>
              <FooterLink href="/why-fresh">Why Fresh?</FooterLink>
              <FooterLink href="/our-story">Our Story</FooterLink>
              <FooterLink href="#">My Account</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/affiliate-program">Affiliate Program</FooterLink>
            </div>
            <div className="py-[20px] [&_a:hover]:underline">
              <div className="font-bold uppercase">Contact</div>
              <Link
                href="#"
                className="mt-[20px] block bg-email-contact bg-[length:18px_auto] bg-[left_center] bg-no-repeat pl-[26px]"
              >
                info@ocelle.dog
              </Link>
              <Link
                href="#"
                className="mt-[10px] block bg-phone-contact bg-[length:18px_auto] bg-[left_center] bg-no-repeat pl-[26px]"
              >
                Phone Number
              </Link>
              <Link
                href="#"
                className="mt-[10px] block bg-wts-contact bg-[length:18px_auto] bg-[left_center] bg-no-repeat pl-[26px]"
              >
                Whatsapp Number
              </Link>
            </div>
            <div className="py-[20px]">
              <div className="font-bold uppercase">Follow Us On</div>
              <div className="mt-[20px]">
                <Link href="#" className="mr-[20px] inline-block">
                  <Image alt="Instagram" src="/share-icon_ig.png" width={25} height={25} />
                </Link>
                <Link href="#" className="mr-[20px] inline-block">
                  <Image alt="Facebook" src="/share-icon_fb.png" width={25} height={25} />
                </Link>
              </div>
            </div>
          </div>
        )}
        <div
          className={clsx('mt-[40px] text-center text-[20px] font-bold', hideNav && 'max-sm:mt-3')}
        >
          Science in Every Recipe. <span className="whitespace-nowrap">Love in Every Bite.</span>
        </div>
        <div className="my-[20px]">
          <div className="after:content-dotted after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-1 after:inline-block after:align-[3px] after:tracking-[6px] after:text-white"></div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-x-[30px] gap-y-[10px] max-sm:justify-center">
          <div>&copy; {new Date().getFullYear()} Ocelle Company Limited</div>
          <div className="[&_a:hover]:underline">
            <div className="mr-[20px] inline-block whitespace-nowrap">
              <Link href="#">Privacy Policy</Link>
            </div>
            <div className="inline-block whitespace-nowrap">
              <Link href="#">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
