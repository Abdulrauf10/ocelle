'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import PasswordField from '../controls/PasswordField';
import Button from '../Button';

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
  const { control, reset, handleSubmit } = useForm<IChangePasswordForm>();
  const [pending, startTransition] = useTransition();

  const onSubmit = React.useCallback(
    ({ currentPassword, newPassword }: IChangePasswordForm) => {
      startTransition(() => {
        action({ currentPassword, newPassword });
      });
    },
    [action]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="-m-2 flex flex-wrap">
        <div className="w-full p-2">
          <PasswordField
            name="currentPassword"
            control={control}
            rules={{ required: true }}
            label={t('current-{}', { value: t('password') })}
            fullWidth
          />
        </div>
        <div className="w-1/2 p-2">
          <PasswordField
            name="newPassword"
            control={control}
            rules={{ required: true }}
            label={t('new-password')}
            fullWidth
          />
        </div>
        <div className="w-1/2 p-2">
          <PasswordField
            name="confirmNewPassword"
            control={control}
            rules={{ required: true }}
            label={t('confirm-{}', { value: t('new-password') })}
            fullWidth
          />
        </div>
      </div>
      <div className="-mx-2 mt-10 flex">
        <div className="w-1/2 px-2">
          <Button fullWidth onClick={() => reset()} reverse>
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={pending}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
