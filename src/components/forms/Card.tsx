'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React from 'react';
import PartialCardForm, { IPartialCardStripeForm } from './partial/CardStripe';
import Button from '../Button';

interface ICardForm extends IPartialCardStripeForm {}

export default function CardForm({
  name,
  cardNo,
  cardExp,
  cvc,
  action,
}: {
  name: string;
  cardNo: string;
  cardExp: string;
  cvc: string;
  action(data: ICardForm): Promise<void>;
}) {
  const t = useTranslations();
  const ref = React.useRef<HTMLFormElement | null>(null);
  const { control, handleSubmit, reset, watch } = useForm<ICardForm>({
    defaultValues: {
      cardNo,
      cardExp,
      cardCvc: cvc,
    },
  });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    (values: ICardForm) => {
      startTransition(() => {
        action(values);
      });
    },
    [action]
  );

  const isSameAsDefaultValue =
    watch('cardNo') === cardNo && watch('cardExp') === cardExp && watch('cardCvc') === cvc;

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <PartialCardForm />
      <div className="-mx-2 mt-8 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            onClick={() => reset({ cardNo, cardExp, cardCvc: cvc })}
            reverse
            disabled={isSameAsDefaultValue}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={pending || isSameAsDefaultValue}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
