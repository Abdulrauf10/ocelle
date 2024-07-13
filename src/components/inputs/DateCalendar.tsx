import { alpha } from '@mui/material';
import { DateView } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import {
  DateCalendar as MuiDateCalendar,
  DateCalendarProps as MuiDateCalendarProps,
} from '@mui/x-date-pickers/DateCalendar';
import { dateCalendarClasses } from '@mui/x-date-pickers/DateCalendar/dateCalendarClasses';
import { dayPickerClasses } from '@mui/x-date-pickers/DateCalendar/dayCalendarClasses';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { pickersCalendarHeaderClasses } from '@mui/x-date-pickers/PickersCalendarHeader/pickersCalendarHeaderClasses';
import { pickersDayClasses } from '@mui/x-date-pickers/PickersDay/pickersDayClasses';
import { yearCalendarClasses } from '@mui/x-date-pickers/YearCalendar/yearCalendarClasses';
import clsx from 'clsx';
import { zhHK } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import React from 'react';

import AppThemeProvider from '../AppThemeProvider';
import DogFoot from '../icons/DogFoot';

export interface DateCalendarProps {
  defaultValue?: Date | null;
  value?: Date | null;
  error?: boolean;
  disableHighlightToday?: boolean;
  shouldDisableYear?(year: Date): boolean;
  shouldDisableDate?(day: Date): boolean;
  view?: readonly DateView[];
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  actions?: Array<{ label: string; disabled?: boolean; onClick(): void }>;
  onChange?: MuiDateCalendarProps<any>['onChange'];
}

export default React.forwardRef<HTMLDivElement, DateCalendarProps>(function DateCalendar(
  {
    error,
    disabled,
    defaultValue,
    value,
    disableHighlightToday,
    shouldDisableYear,
    shouldDisableDate,
    view,
    minDate,
    maxDate,
    actions,
    onChange,
  }: DateCalendarProps,
  ref
) {
  const locale = useLocale();

  return (
    <AppThemeProvider
      theme={{
        palette: {
          primary: {
            main: '#F2892A',
          },
        },
      }}
    >
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={locale === 'zh' ? zhHK : undefined}
      >
        <MuiDateCalendar
          ref={ref}
          disabled={disabled}
          defaultValue={defaultValue}
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
          disableHighlightToday={disableHighlightToday}
          views={view}
          shouldDisableYear={shouldDisableYear}
          shouldDisableDate={shouldDisableDate}
          sx={{
            backgroundColor: '#5289B1',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: 0.5,
            paddingBottom: 0,
            height: '302px',
            [`& .${yearCalendarClasses.root}`]: {
              height: '260px',
            },
            [`& .${dateCalendarClasses.viewTransitionContainer}`]: {
              backgroundColor: '#fff',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            },
            [`& .${dayPickerClasses.weekContainer}`]: {
              margin: 0,
            },
            [`& .${dayPickerClasses.weekDayLabel}`]: {
              fontWeight: 'bold',
              color: '#5289B1',
            },
          }}
          slotProps={{
            calendarHeader: {
              sx: {
                position: 'relative',
                color: '#fff',
                pl: 1.5,
                my: 0.5,
                mx: -1.5,
                '&:before': {
                  content: '""',
                  display: 'inline-block',
                  width: 40,
                  height: 40,
                },
                [`& .${pickersCalendarHeaderClasses.labelContainer}`]: {
                  position: 'relative',
                  left: 8,
                  fontFamily: (theme) => theme.typography.fontFamily,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                },
                '& .MuiPickersArrowSwitcher-spacer': {
                  maxWidth: 12,
                },
              },
            },
            switchViewButton: {
              sx: {
                marginLeft: -1,
                color: '#fff',
              },
            },
            previousIconButton: {
              sx: {
                position: 'absolute',
                color: '#fff',
                left: 12,
              },
            },
            nextIconButton: {
              sx: {
                color: '#fff',
              },
            },
            day: {
              sx: {
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 'bold',
                fontSize: '14px',
                color: error ? '#f00' : undefined,
                [`&.${pickersDayClasses.dayWithMargin}:hover`]: {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.15),
                },
                [`&.${pickersDayClasses.selected}`]: {
                  color: '#fff',
                },
                [`&.${pickersDayClasses.selected}:hover, &.${pickersDayClasses.selected}:focus`]: {
                  backgroundColor: (theme) => theme.palette.primary.main,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
      <div className="mx-auto max-w-[320px] rounded-bl-[20px] rounded-br-[20px] border-b-4 border-l-4 border-r-4 border-primary bg-white px-5 pb-3">
        {actions && (
          <div className="-mx-1 flex pt-2">
            {actions.map((action, idx) => {
              return (
                <div key={idx} className="flex-1 px-1">
                  <button
                    className={clsx(
                      'inline-flex w-full select-none items-center justify-center rounded-[30px] px-4 py-1 text-white',
                      action.disabled
                        ? 'pointer-events-none bg-gray bg-opacity-50'
                        : 'cursor-pointer bg-secondary transition-all duration-300 ease-in-out hover:opacity-85'
                    )}
                    type="button"
                    onClick={action.onClick}
                  >
                    <span className="whitespace-nowrap text-center text-sm font-bold">
                      {action.label}
                    </span>
                    <DogFoot className="ml-2 w-4 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppThemeProvider>
  );
});
