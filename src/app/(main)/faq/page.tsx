'use client';

import React from 'react';
import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Email from '@/components/icons/Email';
import Whatsapp from '@/components/icons/Whatsapp';
import clsx from 'clsx';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: React.ReactNode;
}

interface BlockProps {
  id: string;
  title: string;
  faqs: FAQ[];
}

function ToggleBlock({ question, answer }: FAQ) {
  const [opened, setOpened] = React.useState(false);

  return (
    <div
      className="-mx-2 flex cursor-pointer"
      tabIndex={0}
      onClick={() => setOpened(!opened)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setOpened(!opened);
        }
      }}
    >
      <div className="px-2">
        <div className="mt-1.5">
          <div
            className={clsx(
              'h-0 w-0 border-[8px] border-l-[12px] border-r-0 border-transparent border-l-primary transition',
              opened && 'rotate-90 border-l-secondary'
            )}
          ></div>
        </div>
      </div>
      <div className="px-2">
        <div className="text-xl text-primary max-sm:text-lg">{question}</div>
        <div className={clsx('h-0 overflow-hidden transition', opened && 'h-auto')}>
          <p className="ml-4 mt-2">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function Block({ id, title, faqs }: BlockProps) {
  return (
    <div className="py-10">
      <div id={id} className="relative -top-[90px]"></div>
      <h2 className="text-5xl font-bold text-primary max-sm:text-3xl">{title}</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="mt-5">
          <ToggleBlock question={faq.question} answer={faq.answer} />
        </div>
      ))}
    </div>
  );
}

export default function FaQ() {
  return (
    <main>
      <div className="bg-[url('/faq.jpg')] bg-[length:auto_100%] bg-center bg-repeat-x py-24">
        <Container>
          <h2 className="-ml-3 select-none text-[215px] font-bold leading-none text-white drop-shadow-[5px_5px_12px_rgba(0,0,0,.5)] max-lg:text-[130px]">
            FAQ
          </h2>
          <p className="text-white">
            If you can’t find what you’re looking for, please contact us!{' '}
          </p>
          <div className="mt-6">
            <Link href="#" className="inline-flex text-white hover:underline">
              <Email className="w-7" />
              <span className="ml-3 text-lg font-bold">info@ocelle.dog</span>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="#" className="inline-flex text-white hover:underline">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Whatsapp className="w-4 text-primary" />
              </div>
              <span className="ml-3 text-lg font-bold">WhatsApp Number</span>
            </Link>
          </div>
        </Container>
      </div>
      <div className="bg-primary bg-opacity-20 py-8">
        <Container>
          <div className="-m-2 flex flex-wrap items-center justify-between max-lg:justify-center max-sm:flex-col">
            <div className="p-2">
              <Link
                href="#our-food"
                className="block whitespace-nowrap rounded-2xl bg-primary px-10 py-0.5 text-center text-lg text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Our Food
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#our-quiz"
                className="block whitespace-nowrap rounded-2xl bg-primary px-10 py-0.5 text-center text-lg text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Our Quiz
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#subscription"
                className="block whitespace-nowrap rounded-2xl bg-primary px-10 py-0.5 text-center text-lg text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Subscription
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#deliveries"
                className="block whitespace-nowrap rounded-2xl bg-primary px-10 py-0.5 text-center text-lg text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Deliveries
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#payment"
                className="block whitespace-nowrap rounded-2xl bg-primary px-10 py-0.5 text-center text-lg text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Payment
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-brown bg-opacity-10 py-16">
        <Container className="-my-8">
          <Block
            id="our-food"
            title="OUR FOOD"
            faqs={[
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
            ]}
          />
          <Block
            id="our-quiz"
            title="OUR QUIZ"
            faqs={[
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
            ]}
          />
          <Block
            id="subscription"
            title="SUBSCRIPTION"
            faqs={[
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
            ]}
          />
          <Block
            id="deliveries"
            title="DELIVERIES"
            faqs={[
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
            ]}
          />
          <Block
            id="payment"
            title="PAYMENT"
            faqs={[
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
              {
                question:
                  'Qui ea agam epicuri. Quod nonumy et mei, nam graece pertinacia scripserit an, an qui urbanitas adversarium ullamcorper?',
                answer:
                  "Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout.",
              },
            ]}
          />
        </Container>
      </div>
      <Newsletter />
    </main>
  );
}
