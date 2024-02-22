'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import Button from '@/components/Button';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';
import PasswordField from '@/components/controls/PasswordField';
import AppThemeProvider from '@/components/AppThemeProvider';

export default function ChangePassword() {
  const t = useTranslations();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <div className="mx-auto max-w-[520px]">
              <Headings tag="h1" styles="h2" className="text-center text-primary">
                {t('change-{}', { value: t('password') })}
              </Headings>
              <div className="py-4"></div>
              <div className="-m-2 flex flex-wrap">
                <div className="w-full p-2">
                  <PasswordField
                    name="password"
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
                    name="confirmPassword"
                    control={control}
                    rules={{ required: true }}
                    label={t('confirm-{}', { value: t('new-password') })}
                    fullWidth
                  />
                </div>
              </div>
              <div className="-mx-2 mt-10 flex">
                <div className="w-1/2 px-2">
                  <Button fullWidth onClick={reset} reverse>
                    {t('cancel')}
                  </Button>
                </div>
                <div className="w-1/2 px-2">
                  <Button fullWidth>{t('save-changes')}</Button>
                </div>
              </div>
              <div className="mt-12 text-center">
                <UnderlineButton type="button" onClick={() => router.back()} label={t('go-back')} />
              </div>
            </div>
          </Container>
        </form>
      </main>
    </AppThemeProvider>
  );
}
