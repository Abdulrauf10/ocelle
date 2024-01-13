import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Container from './Container';

function FooterHead({ children }: React.PropsWithChildren) {
  return <div className="font-bold uppercase">{children}</div>;
}

interface FooterProps {
  hideNav?: boolean;
}

function FooterLink({ href, children }: React.PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} className="mt-5 block">
      {children}
    </Link>
  );
}

export default function Footer({ hideNav }: FooterProps) {
  return (
    <footer className="bg-primary pb-16 pt-8 text-white">
      <Container>
        {!hideNav && (
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="py-5 [&_a:hover]:underline">
              <FooterHead>Product</FooterHead>
              <FooterLink href="/how-works">How It Works</FooterLink>
              <FooterLink href="#">Recipes</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="#">Shipping & Deliveries</FooterLink>
              <FooterLink href="#">Reviews</FooterLink>
            </div>
            <div className="py-5 [&_a:hover]:underline">
              <FooterHead>About</FooterHead>
              <FooterLink href="/why-fresh">Why Fresh?</FooterLink>
              <FooterLink href="/our-story">Our Story</FooterLink>
              <FooterLink href="#">My Account</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/affiliate-program">Affiliate Program</FooterLink>
            </div>
            <div className="py-5 [&_a:hover]:underline">
              <FooterHead>Contact</FooterHead>
              <Link
                href="#"
                className="mt-5 block bg-email-contact bg-[length:18px_auto] bg-[left_center] bg-no-repeat pl-7"
              >
                info@ocelle.dog
              </Link>
              <Link
                href="#"
                className="mt-3 block bg-phone-contact bg-[length:20px_auto] bg-[left_center] bg-no-repeat pl-7"
              >
                Phone Number
              </Link>
              <Link
                href="#"
                className="mt-3 block bg-wts-contact bg-[length:18px_auto] bg-[left_center] bg-no-repeat pl-7"
              >
                Whatsapp Number
              </Link>
            </div>
            <div className="py-5">
              <FooterHead>Follow Us On</FooterHead>
              <div className="mt-5">
                <Link href="#" className="mr-5 inline-block">
                  <Image alt="Instagram" src="/share-icon_ig.png" width={25} height={25} />
                </Link>
                <Link href="#" className="mr-5 inline-block">
                  <Image alt="Facebook" src="/share-icon_fb.png" width={25} height={25} />
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className={clsx('mt-[40px] text-center text-xl font-bold', hideNav && 'max-sm:mt-3')}>
          Science in Every Recipe. <span className="whitespace-nowrap">Love in Every Bite.</span>
        </div>
        <div className="my-5">
          <div className="after:content-dotted after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-1 after:inline-block after:align-[3px] after:tracking-[6px] after:text-white"></div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-x-[30px] gap-y-[10px] max-sm:justify-center">
          <div>&copy; {new Date().getFullYear()} Ocelle Company Limited</div>
          <div className="[&_a:hover]:underline">
            <div className="mr-5 inline-block whitespace-nowrap">
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
