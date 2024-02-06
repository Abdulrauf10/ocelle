import clsx from 'clsx';
import React from 'react';
import Container from './Container';
import Whatsapp from './icons/Whatsapp';
import Email from './icons/Email';
import Phone from './icons/Phone';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Instagram from './icons/Instagram';
import Facebook from './icons/Facebook';

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
  const t = useTranslations();

  return (
    <footer className="bg-primary pb-16 pt-8 text-white max-md:pb-12 max-md:pt-4">
      <Container>
        {!hideNav && (
          <div className="flex flex-wrap items-start justify-between gap-8 max-sm:-mx-2 max-sm:gap-0">
            <div className="py-5 max-sm:w-3/5 max-sm:px-2 [&_a:hover]:underline">
              <FooterHead>{t('product')}</FooterHead>
              <FooterLink href="/how-it-works/subscription">
                {t('how-it-works-subscription')}
              </FooterLink>
              <FooterLink href="/how-it-works/individual">
                {t('how-it-works-individual')}
              </FooterLink>
              <FooterLink href="/recipes">{t('recipes')}</FooterLink>
              <FooterLink href="/faq">
                <span className="uppercase">{t('faq')}</span>
              </FooterLink>
              <FooterLink href="/faq#deliveries">{t('shipping-and-deliveries')}</FooterLink>
              <FooterLink href="#">{t('reviews')}</FooterLink>
            </div>
            <div className="py-5 max-sm:w-2/5 max-sm:px-2 [&_a:hover]:underline">
              <FooterHead>{t('about')}</FooterHead>
              <FooterLink href="/why-fresh">{t('why-fresh')}</FooterLink>
              <FooterLink href="/about-us">{t('our-story')}</FooterLink>
              <FooterLink href="/account/plan">{t('my-account')}</FooterLink>
              <FooterLink href="/careers">{t('careers')}</FooterLink>
              <FooterLink href="/affiliate-program">{t('affiliate-program')}</FooterLink>
            </div>
            <div className="py-5 max-sm:w-3/5 max-sm:px-2 [&_a:hover]:underline">
              <FooterHead>{t('contact')}</FooterHead>
              <Link href="mailto:info@ocelle.dog" className="mt-5 inline-flex items-center">
                <Email className="w-5 min-w-5" />
                <span className="pl-2">info@ocelle.dog</span>
              </Link>
              <br />
              <Link href="#" className="mt-3 inline-flex items-center">
                <Phone className="mx-1 w-3 min-w-3" />
                <span className="pl-2">Phone Number</span>
              </Link>
              <br />
              <Link href="#" className="mt-3 inline-flex items-center">
                <Whatsapp className="w-5 min-w-5" />
                <span className="pl-2">Whatsapp Number</span>
              </Link>
            </div>
            <div className="py-5 max-sm:w-2/5 max-sm:px-2">
              <FooterHead>{t('follow-us-on')}</FooterHead>
              <div className="mt-5">
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="bg-gradient-instagram text-fill-transparent mr-5 inline-block bg-clip-text"
                >
                  <Instagram className="w-[25px]" />
                </Link>
                <Link href="https://facebook.com" target="_blank" className="mr-5 inline-block">
                  <Facebook className="w-[25px]" />
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className={clsx('mt-10 text-center text-xl font-bold', hideNav && 'max-sm:mt-3')}>
          Science in Every Recipe. <span className="whitespace-nowrap">Love in Every Bite.</span>
        </div>
        <div className="my-5">
          <div className="after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-1 after:inline-block after:align-[3px] after:tracking-[6px] after:text-white after:content-dotted"></div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-x-[30px] gap-y-[10px] max-sm:justify-center">
          <div>&copy; {new Date().getFullYear()} Ocelle Company Limited</div>
          <div className="[&_a:hover]:underline">
            <div className="mr-5 inline-block whitespace-nowrap">
              <Link href="#">{t('privacy-policy')}</Link>
            </div>
            <div className="inline-block whitespace-nowrap">
              <Link href="#">{t('terms-and-conditions')}</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
