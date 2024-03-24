'use client';

import React from 'react';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import { type FieldValues, useForm, useController, Controller } from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';
import Container from '@/components/Container';
import Image from 'next/image';
import Block from '@/components/Block';
import AppThemeProvider from '@/components/AppThemeProvider';
import { InputControllerProps } from '@/types';

interface FileInputProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
}

function FileInput<T extends FieldValues>({
  control,
  label,
  name,
  rules,
  error,
}: FileInputProps<T>) {
  const {
    field: { ref, onChange, value, ...field },
  } = useController({ control, name, rules });
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
      <Button
        className="!text-base"
        type="button"
        reverse
        fullWidth
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
      {filename && (
        <span className="body-4 mt-1 inline-block">
          {label}: {filename}
        </span>
      )}
    </div>
  );
}

interface IApplyCareerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File;
  coverLetter?: File;
}

export default function ApplyCareerForm({
  title,
  startAdornment,
  action,
}: {
  title: string;
  startAdornment?: React.ReactNode;
  action(formData: FormData): Promise<void>;
}) {
  const {
    control,
    formState: { isValid },
  } = useForm<IApplyCareerForm>();
  const [completed, setCompleted] = React.useState(false);

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
          <p className="heading-4 mt-8 font-bold">Thank You For Applying!</p>
          <p className="body-3 mt-4">
            Your application for the {title} role has been successfully submitted. We’re excited to
            learn more about you and will be in touch if you move forward in the process.
          </p>
        </Container>
      </Block>
    );
  }

  return (
    <AppThemeProvider>
      {startAdornment}
      <Block styles="tight" className="bg-gold bg-opacity-10">
        <Container className="max-w-screen-lg">
          <div className="body-1 font-bold uppercase text-primary">Submit Your Application</div>
          <div className="body-3">
            <span className="text-error">*</span> Required
          </div>
          <div className="mt-6">
            <form
              action={async (data) => {
                try {
                  await action(data);
                  setCompleted(true);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <div className="-mx-4 -my-4 flex flex-wrap">
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="firstName" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      First Name<span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <Controller
                      name="firstName"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          className="rounded-md bg-white"
                          id="firstName"
                          fullWidth
                          {...field}
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="lastName" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      Last Name<span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <Controller
                      name="lastName"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          className="rounded-md bg-white"
                          id="lastName"
                          fullWidth
                          {...field}
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="email" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      Email<span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <Controller
                      name="email"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          className="rounded-md bg-white"
                          id="email"
                          fullWidth
                          {...field}
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="phone" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      Phone<span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <Controller
                      name="phone"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          className="rounded-md bg-white"
                          size="small"
                          id="phone"
                          fullWidth
                          {...field}
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-start">
                    <div className="body-3 mb-5 mr-2 flex h-[40px] w-[95px] min-w-[95px] items-center">
                      <label htmlFor="resume">
                        Resume/CV<span className="relative top-[-2px] text-error">*</span>
                      </label>
                    </div>
                    <FileInput
                      control={control}
                      name="resume"
                      label="Attach Resume/CV"
                      rules={{ required: true }}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-start">
                    <div className="body-3 mb-5 mr-2 flex h-[40px] w-[95px] min-w-[95px] items-center">
                      <label htmlFor="coverLetter">Cover Letter</label>
                    </div>
                    <FileInput control={control} name="coverLetter" label="Cover Letter" />
                  </div>
                </div>
                <div className="w-full px-4 py-4 text-center">
                  <Button disabled={!isValid}>Submit Application</Button>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </Block>
    </AppThemeProvider>
  );
}
