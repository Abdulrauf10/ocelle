import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/Heading/H2';
import Unbox from '@/components/Icon/Unbox';
import User from '@/components/Icon/User';
import clsx from 'clsx';
import { Route } from '../types';
import HomeAddress from '@/components/Icon/HomeAddress';
import Billing from '@/components/Icon/Billing';
import Image from 'next/image';
import Bell from '@/components/Icon/Bell';

interface BlockProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  onClick(): void;
}

function Block({
  className,
  icon,
  title,
  description,
  onClick,
  children,
}: React.PropsWithChildren<BlockProps>) {
  return (
    <div
      className={clsx(
        'border-gray -mx-2 flex cursor-pointer items-center rounded-2xl border bg-white px-4 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex-1 px-2">
        <div className="-mx-2 flex items-center">
          <div className="px-2">{icon}</div>
          <div className="px-2">
            <div className="text-brown text-xl">{title}</div>
            {description && <div>{description}</div>}
          </div>
        </div>
        {children}
      </div>
      <div className="px-2">
        <button>
          <svg viewBox="0 0 7 13" className="w-2">
            <polyline
              className="stroke-brown fill-none"
              strokeLinecap="round"
              strokeLinejoin="round"
              points=".5 .5 6.5 6.5 .5 12.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function InfoFragment({ navigate }: FragmentProps<Route>) {
  return (
    <div className="py-10">
      <Container>
        <H2 inline className="text-center text-primary">
          My Info
        </H2>
        <p className="mt-4 text-center">Manage your account information</p>
        <div className="py-4"></div>
        <div className="mx-auto max-w-[480px]">
          <Block
            icon={<Unbox className="w-16" />}
            title="Orders"
            description="Current Order ID# [xxxxxx]"
            onClick={() => navigate('orders')}
          />
          <Block
            className="mt-8"
            icon={<User className="mx-2 w-12" />}
            title="Account Info"
            description="ksaunders@ocelle.dog"
            onClick={() => navigate('account')}
          />
          <Block
            className="mt-8"
            icon={<HomeAddress className="w-16" />}
            title="Address"
            onClick={() => navigate('address')}
          >
            <div className="mt-4 flex max-xs:flex-wrap">
              <strong className="text-gold min-w-[82px]">Devlivery:</strong>
              <span className="w-full">
                [20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]
              </span>
            </div>
            <div className="mt-3 flex max-xs:flex-wrap">
              <strong className="text-gold min-w-[82px]">Billing:</strong>
              <span className="w-full">
                [20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]
              </span>
            </div>
          </Block>
          <Block
            className="mt-8"
            icon={<Billing className="w-14 px-1" />}
            title="Payment Info"
            onClick={() => navigate('payments')}
          >
            <div className="mt-4 flex items-center">
              [
              <Image
                src="/payments/mc.svg"
                alt="Master Card Icon"
                className="inline-block"
                width={28}
                height={18}
              />
              &nbsp;
              <span className="relative top-0.5">**** **** ****</span>&nbsp;1234]
            </div>
          </Block>
          <Block
            className="mt-8"
            icon={<Bell className="mx-3 w-10" />}
            title="Subscriptions"
            description={
              <div>
                <div className="mt-1 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#1EA939]"></div>
                  <div className="ml-3 min-w-[80px]">[Charlie]</div>
                  <div className="pl-1">Plan [Active]</div>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="bg-error h-3 w-3 rounded-full"></div>
                  <div className="ml-3 min-w-[80px]">[Muffin]</div>
                  <div className="pl-1">Plan [Inactive]</div>
                </div>
              </div>
            }
            onClick={() => navigate('subscriptions')}
          />
        </div>
      </Container>
    </div>
  );
}
