import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import React from 'react';
import PasswordField from '../controls/PasswordField';

interface IResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm({
  action,
}: {
  action(data: Omit<IResetPasswordForm, 'confirmPassword'>): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = React.useTransition();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IResetPasswordForm>();

  const onSubmit = React.useCallback(
    (values: IResetPasswordForm) => {
      startTransition(() => {
        action(values);
      });
    },
    [action]
  );

  return (
    <form className="mx-auto mt-6" onSubmit={handleSubmit(onSubmit)}>
      <PasswordField
        name="password"
        control={control}
        rules={{ required: true }}
        label={t('new-password')}
        fullWidth
      />
      <div className="py-4"></div>
      <PasswordField
        name="confirmPassword"
        control={control}
        rules={{ required: true }}
        label={t('confirm-{}', { value: t('new-password') })}
        fullWidth
      />
      <div className="py-6"></div>
      <Button fullWidth disabled={!isValid || pending}>
        {t('set-{}', { value: t('new-password') })}
      </Button>
    </form>
  );
}
