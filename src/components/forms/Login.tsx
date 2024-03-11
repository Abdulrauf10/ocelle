'use client';

import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import PasswordField from '../controls/PasswordField';
import { TextField } from '@mui/material';
import Button from '../Button';
import React from 'react';

interface ILoginForm {
  email: string;
  password: string;
}

export default function LoginForm({
  className,
  action,
}: {
  className?: {
    button?: string;
  };
  action(data: ILoginForm): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = React.useTransition();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ILoginForm>();

  const onSubmit = React.useCallback(
    (values: ILoginForm) => {
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
      <div className="py-4"></div>
      <PasswordField
        name="password"
        control={control}
        rules={{ required: true }}
        label={t('password')}
        fullWidth
      />
      <div className="py-6"></div>
      <Button className={className?.button} fullWidth disabled={!isValid || pending}>
        {t('log-in')}
      </Button>
    </form>
  );
}
