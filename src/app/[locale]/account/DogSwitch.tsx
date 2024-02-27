'use client';

import React from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/navigation';

export default function DogSwitch({ dogs }: { dogs: Array<{ id: number; name: string }> }) {
  const t = useTranslations();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-[200px] max-sm:flex max-sm:w-full max-sm:items-center">
      <div className="mb-2 whitespace-nowrap max-sm:mr-3">{t('view-info-for')}</div>
      <FormControl fullWidth>
        <Select
          defaultValue={params.has('current') ? parseInt(params.get('current')!) : dogs[0].id}
          onChange={(event) => {
            const newParams = new URLSearchParams(params.toString());
            newParams.set('current', String(event.target.value));
            router.push(`${pathname}?${newParams.toString()}`);
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
