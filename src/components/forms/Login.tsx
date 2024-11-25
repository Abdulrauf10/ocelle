'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '../buttons/Button';
import OcellePasswordField from '../controls/OcellePasswordField';
import OcelleTextField from '../controls/OcelleTextField';

import { EMAIL_REGEXP } from '@/consts';

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
  action(data: ILoginForm): Promise<void | string>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = React.useTransition();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const form = useForm<ILoginForm>();
  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = React.useCallback(
    (values: ILoginForm) => {
      startTransition(async () => {
        setErrorMessage(undefined);
        const errorMessage = await action(values);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
      });
    },
    [action]
  );

  return (
    <FormProvider {...form}>
      <form className="mx-auto mt-6" onSubmit={handleSubmit(onSubmit)}>
        <OcelleTextField
          name="email"
          label={t('email')}
          rules={{
            required: true,
            pattern: { value: EMAIL_REGEXP, message: '' },
          }}
          fullWidth
        />
        <div className="py-4"></div>
        <OcellePasswordField
          name="password"
          rules={{ required: true }}
          label={t('password')}
          fullWidth
        />
        <div className="py-3"></div>
        {errorMessage && <span className="body-3 text-error">{errorMessage}</span>}
        <div className="py-3"></div>
        <Button className={className?.button} fullWidth disabled={!isValid || pending}>
          {t('log-in')}
        </Button>
      </form>
    </FormProvider>
  );
}
