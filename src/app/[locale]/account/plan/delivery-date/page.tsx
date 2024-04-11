import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import { getTranslations } from 'next-intl/server';
import setDeliveryDateAction from './action';
import BackButton from '@/components/buttons/BackButton';
import { getLoginedMe } from '@/actions';
import { getCalendarEvents } from '@/helpers/calendar';
import { getClosestOrderDeliveryDate } from '@/helpers/dog';
import DeliveryDatePickerForm from '@/components/forms/DeliveryDatePicker';
import DeliveryDatePickerDialog from '@/components/dialogs/DeliveryDatePicker';

export default async function PlanDeliveryDate() {
  const { dogs } = await getLoginedMe();
  const t = await getTranslations();
  const calendarEvents = await getCalendarEvents();
  const closestDeliveryDate = getClosestOrderDeliveryDate(calendarEvents);

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">
          {t('change-{}', { value: t('delivery-date') })}
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('your-upcoming-box-is-arriving-on-the-{}', {
            date: '[15th of December 2023]',
          })}{' '}
          It contains [Charlie]&apos;s and [Muffin]’s fresh food.
        </p>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
            date: '[29th of December 2023]',
          })}
        </p>
        <div className="mt-8 text-center">
          <DeliveryDatePickerDialog
            initialDate={new Date()}
            minDate={closestDeliveryDate}
            calendarEvents={calendarEvents}
            action={setDeliveryDateAction}
          >
            <Button>{t('reschedule-next-box')}</Button>
          </DeliveryDatePickerDialog>
        </div>
        <div className="mt-8 text-center">
          <BackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
