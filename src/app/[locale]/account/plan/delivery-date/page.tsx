import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import { getTranslations } from 'next-intl/server';
import setDeliveryDateAction from './action';
import BackButton from '@/components/buttons/BackButton';
import { getLoginedMe } from '@/actions';
import { getCalendarEvents } from '@/helpers/calendar';
import { getClosestOrderDeliveryDate, isImmutableBox } from '@/helpers/dog';
import DeliveryDatePickerDialog from '@/components/dialogs/DeliveryDatePicker';
import { executeQuery } from '@/helpers/queryRunner';
import { Shipment } from '@/entities';
import { formatDate } from '@/helpers/date';

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

  // TODO: should hide upcoming box when the delivery completed and no more shipment eg. pause plan

  const shipable = shipments.find((shipment) => shipment.boxs.every((box) => !!box.order));

  if (!shipable) {
    throw new Error('should have shipment available to upcoming boxs');
  }

  const prevShipmentEditable =
    shipments[1] && !isImmutableBox(calendarEvents, shipments[1].deliveryDate);
  const nextShipmentEditable =
    shipments[0] && !isImmutableBox(calendarEvents, shipments[0].deliveryDate);

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">
          {t('change-{}', { value: t('delivery-date') })}
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('your-upcoming-box-is-arriving-on-the-{}', {
            date: formatDate(t, shipable.deliveryDate, true),
          })}{' '}
          {t('it-contains-{}-fresh-food', {
            value: shipable.boxs.map((box) => `${box.dog.name}’s`).join(' and '),
          })}
        </p>
        {!prevShipmentEditable && nextShipmentEditable && (
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
              date: formatDate(t, shipments[0].deliveryDate, true),
            })}
          </p>
        )}
        {nextShipmentEditable && (
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
