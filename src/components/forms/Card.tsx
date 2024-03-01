'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import { serialize } from 'object-to-formdata';
import PartialCardForm, { IPartialCardForm } from './partial/Card';
import Button from '../Button';

interface ICardForm extends IPartialCardForm {}

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
  action(formData: FormData): Promise<void>;
}) {
  const t = useTranslations();
  const ref = React.useRef<HTMLFormElement | null>(null);
  const { control, handleSubmit, reset, watch } = useForm<ICardForm>({
    defaultValues: {
      cardName: name,
      cardNo,
      cardExp,
      cardCvc: cvc,
    },
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = React.useCallback(
    (values: ICardForm) => {
      startTransition(() => {
        action(serialize(values));
      });
    },
    [action]
  );

  const isSameAsDefaultValue =
    watch('cardName') === name &&
    watch('cardNo') === cardNo &&
    watch('cardExp') === cardExp &&
    watch('cardCvc') === cvc;

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <PartialCardForm control={control} />
      <div className="-mx-2 mt-8 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            onClick={() => reset({ cardName: name, cardNo, cardExp, cardCvc: cvc })}
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
