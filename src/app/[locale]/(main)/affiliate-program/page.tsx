import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Block from '@/components/layouts/Block';
import { Link } from '@/navigation';

export default function AffiliateProgram() {
  const t = useTranslations();

  return (
    <main>
      <div className="bg-[url('./affiliate-bg.jpg')] bg-[length:auto_100%] bg-center bg-repeat-x py-10">
        <div className="py-[4vw] pl-[2vw] text-xl text-white max-lg:w-full">
          <h1 className="text-[5vw] font-bold leading-[6.2vw]">
            Become An OCELLE
            <br />
            Affiliate Ambassador
          </h1>
          <div className="w-1/3 max-lg:w-1/4">
            <div className="mt-5"></div>
            <p className="body-2">
              Vets, retailers, and dog lovers; come join the OCELLE Pack and become an Affiliate
              Ambassador. Help in our mission to improve the health and happiness of our beloved
              pets.
            </p>
            <div className="mt-3"></div>
            <p className="body-2">
              Sign up <span className="italic">now!</span> Join with us and start earning today!
            </p>
          </div>
          <div className="mt-5">
            <Button>{t('join-now')}</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap max-lg:flex-col-reverse">
        <div className="min-h-[460px] w-1/2 bg-[url('./glass-dog.jpg')] bg-cover bg-[center_right] max-lg:w-full"></div>
        <div className="w-1/2 bg-primary bg-opacity-10 px-[4vw] max-lg:w-full">
          <Block className="text-primary">
            <h2 className="heading-1 text-center font-bold">The Program</h2>
            <div className="mx-auto mt-8 max-w-[580px]">
              <div className="-mx-4 -my-6 flex flex-wrap justify-center text-center">
                <div className="w-2/5 px-4 py-6 max-xs:w-full">
                  <div className="mx-auto w-16">
                    <div className="relative pt-[100%]">
                      <Image src="/affiliate/no-fee.svg" alt="no fee" fill />
                    </div>
                  </div>
                  <div className="mt-2"></div>
                  <h3 className="body-1 body-weight-1">Free to join</h3>
                </div>
                <div className="w-3/5 px-4 py-6 max-xs:w-full">
                  <div className="mx-auto w-16">
                    <div className="relative pt-[100%]">
                      <Image src="/affiliate/commission.svg" alt="commission" fill />
                    </div>
                  </div>
                  <div className="mt-2"></div>
                  <h3 className="body-1 body-weight-1">
                    Ongoing commissions for each new customer you refer
                  </h3>
                </div>
                <div className="w-2/5 px-4 py-6 max-xs:w-full">
                  <div className="mx-auto w-16">
                    <div className="relative pt-[100%]">
                      <Image src="/affiliate/monthly.svg" alt="no fee" fill />
                    </div>
                  </div>
                  <div className="mt-2"></div>
                  <h3 className="body-1 body-weight-1">Monthly pay-outs</h3>
                </div>
                <div className="w-3/5 px-4 py-6 max-xs:w-full">
                  <div className="mx-auto w-16">
                    <div className="relative pt-[100%]">
                      <Image src="/affiliate/gift.svg" alt="commission" fill />
                    </div>
                  </div>
                  <div className="mt-2"></div>
                  <h3 className="body-1 body-weight-1">
                    Custom offers and promotions for your audience
                  </h3>
                </div>
                <div className="w-2/5 px-4 py-6 max-xs:w-full">
                  <div className="mx-auto w-16">
                    <div className="relative pt-[100%]">
                      <Image src="/affiliate/tracking.svg" alt="no fee" fill />
                    </div>
                  </div>
                  <div className="mt-2"></div>
                  <h3 className="body-1 body-weight-1">Real-time stat tracking</h3>
                </div>
                <div className="w-3/5 px-4 py-6 max-xs:w-full">
                  <div className="mx-auto w-16">
                    <div className="relative pt-[100%]">
                      <Image src="/affiliate/orders.svg" alt="commission" fill />
                    </div>
                  </div>
                  <div className="mt-2"></div>
                  <h3 className="body-1 body-weight-1">
                    We handle orders, deliveries, and payment
                  </h3>
                </div>
              </div>
            </div>
          </Block>
        </div>
      </div>
      <Block className="bg-gray bg-opacity-20">
        <Container className="max-w-screen-xl text-center">
          <h2 className="heading-1 font-bold text-gold">
            Spread The Health
            <br />
            And We’ll Share The Wealth!
          </h2>
          <div className="mt-10">
            <div className="-mx-4 -my-4 flex flex-wrap">
              <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                <div className="h-full rounded-3xl bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
                  <h3 className="heading-4 font-bold text-gold">1. Join The Program</h3>
                  <div className="mt-4"></div>
                  <p className="body-1">
                    Complete the short form via the ‘Join Now’ button and we’ll get you started on
                    the onboarding process.
                    <br />
                    <br />
                    Have questions? Email us at{' '}
                    <UnderlineButton
                      theme="primary"
                      href="mailto:affiliates@ocelle.dog"
                      label="affiliates@ocelle.dog"
                    />
                  </p>
                </div>
              </div>
              <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                <div className="h-full rounded-3xl bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
                  <h3 className="heading-4 font-bold text-gold">2. Learn About Fresh Food</h3>
                  <div className="mt-4"></div>
                  <p className="body-1">
                    Once your application is approved, we’ll share brand materials with you. As an
                    Affiliate Ambassador, you’ll be the first to know about upcoming promotions and
                    special announcements.
                  </p>
                </div>
              </div>
              <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                <div className="h-full rounded-3xl bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
                  <h3 className="heading-4 font-bold text-gold">3. Earn Money</h3>
                  <div className="mt-4"></div>
                  <p className="body-1">
                    When new customers use your unique code to purchase a subscription from OCELLE,
                    you’ll earn continuous commissions for as long as your referrals stay
                    subscribed.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Button>{t('join-now')}</Button>
          </div>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
