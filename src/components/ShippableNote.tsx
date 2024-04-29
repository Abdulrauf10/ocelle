import { startOfDay } from 'date-fns';
import { useTranslations } from 'next-intl';

import type { Shipment } from '@/entities';
import { isDeliveredBox } from '@/helpers/dog';
import useSentence from '@/hooks/useSentence';

export function ShippableNote({ shipments }: { shipments: Shipment[] }) {
  const refDate = startOfDay(new Date());
  const t = useTranslations();
  const sentence = useSentence();

  shipments.sort((a, b) => b.deliveryDate.getTime() - a.deliveryDate.getTime());

  const shipable = shipments.find(
    (shipment) => !isDeliveredBox(shipment.deliveryDate) && shipment.editableDeadline <= refDate
  );

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
              shipable.boxs.map((box) => t('{}-apostrophe', { value: box.dog.name }))
            ),
          })}
        </p>
      )}
      {shipments[0].editableDeadline >= refDate && (
        <p className="mt-4">
          {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
            date: sentence.date(shipments[0].deliveryDate, true),
          })}
        </p>
      )}
    </>
  );
}
