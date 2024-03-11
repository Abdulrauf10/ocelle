'use client';

import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import Button from '../Button';
import React from 'react';

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
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <TextField error={!!error} label={t('email')} fullWidth {...field} />
        )}
      />
      <div className="py-6"></div>
      <Button className={className?.button} fullWidth disabled={!isValid || pending}>
        {t('submit')}
      </Button>
    </form>
  );
}
