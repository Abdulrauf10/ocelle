import React from 'react';
import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Email from '@/components/icons/Email';
import Whatsapp from '@/components/icons/Whatsapp';
import Link from 'next/link';
import QuestionAnswerBlock from './QuestionAnswerBlock';

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
      <div id={id} className="relative -top-[90px]"></div>
      <h2 className="text-5xl font-bold text-primary max-sm:text-3xl">{title}</h2>
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
      <div className="bg-[url('/faq.jpg')] bg-[length:auto_100%] bg-center bg-repeat-x py-24">
        <Container>
          <h2 className="-ml-3 select-none text-[215px] font-bold leading-none text-white drop-shadow-[5px_5px_12px_rgba(0,0,0,.5)] max-lg:text-[130px]">
            FAQ
          </h2>
          <p className="body-2 text-white">
            If you can’t find what you’re looking for, please contact us!
          </p>
          <div className="mt-6">
            <Link href="#" className="inline-flex text-white hover:underline">
              <Email className="w-7" />
              <span className="body-1 ml-3 font-bold">info@ocelle.dog</span>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="#" className="inline-flex text-white hover:underline">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Whatsapp className="w-4 text-primary" />
              </div>
              <span className="body-1 ml-3 font-bold">WhatsApp Number</span>
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
                className="heading-3 block whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Our Food
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#our-quiz"
                className="heading-3 block whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Our Quiz
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#subscription"
                className="heading-3 block whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Subscription
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#deliveries"
                className="heading-3 block whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center text-white hover:opacity-90 max-sm:w-[180px]"
              >
                Deliveries
              </Link>
            </div>
            <div className="p-2">
              <Link
                href="#payment"
                className="heading-3 block whitespace-nowrap rounded-3xl bg-primary px-10 py-0.5 text-center text-white hover:opacity-90 max-sm:w-[180px]"
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
