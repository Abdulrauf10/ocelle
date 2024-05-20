'use client';

import { FormControl, MenuItem, Select } from '@mui/material';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import React from 'react';

import { DOG_SELECT_COOKIE } from '@/consts';
import { useRouter } from '@/navigation';

export default function DogSwitch({
  selectedDogId,
  dogs,
}: {
  selectedDogId: number;
  dogs: Array<{ id: number; name: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="w-[200px] max-sm:flex max-sm:w-full max-sm:items-center">
      <div className="whitespace-nowrap max-sm:mr-3 sm:mb-1">
        <span className="body-2">{t('view-info-for')}</span>
      </div>
      <FormControl fullWidth>
        <Select
          value={selectedDogId}
          onChange={(event) => {
            if (event.target.value) {
              Cookies.set(DOG_SELECT_COOKIE, String(event.target.value), { sameSite: 'strict' });
              router.refresh();
            } else {
              router.push('/get-started');
            }
          }}
          sx={{
            backgroundColor: 'white',
            '& .MuiSelect-select': {
              padding: '9px 16px',
            },
          }}
        >
          {dogs.map((dog) => {
            return (
              <MenuItem key={dog.id} value={dog.id}>
                {dog.name}
              </MenuItem>
            );
          })}
          <MenuItem className="w-full" component="button" disableRipple disableTouchRipple>
            <p className="text-secondary underline">+ {t.rich('add-another-dog')}</p>
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
