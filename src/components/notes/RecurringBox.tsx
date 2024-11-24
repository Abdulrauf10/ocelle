'use server';

import { startOfDay } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import { Dog, Shipment } from '@/entities';
import { PadSpace } from '@/enums';
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

  const editable = shipments.find((shipment) => shipment.editableDeadline >= refDate);

  const deadlinedShipable = shipments.find(
    (shipment) =>
      !isDeliveredRecurringBox(shipment.deliveryDate) && shipment.editableDeadline <= refDate
  );

  const shipable = deadlinedShipable || editable;

  // TODO: should hide upcoming box when the delivery completed and no more shipment eg. pause plan

  return (
    <>
      {shipable && (
        <p>
          {t.rich('{}-upcoming-box-is-scheduled-for-the-{}', {
            name: sentence.padSpace(PadSpace.Right, dog.name),
            date: sentence.date(shipable.deliveryDate, true),
          })}
        </p>
      )}
      {editable && !deadlinedShipable && (
        <p className="mt-3">
          {t.rich('you-can-make-changes-until-the-{}', {
            date: sentence.datetime(editable.editableDeadline, true),
          })}
        </p>
      )}
      {editable && deadlinedShipable && (
        <p className="mt-4">
          {t.rich('unfortunately-you-can-no-longer-make-changes-to-{}-upcoming-box', {
            name: sentence.padSpace(PadSpace.Both, dog.name),
          })}
          <br />
          {t.rich('any-desired-changes-will-go-into-effect-for-{}-next-box-scheduled-for-the-{}', {
            sex: dog.sex,
            date: sentence.date(editable!.deliveryDate, true),
          })}
        </p>
      )}
    </>
  );
}
