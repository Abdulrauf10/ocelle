import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar as MuiDateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { dateCalendarClasses } from '@mui/x-date-pickers/DateCalendar/dateCalendarClasses';
import { dayPickerClasses } from '@mui/x-date-pickers/DateCalendar/dayCalendarClasses';
import { pickersDayClasses } from '@mui/x-date-pickers/PickersDay/pickersDayClasses';
import { pickersCalendarHeaderClasses } from '@mui/x-date-pickers/PickersCalendarHeader/pickersCalendarHeaderClasses';
import { ThemeProvider, createTheme, useTheme, alpha } from '@mui/material';
import {
  useController,
  type Control,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

interface DateCalendarProps {
  name: string;
  control: Control<FieldValues>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  error?: boolean;
}

export default function DateCalendar({ error, control, name, rules }: DateCalendarProps) {
  const theme = useTheme();
  const {
    field: { onChange, ...field },
  } = useController({ name, control, rules, defaultValue: null });

  return (
    <ThemeProvider
      theme={createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            main: '#F2892A',
          },
        },
      })}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDateCalendar
          {...field}
          onChange={(value) => onChange(value)}
          disableHighlightToday
          sx={{
            backgroundColor: '#5289B1',
            borderRadius: '20px',
            padding: 0.5,
            height: '326px',

            [`& .${dateCalendarClasses.viewTransitionContainer}`]: {
              backgroundColor: '#fff',
              borderRadius: 4,
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
    </ThemeProvider>
  );
}
