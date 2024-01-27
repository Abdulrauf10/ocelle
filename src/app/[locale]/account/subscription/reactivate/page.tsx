'use client';

import { useRouter } from '@/navigation';
import clsx from 'clsx';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import EditButton from '@/components/EditButton';
import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';
import Image from 'next/image';
import Button from '@/components/Button';

interface BlockProps {
  className?: string;
}

function Block({ className, children }: React.PropsWithChildren<BlockProps>) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-[720px] rounded-2xl border border-gray bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}

function Hr() {
  return <hr className="my-4 border-gray" />;
}

function SectionTitle({ children }: React.PropsWithChildren) {
  return <strong className="text-lg text-gold">{children}</strong>;
}

export default function Reactivate() {
  const router = useRouter();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <H2 inline className="text-center text-primary">
          Welcome Back To The OCELLE Pack!
        </H2>
        <p className="mt-6 text-center">Please review your details below.</p>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">
                [Muffin]’s Information & Plan Details
              </div>
            </div>
            <button className="px-2">
              <Sub className="h-4 w-4" />
            </button>
          </div>
          <Hr />
          <div className="-mx-2 flex items-center">
            <div className="flex-1 px-2">
              <SectionTitle>Dog’s Information</SectionTitle>
              <p>
                [Muffin] is, [7 years and 7 months old, 8 kg, mellow, is spayed, and has no
                allergies / food sensitivities]
              </p>
            </div>
            <div className="px-2">
              <EditButton onClick={() => router.push('/account/dog/1')} />
            </div>
          </div>
          <Hr />
          <div className="-mx-2 flex items-center">
            <div className="flex-1 px-2">
              <SectionTitle>Meal Plan</SectionTitle>
              <p>Fresh [Full] Plan</p>
            </div>
            <div className="px-2">
              <EditButton onClick={() => router.push('/account/plan/meal')} />
            </div>
          </div>
          <Hr />
          <div className="-mx-2 flex items-center">
            <div className="flex-1 px-2">
              <SectionTitle>Fresh Recipes</SectionTitle>
              <p>[Fresh Beef]</p>
            </div>
            <div className="px-2">
              <EditButton onClick={() => () => router.push('/account/plan/recipe')} />
            </div>
          </div>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">Address</div>
            </div>
            <EditButton className="px-2" onClick={() => router.push('/account/address')} />
          </div>
          <Hr />
          <SectionTitle>Delivery</SectionTitle>
          <p>[20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]</p>
          <Hr />
          <SectionTitle>Billing</SectionTitle>
          <p>[20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]</p>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">Payment Info</div>
            </div>
            <EditButton className="px-2" onClick={() => router.push('/account/payment')} />
          </div>
          <Hr />
          <div className="flex items-center">
            [
            <Image
              src="/payments/mc.svg"
              alt="Master Card Icon"
              className="inline-block"
              width={46}
              height={30}
            />
            &nbsp;
            <span className="relative top-0.5">**** **** ****</span>&nbsp;1234]
          </div>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">[Delivery Frequency]</div>
            </div>
            <EditButton className="px-2" onClick={() => router.push('/account/plan/often')} />
          </div>
          <Hr />
          <p>[Every 2 Weeks]</p>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">Delivery Date</div>
            </div>
            <EditButton
              className="px-2"
              onClick={() => router.push('/account/plan/delivery-date')}
            />
          </div>
          <Hr />
          <p>
            <SectionTitle>Scheduled:</SectionTitle> [15th of December 2024]
          </p>
          <p>
            After reactivating, you can adjust your delivery date until the [10th of December 2024]
            11:59PM.
          </p>
        </Block>
        <Block className="mt-8">
          <div className="text-2xl font-bold text-primary">[Muffin]’s Fresh Food Box</div>
          <div className="mt-5">
            <div className="-m-3 flex items-center max-sm:flex-col">
              <div className="p-3">
                <Image src="/reactivate-box.svg" alt="Reactivate box" width={180} height={180} />
              </div>
              <div className="w-full flex-1 p-3">
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Meal Plan:</div>
                  <div className="flex-1 text-right">Fresh [Full] Plan</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Recipes:</div>
                  <div className="flex-1 text-right">[Fresh Beef]</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Days Of Food:</div>
                  <div className="flex-1 text-right">[14] Days</div>
                </div>
              </div>
            </div>
          </div>
          <Hr />
          <div className="text-2xl font-bold text-primary">[Charlie]’s Fresh Food Box</div>
          <div className="mt-5">
            <div className="-m-3 flex items-center max-sm:flex-col">
              <div className="p-3">
                <Image src="/reactivate-box.svg" alt="Reactivate box" width={180} height={180} />
              </div>
              <div className="w-full flex-1 p-3">
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Meal Plan:</div>
                  <div className="flex-1 text-right">Fresh [Half] Plan</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Recipes:</div>
                  <div className="flex-1 text-right">[Fresh Beef, Fresh Chicken]</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Days Of Food:</div>
                  <div className="flex-1 text-right">[14] Days</div>
                </div>
              </div>
            </div>
          </div>
          <Hr />
          <div className="">
            <div className="-m-3 flex items-center max-sm:flex-col">
              <div className="p-3">
                <div className="w-[180px]"></div>
              </div>
              <div className="w-full flex-1 p-3">
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Delivery:</div>
                  <div className="flex-1 text-right">[Free]</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Promo Code:</div>
                  <div className="flex-1 text-right">－</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">Today’s Total:</div>
                  <div className="flex-1 text-right">$[250]</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto my-6 max-w-[320px]">
            <Button fullWidth>Reactivate Plan</Button>
          </div>
        </Block>
      </Container>
    </main>
  );
}
