import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

import QuestionAnswerBlock from './QuestionAnswerBlock';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Mail from '@/components/icons/Mail';
import WhatsappFilled from '@/components/icons/WhatsappFilled';

interface BlockProps {
  id: string;
  title: string;
  faqs: Array<{
    question: string;
    answer: React.ReactNode;
  }>;
}

function Block({ id, title, faqs }: BlockProps) {
  return (
    <div className="py-10">
      <div id={id} className="relative -top-[140px]"></div>
      <h2 className="heading-2 font-bold uppercase text-primary lang-zh:font-normal">{title}</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="mt-5">
          <QuestionAnswerBlock question={faq.question} answer={faq.answer} />
        </div>
      ))}
    </div>
  );
}

export default function FaQ() {
  const t = useTranslations();
  const f = useTranslations('FAQ');

  return (
    <main>
      <div
        className="bg-[#4b88b4] bg-[url('/faq_banner_img.jpg')] bg-[length:auto_100%] bg-[calc(50%+110px)] bg-no-repeat py-[10em] max-2xl:py-[11%] max-xl:bg-[calc(50%+90px)] max-lg:bg-[calc(50%+25px)] 
                  max-md:bg-[url('/ocelle-faq-mb-bg.jpg')] max-md:bg-[length:768px_960px] max-md:bg-[bottom_center]  max-md:bg-no-repeat max-md:py-8"
      >
        <Container>
          <div className="max-md:pl-8 max-xs:pl-0 md:max-w-[50%]">
            <h1 className="-ml-[.07em] select-none text-[130px] font-bold leading-none text-white drop-shadow-[5px_5px_12px_rgba(0,0,0,.5)] md:text-[160px] xl:text-[215px]">
              FAQ
            </h1>
            <p className="body-1 text-white">{f.rich('block-1-content')}</p>
            <div className="mt-6">
              <Link
                href="mailto:info@ocelle.dog"
                className="inline-flex items-center text-white hover:underline"
              >
                <Mail className="h-5 w-6" />
                <div className="ml-3">
                  <span className="body-1 body-weight-1">info@ocelle.dog</span>
                </div>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="https://wa.me/92267236"
                className="inline-flex items-center text-white hover:underline"
                referrerPolicy="no-referrer"
              >
                <WhatsappFilled className="-mx-0.5 h-7 w-7 text-white" />
                <div className="ml-3">
                  <span className="body-1 body-weight-1">9226 7236</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="max-md:pt-[500px]"></div>
        </Container>
      </div>
      <div className="bg-primary bg-opacity-20 py-8">
        <Container>
          <div className="-mx-4 -my-2 flex flex-wrap justify-between max-xl:justify-center">
            <div className="px-4 py-2">
              <Link
                href="#our-food"
                className="block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-1 text-center hover:opacity-90"
              >
                <span className="heading-4 font-bold text-white lang-zh:font-normal">
                  {f('block-2-title')}
                </span>
              </Link>
            </div>
            <div className="px-4 py-2">
              <Link
                href="#our-quiz"
                className="block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-1 text-center hover:opacity-90"
              >
                <span className="heading-4 font-bold text-white lang-zh:font-normal">
                  {f('block-3-title')}
                </span>
              </Link>
            </div>
            <div className="px-4 py-2">
              <Link
                href="#subscription"
                className="block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-1 text-center hover:opacity-90"
              >
                <span className="heading-4 font-bold text-white lang-zh:font-normal">
                  {f('block-4-title')}
                </span>
              </Link>
            </div>
            <div className="hidden w-full flex-auto md:block xl:hidden"></div>
            <div className="px-4 py-2">
              <Link
                href="#deliveries"
                className="block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-1 text-center hover:opacity-90"
              >
                <span className="heading-4 font-bold text-white lang-zh:font-normal lang-zh:font-normal">
                  {f('block-5-title')}
                </span>
              </Link>
            </div>
            <div className="px-4 py-2">
              <Link
                href="#payment"
                className="block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-1 text-center hover:opacity-90"
              >
                <span className="heading-4 font-bold text-white lang-zh:font-normal">
                  {f('block-6-title')}
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-brown bg-opacity-10 py-16">
        <Container className="-my-8 max-w-8xl">
          <Block
            id="our-food"
            title={f('block-2-title')}
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
            title={f('block-3-title')}
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
            title={f('block-4-title')}
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
            title={f('block-5-title')}
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
            title={f('block-6-title')}
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
