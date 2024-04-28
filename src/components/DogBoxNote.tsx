import type { RecurringBox } from '@/entities';
import { formatDate } from '@/helpers/date';
import { isDeliveredBox } from '@/helpers/dog';
import { startOfDay } from 'date-fns';
import { useTranslations } from 'next-intl';

export function DogBoxNote({ name, boxs }: { name: string; boxs: RecurringBox[] }) {
  const refDate = startOfDay(new Date());
  const t = useTranslations();

  boxs.sort((a, b) => b.shipment.deliveryDate.getTime() - a.shipment.deliveryDate.getTime());

  const shipableBox = boxs.find(
    (box) =>
      box.order === undefined &&
      !isDeliveredBox(box.shipment.deliveryDate) &&
      box.shipment.editableDeadline <= refDate
  );

  if (!shipableBox) {
    throw new Error('should have upcoming box available');
  }

  // TODO: should hide upcoming box when the delivery completed and no more shipment eg. pause plan

  return (
    <>
      <p>
        {t.rich('{}-upcoming-box-is-scheduled-for-the-{}', {
          name: name,
          date: formatDate(t, shipableBox.shipment.deliveryDate, true),
        })}
      </p>
      <p className="mt-4">
        {t.rich('you-can-make-changes-until-the-{}', {
          date: formatDate(t, shipableBox.shipment.editableDeadline, true),
        })}
      </p>
    </>
  );
}
