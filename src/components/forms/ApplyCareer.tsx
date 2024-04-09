'use client';

import React from 'react';
import Button from '@/components/buttons/Button';
import { type FieldValues, useForm, useController } from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';
import Container from '@/components/Container';
import Image from 'next/image';
import Block from '@/components/layouts/Block';
import { InputControllerProps } from '@/types';
import TextField from '../controls/TextField';
import { useTranslations } from 'next-intl';
import { EMAIL_REGEXP, MAX_FILE_SIZE_MB, PHONE_REGEXP } from '@/consts';
import Close from '../icons/Close';

interface FileInputProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
}

function FileInput<T extends FieldValues>({ control, label, name, rules }: FileInputProps<T>) {
  const {
    field: { ref, onChange, value, ...field },
    fieldState: { error },
  } = useController({ control, name, rules });
  const inputRef = React.useRef<HTMLInputElement>();
  const focusRef = React.useRef<HTMLDivElement | null>(null);
  const [filename, setFilename] = React.useState<string | undefined>(undefined);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length != 0) {
        setFilename(e.target.files![0].name);
        onChange(e.target.files![0]);
      } else {
        setFilename(undefined);
        onChange(undefined);
      }
    },
    [setFilename, onChange]
  );

  const handleDetach = React.useCallback(() => {
    setFilename(undefined);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [setFilename, onChange]);

  return (
    <div className="w-full">
      <div ref={focusRef} tabIndex={0}></div>
      <input
        id={name}
        ref={mergeRefs([inputRef, ref])}
        type="file"
        className="hidden"
        accept="application/pdf"
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
        onClick={() => {
          inputRef.current?.click();
          focusRef.current?.focus();
        }}
        onTouchEnd={() => focusRef.current?.focus()}
      >
        {label}
      </Button>
      {(filename || !!error) && (
        <div className="mt-1 flex w-full items-center">
          {error ? (
            <span className="body-4 text-error">{error.message}</span>
          ) : (
            <>
              <span className="body-4 mr-2 inline-block break-all">
                {label}: {filename}
              </span>
              <button onClick={handleDetach}>
                <Close className="w-3" />
              </button>
            </>
          )}
        </div>
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
  const t = useTranslations();
  const {
    watch,
    control,
    formState: { isValid, errors },
  } = useForm<IApplyCareerForm>({ mode: 'all' });
  const [completed, setCompleted] = React.useState(false);

  if (completed) {
    return (
      <Block styles="tight" className="bg-gold bg-opacity-10 text-center text-primary">
        <Container className="max-w-screen-lg">
          {/* <Image
            src="/ocelle-logo.png"
            width={180}
            height={54}
            alt="ocelle logo"
            className="mx-auto"
          /> */}
          <p className="heading-4 mt-8 font-bold">{t('thank-you-for-applying')}</p>
          <p className="body-3 mt-4">{t('thank-you-for-applying:description', { title })}</p>
        </Container>
      </Block>
    );
  }

  return (
    <>
      {startAdornment}
      <Block styles="tight" className="bg-gold bg-opacity-10">
        <Container className="max-w-screen-lg">
          <div className="body-1 font-bold uppercase text-primary">
            {t('submit-your-application')}
          </div>
          <div className="body-3">
            <span className="text-error">*</span>
            {t('required')}
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
                      {t('first-name')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      id="firstName"
                      name="firstName"
                      className="rounded-md bg-white"
                      control={control}
                      rules={{ required: true }}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="lastName" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      {t('last-name')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      id="lastName"
                      name="lastName"
                      className="rounded-md bg-white"
                      control={control}
                      rules={{ required: true }}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="email" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      {t('email')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      id="email"
                      name="email"
                      className="rounded-md bg-white"
                      control={control}
                      rules={{
                        required: true,
                        pattern: {
                          value: EMAIL_REGEXP,
                          message: t('please-enter-a-valid-{}', {
                            name: t('email').toLowerCase(),
                          }),
                        },
                      }}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-center">
                    <label htmlFor="phone" className="body-3 mr-2 w-[95px] min-w-[95px]">
                      {t('phone')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      id="phone"
                      name="phone"
                      className="rounded-md bg-white"
                      control={control}
                      rules={{
                        required: true,
                        pattern: {
                          value: PHONE_REGEXP,
                          message: t('please-enter-a-valid-{}', {
                            name: t('phone').toLowerCase(),
                          }),
                        },
                      }}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-start">
                    <div className="body-3 mb-5 mr-2 flex h-[40px] w-[95px] min-w-[95px] items-center">
                      <label htmlFor="resume">
                        {t('resume-cv')}
                        <span className="relative top-[-2px] text-error">*</span>
                      </label>
                    </div>
                    <FileInput
                      control={control}
                      name="resume"
                      label={
                        watch('resume') ? t('attached') : t('attach-{}', { value: t('resume-cv') })
                      }
                      rules={{
                        required: true,
                        validate: (file) => {
                          if (!file || !(file instanceof File)) {
                            return t('please-enter-a-valid-{}', {
                              name: t('resume-cv').toLowerCase(),
                            });
                          }
                          return (
                            file.size < 1048576 * MAX_FILE_SIZE_MB ||
                            t('file-size-cannot-exceed-{}-mb', { value: MAX_FILE_SIZE_MB })
                          );
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-start">
                    <div className="body-3 mb-5 mr-2 flex h-[40px] w-[95px] min-w-[95px] items-center">
                      <label htmlFor="coverLetter">{t('cover-letter')}</label>
                    </div>
                    <FileInput
                      control={control}
                      name="coverLetter"
                      label={
                        watch('coverLetter')
                          ? t('attached')
                          : t('attach-{}', { value: t('cover-letter') })
                      }
                      rules={{
                        validate: (file) => {
                          if (!file) {
                            return true;
                          }
                          if (!(file instanceof File)) {
                            return t('please-enter-a-valid-{}', {
                              name: t('resume-cv').toLowerCase(),
                            });
                          }
                          return (
                            file.size < 1048576 * MAX_FILE_SIZE_MB ||
                            t('file-size-cannot-exceed-{}-mb', { value: MAX_FILE_SIZE_MB })
                          );
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="w-full px-4 py-4 text-center">
                  <Button disabled={!isValid}>{t('submit-application')}</Button>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </Block>
    </>
  );
}
