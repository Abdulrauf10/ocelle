'use client';

import { MenuItem } from '@mui/material';
import equal from 'deep-equal';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import Select from '../controls/Select';
import TextField from '../controls/TextField';

import { PHONE_REGEXP } from '@/consts';
import { getCountryCodes } from '@/helpers/string';
import useDefaultValues from '@/hooks/defaultValues';

interface IUserBasicInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp: { code: string; value: string };
}

export default function UserBasicInfoForm({
  firstName,
  lastName,
  email,
  phone,
  whatsapp,
  middleAdornment,
  action,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp?: { code: string; value: string };
  middleAdornment?: React.ReactNode;
  action(data: IUserBasicInfoForm): Promise<void>;
}) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues<{
    firstName: string;
    lastName: string;
    email: string;
    phone: { code: string; value: string };
    whatsapp: { code: string; value: string };
  }>({
    firstName,
    lastName,
    email,
    phone,
    whatsapp: whatsapp ?? { code: '852', value: '' },
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
    equal(watch('phone'), defaultValues.phone) &&
    equal(watch('whatsapp'), defaultValues.whatsapp);

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
            name="phone.value"
            label={t('phone-number')}
            control={control}
            rules={{
              required: true,
              pattern: {
                value: PHONE_REGEXP,
                message: t('this-{}-doesn-t-look-correct-please-update-it', {
                  name: t('phone-number').toLowerCase(),
                }),
              },
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <div className="w-auto">
                  <Select
                    variant="standard"
                    name="phone.code"
                    control={control}
                    rules={{ required: true }}
                    disableUnderline
                  >
                    {getCountryCodes().map((code, idx) => (
                      <MenuItem key={idx} value={code}>
                        +{code}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              ),
            }}
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
