'use client';

import React from 'react';
import theme from '@/app/mui-theme';
import Button from '@/components/Button';
import { TextField, ThemeProvider } from '@mui/material';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useForm,
  useController,
  Controller,
} from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';
import { serialize } from 'object-to-formdata';
import Container from '@/components/Container';
import Image from 'next/image';
import Block from '@/components/Block';

interface FileInputProps {
  control: Control<FieldValues>;
  label: string;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  error?: boolean;
}

function FileInput({ control, label, name, rules, error }: FileInputProps) {
  const {
    field: { ref, onChange, value, ...field },
  } = useController({ control, name, rules, defaultValue: '' });
  const inputRef = React.useRef<HTMLInputElement>();
  const [filename, setFilename] = React.useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length != 0) {
      setFilename(e.target.files![0].name);
      onChange(e.target.files![0]);
    } else {
      setFilename(undefined);
      onChange(undefined);
    }
  };

  return (
    <div className="w-full">
      <input
        id={name}
        ref={mergeRefs([inputRef, ref])}
        type="file"
        className="hidden"
        onChange={(e) => {
          handleChange(e);
        }}
        {...field}
      />
      <Button type="button" reverse fullWidth onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
      {filename && (
        <span className="mt-1 inline-block text-sm">
          {label}: {filename}
        </span>
      )}
    </div>
  );
}

interface ApplyFormProps {
  id: number;
  title: string;
}

export default function ApplyForm({
  id,
  title,
  children,
}: React.PropsWithChildren<ApplyFormProps>) {
  const { control, handleSubmit } = useForm();
  const [completed, setCompleted] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values: object) => {
      const formdata = serialize({ id, ...values });
      const res = await fetch('/api/career', { body: formdata, method: 'POST' });
      if (res.ok) {
        setCompleted(true);
      }
    },
    [id]
  );

  if (completed) {
    return (
      <Block styles="tight" className="bg-gold bg-opacity-10 text-center text-primary">
        <Container className="max-w-screen-lg">
          <Image
            src="/ocelle-logo.png"
            width={180}
            height={54}
            alt="ocelle logo"
            className="mx-auto"
          />
          <p className="mt-8 text-2xl font-bold">Thank You For Applying!</p>
          <p className="mt-4">
            Your application for the {title} role has been successfully submitted. We’re excited to
            learn more about you and will be in touch if you move forward in the process.
          </p>
        </Container>
      </Block>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {children}
      <Block styles="tight" className="bg-gold bg-opacity-10">
        <Container className="max-w-screen-lg">
          <div className="text-2xl font-bold uppercase text-primary">Submit Your Application</div>
          <div>
            <span className="text-error">*</span> Required
          </div>
          <div className="mt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="-mx-4 -my-4 flex flex-wrap">
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="firstName" className="mr-2 w-[95px] min-w-[95px]">
                      First Name<span className="text-error">*</span>
                    </label>
                    <Controller
                      name="firstName"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField id="firstName" fullWidth {...field} error={!!error} />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="lastName" className="mr-2 w-[95px] min-w-[95px]">
                      Last Name<span className="text-error">*</span>
                    </label>
                    <Controller
                      name="lastName"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField id="lastName" fullWidth {...field} error={!!error} />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="email" className="mr-2 w-[95px] min-w-[95px]">
                      Email<span className="text-error">*</span>
                    </label>
                    <Controller
                      name="email"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField id="email" fullWidth {...field} error={!!error} />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="phone" className="mr-2 w-[95px] min-w-[95px]">
                      Phone<span className="text-error">*</span>
                    </label>
                    <Controller
                      name="phone"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField id="phone" fullWidth {...field} error={!!error} />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="resume" className="mr-2 w-[95px] min-w-[95px]">
                      Resume/CV<span className="text-error">*</span>
                    </label>
                    <FileInput
                      control={control}
                      name="resume"
                      label="Attach Resume/CV"
                      rules={{ required: true }}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="coverLetter" className="mr-2 w-[95px] min-w-[95px]">
                      Cover Letter
                    </label>
                    <FileInput control={control} name="coverLetter" label="Cover Letter" />
                  </div>
                </div>
                <div className="w-full px-4 py-4 text-center">
                  <Button>Submit Application</Button>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </Block>
    </ThemeProvider>
  );
}
