import { startOfDay } from 'date-fns';
import { useTranslations } from 'next-intl';

import type { RecurringBox } from '@/entities';
import { isDeliveredBox } from '@/helpers/dog';
import useSentence from '@/hooks/useSentence';

export function DogBoxNote({ name, boxs }: { name: string; boxs: RecurringBox[] }) {
  const refDate = startOfDay(new Date());
  const t = useTranslations();
  const sentence = useSentence();

  boxs.sort((a, b) => b.shipment.deliveryDate.getTime() - a.shipment.deliveryDate.getTime());

  const shipableBox = boxs.find(
    (box) =>
      box.order === undefined &&
      !isDeliveredBox(box.shipment.deliveryDate) &&
      box.shipment.editableDeadline <= refDate
  );

  // TODO: should hide upcoming box when the delivery completed and no more shipment eg. pause plan

  return (
    <>
      {shipableBox && (
        <p>
          {t.rich('{}-upcoming-box-is-scheduled-for-the-{}', {
            name: name,
            date: sentence.date(shipableBox.shipment.deliveryDate, true),
          })}
        </p>
      )}
      {shipableBox && (
        <p className="mt-4">
          {t.rich('you-can-make-changes-until-the-{}', {
            date: sentence.date(shipableBox.shipment.editableDeadline, true),
          })}
        </p>
      )}
    </>
  );
}
