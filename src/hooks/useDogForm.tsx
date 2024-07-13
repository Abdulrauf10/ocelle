import React from 'react';
import { FieldValues, UseFormProps, useForm } from 'react-hook-form';

export default function useDogForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props: UseFormProps<TFieldValues, TContext>) {
  const form = useForm<TFieldValues, TContext, TTransformedValues>(props);

  const [isShowButton, setIsShowButton] = React.useState(false);

  React.useEffect(() => {
    if (form.control._names.mount.size > 0 && form.formState.isValid) {
      setIsShowButton(true);
    }
  }, [form.control._names.mount.size, form.formState.isValid]);

  return { form, isShowButton };
}
