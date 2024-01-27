import { FragmentProps } from '@/components/FragmentRouter';
import { Path } from '../types';
import Container from '@/components/Container';
import CircleTick from '@/components/icons/CircleTick';
import UnderlineButton from '@/components/UnderlineButton';
import H2 from '@/components/headings/H2';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function CompleteFragment({ navigate }: FragmentProps<Path>) {
  const t = useTranslations('general');

  return (
    <Container>
      <div className="mx-auto h-12 w-12 rounded-full bg-secondary p-1.5">
        <CircleTick className="relative top-px" />
      </div>
      <H2 inline className="mt-2 text-center text-primary">
        Cancellation Successful
      </H2>
      <div className="relative -m-2 mx-auto mt-6 flex max-w-[780px] items-center justify-center max-lg:flex-col">
        <div className="absolute -left-24 p-2 max-lg:static">
          <Image src="/sorry.svg" alt="Sorry dog" width={80} height={80} />
        </div>
        <div className="p-2">
          <div className="text-center text-2xl font-bold text-gold">Till We Meet Again!</div>
          <p className="mx-auto mt-4 text-center">
            Thank you for your patronage. <br />
            As a much-valued Client, we are truly sorry to see you go; and if you decide to re-join
            the OCELLE Pack again, <br />
            we’d be truly delighted to see you! Our mission to constantly improve will continue;{' '}
            <br />
            in the meantime, we wish you all the very best!
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <UnderlineButton
          type="button"
          href="/account"
          label={t('back-to', { name: t('my-info') })}
        />
      </div>
    </Container>
  );
}
