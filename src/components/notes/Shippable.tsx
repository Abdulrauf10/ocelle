'use server';

import { startOfDay } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import { getLoginedMe } from '@/actions';
import { Dog, Shipment } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { isDeliveredRecurringBox } from '@/helpers/shipment';
import getSentence from '@/servers/getSentence';

export default async function ShippableNote() {
  const refDate = startOfDay(new Date());
  const { id } = await getLoginedMe();
  const t = await getTranslations();
  const sentence = await getSentence();
  const { shipments, dogs } = await executeQuery(async (queryRunner) => {
    return {
      shipments: await queryRunner.manager.find(Shipment, {
        where: {
          user: {
            id,
          },
        },
        order: {
          deliveryDate: -1,
        },
        take: 2,
      }),
      dogs: await queryRunner.manager.find(Dog, {
        where: {
          user: {
            id,
          },
        },
        relations: {
          plan: true,
          boxs: true,
        },
        order: {
          boxs: {
            startDate: -1,
          },
        },
      }),
    };
  });
  const orderableDogs = dogs.filter((dog) => dog.plan.isEnabled);

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
          {t.rich('your-upcoming-box-is-arriving-on-the-{}', {
            date: sentence.date(shipable.deliveryDate, true),
          })}{' '}
          {t('it-contains-{}-fresh-food', {
            value: new Intl.ListFormat('en-HK').format(
              orderableDogs.map((dog) => t('{}-apostrophe', { value: dog.name }))
            ),
          })}
        </p>
      )}
      {editable && (
        <p className="mt-4">
          {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
            date: sentence.date(editable.deliveryDate, true),
          })}
        </p>
      )}
    </>
  );
}
