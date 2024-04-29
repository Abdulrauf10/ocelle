'use client';

import { Switch, ThemeProvider, createTheme } from '@mui/material';
import cloneDeep from 'clone-deep';
import equal from 'deep-equal';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '../buttons/Button';

import useDefaultValues from '@/hooks/defaultValues';
import { DogPlanDto } from '@/types/dto';

export default function DogPlanForm({
  initialPlans,
  action,
}: {
  initialPlans: DogPlanDto[];
  action(data: { plans: DogPlanDto[] }): Promise<void>;
}) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues({ plans: initialPlans });
  const [pending, startTransition] = React.useTransition();
  const [plans, setPlans] = React.useState<DogPlanDto[]>(defaultValues.plans);

  React.useEffect(() => {
    setPlans(initialPlans);
    setDefaultValues({ plans: initialPlans });
  }, [initialPlans, setDefaultValues]);

  const onSubmit = React.useCallback(() => {
    startTransition(async () => {
      await action({ plans });
      setDefaultValues({ plans });
    });
  }, [action, setDefaultValues, plans]);

  const getOnClickHandler = React.useCallback((idx: number) => {
    return () => {
      setPlans((plans) => {
        const _plans = cloneDeep(plans);
        _plans[idx].enabled = !plans[idx].enabled;
        return _plans;
      });
    };
  }, []);

  const isSameAsDefaultValue = equal(plans, defaultValues.plans);

  return (
    <ThemeProvider
      theme={createTheme({
        components: {
          MuiSwitch: {
            styleOverrides: {
              root: {
                width: 160,
                height: 40,
                paddingTop: 4,
                paddingBottom: 4,
              },
              switchBase: {
                top: 0,
                left: 8,
                '&.Mui-checked': {
                  transform: 'translateX(103px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#5289B1',
                    '&:before': {
                      display: 'block',
                    },
                    '&:after': {
                      display: 'none',
                    },
                  },
                },
              },
              thumb: {
                width: 22,
                height: 22,
              },
              track: {
                opacity: 1,
                borderRadius: 30,
                backgroundColor: '#CDCAC2',
                color: '#fff',
                textAlign: 'center',
                '&:before': {
                  content: `"${t('plan-{}', { status: t('active') })}"`,
                  position: 'relative',
                  top: 4,
                  right: 5,
                  display: 'none',
                },
                '&:after': {
                  content: `"${t('plan-{}', { status: t('inactive') })}"`,
                  position: 'relative',
                  top: 4,
                  left: 8,
                },
              },
            },
          },
        },
      })}
    >
      {plans.map((plan, idx) => {
        return (
          <div key={plan.id} className="mt-4 flex items-center">
            <div className="w-1/2 px-2">{plan.name}</div>
            <div className="w-1/2 px-2 text-left">
              <Switch checked={plan.enabled} onClick={getOnClickHandler(idx)} />
            </div>
          </div>
        );
      })}
      <div className="mx-auto mt-6 max-w-[460px]">
        <div className="-m-2 flex flex-wrap">
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[240px]"
              fullWidth
              onClick={() => setPlans(defaultValues.plans)}
              reverse
              disabled={isSameAsDefaultValue}
            >
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[240px]"
              fullWidth
              disabled={pending || isSameAsDefaultValue}
              onClick={onSubmit}
            >
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
