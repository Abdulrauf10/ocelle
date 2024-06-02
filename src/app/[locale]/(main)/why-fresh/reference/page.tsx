import { useTranslations } from 'next-intl';

import Container from '@/components/Container';
import Block from '@/components/layouts/Block';

export default function WhyFreshReference() {
  const i = useTranslations('WhyFresh-Reference');

  return (
    <main className="break-all">
      <Block className="bg-primary bg-opacity-10">
        <Container>
          <h1 className="heading-2 font-bold text-primary">{i('title')}</h1>
          <div className="pt-10"></div>
          <div id="benefits-of-fresh-dog-food" className="relative -top-[140px]"></div>
          <h2 className="border-b pb-5 text-primary">
            <span className="heading-4">{i('block-1-title')}</span>
          </h2>
          <div className="pt-5"></div>
          <ol className="list-decimal pl-[18px] [&_li]:pb-2 [&_li]:pl-2">
            <li>{i('block-1-content-1')}</li>
            <li>{i('block-1-content-2')}</li>
            <li>{i('block-1-content-3')}</li>
            <li>{i('block-1-content-4')}</li>
            <li>{i('block-1-content-5')}</li>
            <li>{i('block-1-content-6')}</li>
            <li>{i('block-1-content-7')}</li>
            <li>{i('block-1-content-8')}</li>
            <li>{i('block-1-content-9')}</li>
            <li>{i('block-1-content-10')}</li>
            <li>{i('block-1-content-11')}</li>
            <li>{i('block-1-content-12')}</li>
            <li>{i('block-1-content-13')}</li>
            <li>{i('block-1-content-14')}</li>
            <li>{i('block-1-content-15')}</li>
            <li>{i('block-1-content-16')}</li>
            <li>{i('block-1-content-17')}</li>
            <li>{i('block-1-content-18')}</li>
            <li>{i('block-1-content-19')}</li>
            <li>{i('block-1-content-20')}</li>
            <li>{i('block-1-content-21')}</li>
            <li>{i('block-1-content-22')}</li>
          </ol>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-[12%]">
        <Container>
          <div id="its-time-to-rethink-kibble" className="relative -top-[140px]"></div>
          <h2 className="border-b pb-5 text-gold">
            <span className="heading-4">{i('block-2-title')}</span>
          </h2>
          <div className="pt-5"></div>
          <ol className="list-decimal pl-[18px] [&_li]:pb-2 [&_li]:pl-2">
            <li>{i('block-2-content-1')}</li>
            <li>{i('block-2-content-2')}</li>
            <li>{i('block-2-content-3')}</li>
            <li>{i('block-2-content-4')}</li>
            <li>{i('block-2-content-5')}</li>
            <li>{i('block-2-content-6')}</li>
            <li>{i('block-2-content-7')}</li>
            <li>{i('block-2-content-8')}</li>
            <li>{i('block-2-content-9')}</li>
            <li>{i('block-2-content-10')}</li>
            <li>{i('block-2-content-11')}</li>
            <li>{i('block-2-content-12')}</li>
            <li>{i('block-2-content-13')}</li>
            <li>{i('block-2-content-14')}</li>
            <li>{i('block-2-content-15')}</li>
            <li>{i('block-2-content-16')}</li>
            <li>{i('block-2-content-17')}</li>
            <li>{i('block-2-content-18')}</li>
            <li>{i('block-2-content-19')}</li>
            <li>{i('block-2-content-20')}</li>
            <li>{i('block-2-content-21')}</li>
            <li>{i('block-2-content-22')}</li>
            <li>{i('block-2-content-23')}</li>
            <li>{i('block-2-content-24')}</li>
          </ol>
        </Container>
      </Block>
      <Block className="bg-dark-green bg-opacity-[12%]">
        <Container>
          <div id="raw-dog-food-vs-gently-cooked" className="relative -top-[140px]"></div>
          <h2 className="border-b pb-5 text-dark-green">
            <span className="heading-4">{i('block-3-title')}</span>
          </h2>
          <div className="pt-5"></div>
          <ol className="list-decimal pl-[18px] [&_li]:pb-2 [&_li]:pl-2">
            <li>{i('block-3-content-1')}</li>
            <li>{i('block-3-content-2')}</li>
            <li>{i('block-3-content-3')}</li>
            <li>{i('block-3-content-4')}</li>
            <li>{i('block-3-content-5')}</li>
            <li>{i('block-3-content-6')}</li>
            <li>{i('block-3-content-7')}</li>
            <li>{i('block-3-content-8')}</li>
            <li>{i('block-3-content-9')}</li>
            <li>{i('block-3-content-10')}</li>
            <li>{i('block-3-content-11')}</li>
            <li>{i('block-3-content-12')}</li>
            <li>{i('block-3-content-13')}</li>
            <li>{i('block-3-content-14')}</li>
            <li>{i('block-3-content-15')}</li>
            <li>{i('block-3-content-16')}</li>
            <li>{i('block-3-content-17')}</li>
            <li>{i('block-3-content-18')}</li>
          </ol>
        </Container>
      </Block>
      <Block className="bg-gray bg-opacity-[12%]">
        <Container>
          <div
            id="challenges-with-home-cooking-for-your-dog"
            className="relative -top-[140px]"
          ></div>
          <h2 className="border-b pb-5 text-gray">
            <span className="heading-4">{i('block-4-title')}</span>
          </h2>
          <div className="pt-5"></div>
          <ol className="list-decimal pl-[18px] [&_li]:pb-2 [&_li]:pl-2">
            <li>{i('block-4-content-1')}</li>
            <li>{i('block-4-content-2')}</li>
          </ol>
        </Container>
      </Block>
    </main>
  );
}
