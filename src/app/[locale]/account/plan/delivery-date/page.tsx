'use client';

import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import Button from '@/components/Button';
import { useForm } from 'react-hook-form';
import DateCalendar from '@/components/controls/DateCalendar';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';

export default function PlanDeliveryDate() {
  const t = useTranslations();
  const router = useRouter();
  const { control } = useForm();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <Headings tag="h1" styles="h2" className="text-center text-primary">
          {t('change-{}', { value: t('delivery-date') })}
        </Headings>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('your-upcoming-box-is-arriving-on-the-{}', {
            date: '[15th of December 2023]',
            strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
          })}{' '}
          It contains [Charlie]&apos;s and [Muffin]’s fresh food.
        </p>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
            date: '[29th of December 2023]',
            strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
          })}
        </p>
        <div className="mt-8 text-center">
          <Button>{t('reschedule-next-box')}</Button>
        </div>
        <div className="mt-8">
          <DateCalendar
            name="deliveryDate"
            control={control}
            minDate={new Date()}
            actions={[
              { label: t('cancel'), onClick: () => {} },
              { label: t('save-changes'), disabled: true, onClick: () => {} },
            ]}
          />
        </div>
        <div className="mt-8 text-center">
          <UnderlineButton type="button" label={t('go-back')} onClick={() => router.back()} />
        </div>
      </Container>
    </main>
  );
}
