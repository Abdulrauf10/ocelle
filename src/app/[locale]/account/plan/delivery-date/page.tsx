import Container from '@/components/Container';
import Button from '@/components/Button';
import { Dog } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { getStoreMe } from '@/storeUserProvider';
import { getTranslations } from 'next-intl/server';
import DeliveryDateForm from '@/components/forms/DeliveryDate';
import AccountBackButton from '../../AccountBackButton';
import setDeliveryDateAction from './action';

async function getData() {
  const me = await getStoreMe();

  return executeQuery(async (queryRunner) => {
    const dogs = await queryRunner.manager.find(Dog, {
      where: {
        user: { saleorId: me.id },
      },
      relations: {
        plan: true,
      },
    });
    return { dogs };
  });
}

export default async function PlanDeliveryDate() {
  const { dogs } = await getData();
  const t = await getTranslations();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-3 text-center font-bold text-primary">
          {t('change-{}', { value: t('delivery-date') })}
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('your-upcoming-box-is-arriving-on-the-{}', {
            date: '[15th of December 2023]',
            strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
          })}{' '}
          It contains [Charlie]&apos;s and [Muffin]’s fresh food.
        </p>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
            date: '[29th of December 2023]',
            strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
          })}
        </p>
        <div className="mt-8 text-center">
          <Button>{t('reschedule-next-box')}</Button>
        </div>
        <div className="mt-8">
          <DeliveryDateForm initialDate={new Date()} action={setDeliveryDateAction} />
        </div>
        <div className="mt-8 text-center">
          <AccountBackButton />
        </div>
      </Container>
    </main>
  );
}
