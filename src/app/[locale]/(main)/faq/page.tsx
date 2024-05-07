import Link from 'next/link';
import React from 'react';

import QuestionAnswerBlock from './QuestionAnswerBlock';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Email from '@/components/icons/Email';
import Whatsapp from '@/components/icons/Whatsapp';

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
      <h2 className="heading-2 font-bold text-primary">{title}</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="mt-5">
          <QuestionAnswerBlock question={faq.question} answer={faq.answer} />
        </div>
      ))}
    </div>
  );
}

export default function FaQ() {
  return (
    <main>
      <div
        className="bg-[#4b8dbd] bg-[url('/faq_banner_img.jpg')] bg-[length:auto_100%] bg-[44%_center] bg-repeat-x py-[12em] max-2xl:py-[11%] 
                  max-md:min-h-[800px] max-md:bg-[url('/ocelle-faq-mb-bg.jpg')] max-md:bg-[length:768px_960px] max-md:bg-[bottom_center]  max-md:bg-no-repeat max-md:pb-8
                  max-md:pt-4"
      >
        <Container>
          <div className="max-w-8xl px-10 py-3">
            <h1 className="-ml-[9px] select-none text-[215px] font-bold leading-none text-white drop-shadow-[5px_5px_12px_rgba(0,0,0,.5)] max-lg:text-[130px]">
              FAQ
            </h1>
            <p className="body-2 text-white">
              If you can’t find what you’re looking for, please contact us!
            </p>
            <div className="mt-6">
              <Link
                href="mailto:info@ocelle.dog"
                className="inline-flex text-white hover:underline"
              >
                <Email className="w-7" />
                <span className="body-1 ml-3 font-bold">info@ocelle.dog</span>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="whatsapp://send/?text=Hello%20World!&phone=92267236"
                className="inline-flex text-white hover:underline"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Whatsapp className="w-4 text-primary" />
                </div>
                <span className="body-1 ml-3 font-bold">9226 7236</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-primary bg-opacity-20 py-8">
        <Container className="max-w-screen-xl">
          <div className="-m-2 flex flex-wrap items-center justify-between max-xl:justify-center max-xl:px-4 max-lg:justify-center max-sm:flex-col">
            <div className="flex justify-center p-2 md:flex-[1_1_30%] xl:flex-1">
              <Link
                href="#our-food"
                className="heading-4 block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center font-bold text-white hover:opacity-90"
              >
                Our Food
              </Link>
            </div>
            <div className="flex justify-center p-2 md:flex-[1_1_30%] xl:flex-1">
              <Link
                href="#our-quiz"
                className="heading-4 block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center font-bold text-white hover:opacity-90"
              >
                Our Quiz
              </Link>
            </div>
            <div className="flex justify-center p-2 md:flex-[1_1_30%] xl:flex-1">
              <Link
                href="#subscription"
                className="heading-4 block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center font-bold text-white hover:opacity-90"
              >
                Subscription
              </Link>
            </div>
            <div className="flex justify-center p-2 md:flex-[1_1_40%] xl:flex-1">
              <Link
                href="#deliveries"
                className="heading-4 block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center font-bold text-white hover:opacity-90"
              >
                Deliveries
              </Link>
            </div>
            <div className="flex justify-center p-2 md:flex-[1_1_40%] xl:flex-1">
              <Link
                href="#payment"
                className="heading-4 block w-[220px] whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center font-bold text-white hover:opacity-90"
              >
                Payment
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-brown bg-opacity-10 py-16">
        <Container className="-my-8 max-w-screen-xl">
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
