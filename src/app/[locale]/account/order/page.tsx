'use client';

import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import { useTranslations } from 'next-intl';

export default function Orders() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">{t('orders')}</h1>
        <div className="mx-auto mt-6 max-w-[680px] overflow-hidden rounded-3xl border border-gray">
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
              <tr>
                <td className="px-2 py-3">[R1234]</td>
                <td className="px-2 py-3">[DD/MM/YY]</td>
                <td className="px-2 py-3">[Order Scheduled]</td>
                <td className="px-2 py-3">[$500]</td>
                <td className="px-2 py-3">
                  <UnderlineButton label={t('see-details')} />
                </td>
              </tr>
              <tr className="border-t border-t-gray">
                <td className="px-2 py-3">[R1234]</td>
                <td className="px-2 py-3">[DD/MM/YY]</td>
                <td className="px-2 py-3">[Order Processing]</td>
                <td className="px-2 py-3">[$500]</td>
                <td className="px-2 py-3">
                  <UnderlineButton label={t('see-details')} />
                </td>
              </tr>
              <tr className="border-t border-t-gray">
                <td className="px-2 py-3">[R1234]</td>
                <td className="px-2 py-3">[DD/MM/YY]</td>
                <td className="px-2 py-3">[Delivered]</td>
                <td className="px-2 py-3">[$500]</td>
                <td className="px-2 py-3">
                  <UnderlineButton label={t('see-details')} />
                </td>
              </tr>
              <tr className="border-t border-t-gray">
                <td colSpan={5} className="px-2 py-3">
                  <UnderlineButton theme="primary" label={t('load-more')} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <UnderlineButton type="button" onClick={() => router.back()} label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
