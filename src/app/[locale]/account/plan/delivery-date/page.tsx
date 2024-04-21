import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import { getTranslations } from 'next-intl/server';
import setDeliveryDateAction from './action';
import BackButton from '@/components/buttons/BackButton';
import { getLoginedMe } from '@/actions';
import { getCalendarEvents } from '@/helpers/calendar';
import { getClosestOrderDeliveryDate, isDeliveredBox, isImmutableBox } from '@/helpers/dog';
import DeliveryDatePickerDialog from '@/components/dialogs/DeliveryDatePicker';
import { executeQuery } from '@/helpers/queryRunner';
import { Shipment } from '@/entities';
import { formatDate } from '@/helpers/date';
import { ShippableNote } from '@/components/ShippableNote';
import { startOfDay } from 'date-fns';

export default async function PlanDeliveryDate() {
  const { dogs, id } = await getLoginedMe();
  const t = await getTranslations();
  const calendarEvents = await getCalendarEvents();
  const closestDeliveryDate = getClosestOrderDeliveryDate(calendarEvents);
  const shipments = await executeQuery(async (queryRunner) => {
    return await queryRunner.manager.find(Shipment, {
      where: {
        boxs: {
          dog: {
            user: { id },
          },
        },
      },
      relations: {
        boxs: {
          dog: true,
          order: true,
        },
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
          <ShippableNote shipments={shipments} />
        </div>
        {shipments[0].lockBoxDate > startOfDay(new Date()) && (
          <div className="mt-8 text-center">
            <DeliveryDatePickerDialog
              initialDate={shipments[0].deliveryDate}
              minDate={closestDeliveryDate}
              calendarEvents={calendarEvents}
              action={setDeliveryDateAction}
            >
              <Button>{t('reschedule-next-box')}</Button>
            </DeliveryDatePickerDialog>
          </div>
        )}
        <div className="mt-8 text-center">
          <BackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
