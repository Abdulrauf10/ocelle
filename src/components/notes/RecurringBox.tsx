'use server';

import { startOfDay } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import { Dog, Shipment } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { isDeliveredRecurringBox } from '@/helpers/shipment';
import getSentence from '@/servers/getSentence';

export default async function RecurringBoxNote({ id }: { id: number }) {
  const refDate = startOfDay(new Date());
  const t = await getTranslations();
  const sentence = await getSentence();
  const { dog, shipments } = await executeQuery(async (queryRunner) => {
    return {
      dog: await queryRunner.manager.findOne(Dog, {
        where: { id },
      }),
      shipments: await queryRunner.manager.find(Shipment, {
        where: {
          dog: { id },
        },
        order: {
          deliveryDate: -1,
        },
        take: 2,
      }),
    };
  });

  if (!dog) {
    throw new Error('dog not found');
  }

  const shipable = shipments.find(
    (shipment) =>
      !isDeliveredRecurringBox(shipment.deliveryDate) && shipment.editableDeadline <= refDate
  );

  const editable = shipments.find((shipment) => shipment.editableDeadline >= refDate);

  // TODO: should hide upcoming box when the delivery completed and no more shipment eg. pause plan

  return (
    <>
      {shipable && (
        <p>
          {t.rich('{}-upcoming-box-is-scheduled-for-the-{}', {
            name: dog.name,
            date: sentence.date(shipable.deliveryDate, true),
          })}
        </p>
      )}
      {editable && (
        <p className="mt-4">
          {t.rich('you-can-make-changes-until-the-{}', {
            date: sentence.date(editable.editableDeadline, true),
          })}
        </p>
      )}
    </>
  );
}
