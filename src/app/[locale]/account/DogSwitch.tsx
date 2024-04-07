'use client';

import React from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import Cookies from 'js-cookie';
import { DOG_SELECT_COOKIE } from '@/consts';

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
      <div className="mb-2 whitespace-nowrap max-sm:mr-3">{t('view-info-for')}</div>
      <FormControl fullWidth>
        <Select
          value={selectedDogId}
          onChange={(event) => {
            Cookies.set(DOG_SELECT_COOKIE, String(event.target.value), { sameSite: 'strict' });
            router.refresh();
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
        </Select>
      </FormControl>
    </div>
  );
}
