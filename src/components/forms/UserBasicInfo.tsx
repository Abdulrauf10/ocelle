'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import TextField from '../controls/TextField';

import useDefaultValues from '@/hooks/defaultValues';

interface IUserBasicInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function UserBasicInfoForm({
  firstName,
  lastName,
  email,
  phone,
  middleAdornment,
  action,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  middleAdornment?: React.ReactNode;
  action(data: IUserBasicInfoForm): Promise<void>;
}) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues({
    firstName,
    lastName,
    email,
    phone,
  });
  const { control, reset, watch, handleSubmit } = useForm<IUserBasicInfoForm>({ defaultValues });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    (values: IUserBasicInfoForm) => {
      startTransition(async () => {
        await action(values);
        setDefaultValues(values);
      });
    },
    [action, setDefaultValues]
  );

  const isSameAsDefaultValue =
    watch('firstName') === defaultValues.firstName &&
    watch('lastName') === defaultValues.lastName &&
    watch('email') === defaultValues.email &&
    watch('phone') === defaultValues.phone;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="-m-2 flex flex-wrap">
        <div className="w-1/2 p-2">
          <TextField
            name="firstName"
            label={t('first-name')}
            control={control}
            rules={{ required: true }}
            fullWidth
          />
        </div>
        <div className="w-1/2 p-2">
          <TextField
            name="lastName"
            label={t('last-name')}
            control={control}
            rules={{ required: true }}
            fullWidth
          />
        </div>
        <div className="w-1/2 p-2">
          <TextField
            name="email"
            label={t('email')}
            control={control}
            rules={{ required: true }}
            fullWidth
          />
        </div>
        <div className="w-1/2 p-2">
          <TextField
            name="phone"
            label={t('phone-number')}
            control={control}
            rules={{ required: true }}
            fullWidth
          />
        </div>
      </div>
      {middleAdornment}
      <div className="-mx-2 mt-8 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            onClick={() => reset(defaultValues)}
            reverse
            disabled={isSameAsDefaultValue}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={pending || isSameAsDefaultValue}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
