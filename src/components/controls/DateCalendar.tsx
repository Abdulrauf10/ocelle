import { DateView } from '@mui/x-date-pickers';
import { type FieldValues, type Path, type PathValue, useController } from 'react-hook-form';

import DateCalendarInput, {
  DateCalendarProps as DateCalendarInputProps,
} from '../inputs/DateCalendar';

import { InputControllerProps } from '@/types';

interface DateCalendarProps<T extends FieldValues> extends InputControllerProps<T> {
  defaultValue?: PathValue<T, Path<T>>;
  shouldDisableDate?(day: Date): boolean;
  shouldDisableYear?(year: Date): boolean;
  onChange?: DateCalendarInputProps['onChange'];
  view?: readonly DateView[];
  minDate?: Date;
  maxDate?: Date;
  actions?: Array<{ label: string; disabled?: boolean; onClick(): void }>;
}

export default function DateCalendar<T extends FieldValues>({
  error,
  control,
  name,
  rules,
  defaultValue,
  shouldDisableDate,
  shouldDisableYear,
  onChange,
  view,
  minDate,
  maxDate,
  actions,
}: DateCalendarProps<T>) {
  const {
    field: { onChange: _onChange, value, ...field },
  } = useController({ name, control, rules, defaultValue });

  return (
    <DateCalendarInput
      {...field}
      error={error}
      value={value ?? null}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(...args) => {
        _onChange(args[0]);
        if (typeof onChange === 'function') onChange(...args);
      }}
      view={view}
      disableHighlightToday
      shouldDisableYear={shouldDisableYear}
      shouldDisableDate={shouldDisableDate}
      actions={actions}
    />
  );
}
