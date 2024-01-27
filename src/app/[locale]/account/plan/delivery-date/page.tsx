'use client';

import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import H2 from '@/components/headings/H2';
import Button from '@/components/Button';
import { useForm } from 'react-hook-form';
import DateCalendar from '@/components/controls/DateCalendar';
import { useTranslations } from 'next-intl';

export default function PlanDeliveryDate() {
  const t = useTranslations('general');
  const router = useRouter();
  const { control } = useForm();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <H2 inline className="text-center text-primary">
          Change Delivery Date
        </H2>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          Your upcoming box is arriving on the{' '}
          <strong className="whitespace-nowrap">[15th of December 2023]</strong>. It contains
          [Charlie]&apos;s and [Muffin]’s fresh food.
        </p>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          Unfortunately, you can no longer make changes to your upcoming box. However, you can
          reschedule your next box, scheduled for the{' '}
          <strong className="whitespace-nowrap">[29th of December 2023]</strong>.
        </p>
        <div className="mt-8 text-center">
          <Button>Reschedule Next Box</Button>
        </div>
        <div className="mt-8">
          <DateCalendar name="deliveryDate" control={control} minDate={new Date()} />
        </div>
        <div className="mt-8 text-center">
          <UnderlineButton type="button" label={t('go-back')} onClick={() => router.back()} />
        </div>
      </Container>
    </main>
  );
}
