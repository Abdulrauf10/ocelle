import { format, isBefore, startOfDay } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import { isDeliveredRecurringBox } from '@/helpers/shipment';
import userService from '@/services/user';

export default async function Orders() {
  const t = await getTranslations();
  const b = await getTranslations('Button');
  const orders = await userService.orders();
  const today = startOfDay(new Date());

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">{t('orders')}</h1>
        <div className="mt-6"></div>
        <div className="mx-auto max-w-[680px] overflow-hidden rounded-3xl border border-gray">
          <table className="w-full">
            <thead className="bg-gray text-white">
              <tr>
                <th className="px-2 py-4">{t('order')}</th>
                <th className="px-2 py-4">{t('delivery-date')}</th>
                <th className="px-2 py-4">{t('status')}</th>
                <th className="px-2 py-4">{t('bill-total')}</th>
                <th className="px-2 py-4">{t('invoice')}</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {orders.map(({ order, shipment }) => {
                return (
                  <tr key={order.id}>
                    <td className="px-2 py-3">{order.number}</td>
                    <td className="px-2 py-3">{format(shipment.deliveryDate, 'dd/MM/yy')}</td>
                    <td className="px-2 py-3">
                      {isDeliveredRecurringBox(shipment.deliveryDate)
                        ? t('delivered')
                        : isBefore(today, startOfDay(shipment.editableDeadline))
                          ? t('order-processing')
                          : t('order-scheduled')}
                    </td>
                    <td className="px-2 py-3">${order.total.gross.amount}</td>
                    <td className="px-2 py-3">
                      <UnderlineButton label={b('see-details')} />
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-t-gray">
                <td colSpan={5} className="px-2 py-3">
                  <UnderlineButton theme="primary" label={t('load-more')} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <UnderlineBackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
