'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import PasswordField from '../controls/PasswordField';

interface IResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm({
  className,
  action,
}: {
  className?: {
    button?: string;
  };
  action(data: Omit<IResetPasswordForm, 'confirmPassword'>): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = React.useTransition();
  const form = useForm<IResetPasswordForm>();
  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = React.useCallback(
    (values: IResetPasswordForm) => {
      startTransition(() => {
        action(values);
      });
    },
    [action]
  );

  return (
    <FormProvider {...form}>
      <form className="mx-auto mt-6" onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          name="password"
          rules={{ required: true }}
          label={t('new-password')}
          fullWidth
        />
        <div className="py-4"></div>
        <PasswordField
          name="confirmPassword"
          rules={{ required: true }}
          label={t('confirm-{}', { value: t('new-password') })}
          fullWidth
        />
        <div className="py-6"></div>
        <Button className={className?.button} fullWidth disabled={!isValid || pending}>
          {t('set-{}', { value: t('new-password') })}
        </Button>
      </form>
    </FormProvider>
  );
}
