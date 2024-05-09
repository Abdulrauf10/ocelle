import { getTranslations } from 'next-intl/server';

import updateSubscriptionAction from './action';

import { getLoginedMe } from '@/actions';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DogPlanForm from '@/components/forms/DogPlan';

export default async function Subscriptions() {
  const t = await getTranslations();
  const { dogs } = await getLoginedMe();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">{t('your-subscriptions')}</h1>
        <div className="mx-auto mt-4 max-w-[580px] rounded-3xl border border-gray bg-white p-6 text-center shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
          <div className="text-xl font-bold text-gold">{t('reactivate-or-suspend-a-plan')}</div>
          <DogPlanForm
            initialPlans={dogs.map((dog) => {
              return {
                id: dog.plan.id,
                name: dog.name,
                enabled: dog.plan.isEnabled,
              };
            })}
            action={updateSubscriptionAction}
          />
        </div>
        <div className="mt-6 text-center">
          <UnderlineButton
            theme="primary"
            label={t('pause-all-deliveries')}
            href="/account/pause-delivery"
          />
          <br />
          <UnderlineButton
            theme="primary"
            label={t('cancel-my-ocelle-subscriptions')}
            href="/account/subscription/cancel"
          />
        </div>
        <div className="mt-6 text-center">
          <UnderlineBackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
