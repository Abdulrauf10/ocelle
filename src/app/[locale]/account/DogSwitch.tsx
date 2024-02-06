import React from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function DogSwitch() {
  const t = useTranslations();
  const handleChange = React.useCallback(() => {}, []);

  return (
    <div className="w-[200px] max-sm:flex max-sm:w-full max-sm:items-center">
      <div className="mb-2 whitespace-nowrap max-sm:mr-3">{t('view-info-for')}</div>
      <FormControl fullWidth>
        <Select
          defaultValue={10}
          onChange={handleChange}
          sx={{
            backgroundColor: 'white',
            '& .MuiSelect-select': {
              padding: '9px 16px',
            },
          }}
        >
          <MenuItem value={10}>Charile</MenuItem>
          <MenuItem value={20}>Muffin</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
