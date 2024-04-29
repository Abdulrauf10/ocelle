'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import TextField from '../controls/TextField';

interface IForgetPasswordForm {
  email: string;
}

export default function ForgetPasswordForm({
  className,
  action,
}: {
  className?: {
    button?: string;
  };
  action(data: IForgetPasswordForm): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = React.useTransition();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IForgetPasswordForm>();

  const onSubmit = React.useCallback(
    (values: IForgetPasswordForm) => {
      startTransition(() => {
        action(values);
      });
    },
    [action]
  );

  return (
    <form className="mx-auto mt-6" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="email"
        label={t('email')}
        control={control}
        rules={{ required: true }}
        fullWidth
      />
      <div className="py-6"></div>
      <Button className={className?.button} fullWidth disabled={!isValid || pending}>
        {t('submit')}
      </Button>
    </form>
  );
}
