'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '../buttons/Button';
import PasswordField from '../controls/PasswordField';
import TextField from '../controls/TextField';

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
      startTransition(async () => {
        try {
          await action(values);
        } catch (e) {
          e instanceof Error && toast(e.message);
        }
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
