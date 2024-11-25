'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import PasswordField from '../controls/PasswordField';

interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePasswordForm({
  action,
}: {
  action(data: Omit<IChangePasswordForm, 'confirmNewPassword'>): Promise<void>;
}) {
  const t = useTranslations();
  const form = useForm<IChangePasswordForm>();
  const { reset, handleSubmit, watch, getValues } = form;
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    ({ currentPassword, newPassword }: IChangePasswordForm) => {
      startTransition(() => {
        action({ currentPassword, newPassword });
      });
    },
    [action]
  );

  const empty = Object.values(watch()).some((value) => value == null || value === '');

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="-m-2 flex flex-wrap">
          <div className="w-full p-2">
            <PasswordField
              name="currentPassword"
              rules={{ required: true }}
              label={t('current-{}', { value: t('password') })}
              fullWidth
            />
          </div>
          <div className="w-1/2 p-2">
            <PasswordField
              name="newPassword"
              rules={{ required: true }}
              label={t('new-password')}
              fullWidth
            />
          </div>
          <div className="w-1/2 p-2">
            <PasswordField
              name="confirmNewPassword"
              rules={{
                required: true,
                validate: (value) => {
                  return (
                    getValues().newPassword === value || 'password should be same with new password'
                  );
                },
              }}
              label={t('confirm-{}', { value: t('new-password') })}
              fullWidth
            />
          </div>
        </div>
        <div className="-mx-2 mt-10 flex">
          <div className="w-1/2 px-2">
            <Button fullWidth onClick={() => reset()} reverse disabled={empty}>
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button fullWidth disabled={pending || empty}>
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
