import { startOfDay } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import setDeliveryDateAction from './action';

import { getLoginedMe } from '@/actions';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import DeliveryDatePickerDialog from '@/components/dialogs/DeliveryDatePicker';
import ShippableNote from '@/components/notes/Shippable';
import { Shipment } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { getRecurringBoxMinDeliveryDate } from '@/helpers/shipment';
import calendarService from '@/services/calendar';

export default async function PlanDeliveryDate() {
  const { id } = await getLoginedMe();
  const t = await getTranslations();
  const calendarEvents = await calendarService.getCalendarEvents();
  const minDeliveryDate = getRecurringBoxMinDeliveryDate(calendarEvents);
  const shipments = await executeQuery(async (queryRunner) => {
    return await queryRunner.manager.find(Shipment, {
      where: {
        user: { id },
      },
      order: {
        deliveryDate: -1,
      },
      take: 2,
    });
  });

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">
          {t('change-{}', { value: t('delivery-date') })}
        </h1>
        <div className="mx-auto mt-4 max-w-[620px] text-center">
          <ShippableNote />
        </div>
        {shipments[0].editableDeadline > startOfDay(new Date()) && (
          <div className="mt-8 text-center">
            <DeliveryDatePickerDialog
              initialDate={shipments[0].deliveryDate}
              minDate={minDeliveryDate}
              calendarEvents={calendarEvents}
              action={setDeliveryDateAction}
            >
              <Button>{t('reschedule-next-box')}</Button>
            </DeliveryDatePickerDialog>
          </div>
        )}
        <div className="mt-8 text-center">
          <UnderlineBackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
