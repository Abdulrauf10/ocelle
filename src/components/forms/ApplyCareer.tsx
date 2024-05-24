'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { type FieldValues, useController, useForm } from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';

import TextField from '../controls/TextField';
import Close from '../icons/Close';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import Block from '@/components/layouts/Block';
import { EMAIL_REGEXP, MAX_FILE_SIZE_MB, PHONE_REGEXP } from '@/consts';
import { InputControllerProps } from '@/types';

interface FileInputProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
  helperText?: string;
}

function FileInput<T extends FieldValues>({
  helperText,
  control,
  label,
  name,
  rules,
}: FileInputProps<T>) {
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
        accept=".rtf,.doc,.docx,.pdf,.txt"
        onChange={(e) => {
          handleChange(e);
        }}
        {...field}
      />
      {filename && !error ? (
        <>
          <div className="flex flex-row items-start">
            <div className="mt-2"></div>
            <span className="body-2 !mt-[8px] mr-2 inline-block break-all">
              {/* {label}: {filename} */}
              {filename}
            </span>
            <div className="mt-2"></div>
            <button className="mt-[8px] h-6" onClick={handleDetach}>
              <Close className="w-3" />
            </button>
          </div>
        </>
      ) : (
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
      )}

      {helperText && !(filename && !error) && (
        <div className="mt-1">
          <p className="body-4">{helperText}</p>
        </div>
      )}
      {(filename || !!error) && (
        <div className="mt-1 flex w-full items-center ">
          {error ? <span className="body-4  text-error">{error.message}</span> : <></>}
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
  const c = useTranslations('Careers');
  const b = useTranslations('Button');
  const {
    control,
    formState: { isValid, errors },
  } = useForm<IApplyCareerForm>({ mode: 'onBlur' });
  const [completed, setCompleted] = React.useState(false);

  if (completed) {
    return (
      <div className=" grow bg-gold bg-opacity-10 py-10">
        <Block
          styles="normal"
          className="flex h-full flex-col justify-center text-center text-primary"
        >
          <Container className="max-w-[700px]">
            {/* <Image
            src="/ocelle-logo.png"
            width={180}
            height={54}
            alt="ocelle logo"
            className="mx-auto"
          /> */}
            <p className="heading-4 font-bold">{t('thank-you-for-applying')}</p>
            <div className="mt-4"></div>
            <p className="body-3">{t('thank-you-for-applying:description', { title })}</p>
          </Container>
        </Block>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col">
      {startAdornment}
      <Block styles="tight" className="grow bg-gold bg-opacity-10">
        <Container className="max-w-screen-lg">
          <div className="body-1 font-bold uppercase text-primary">
            {t('submit-your-application')}
          </div>
          <div className="body-3 relative w-fit pl-[5px]">
            <span className="absolute -top-[3px] left-[-2px] text-error">*</span>
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
                  <div className="flex items-start">
                    <label htmlFor="firstName" className="body-3 !mt-1 mr-2 w-[95px] min-w-[95px]">
                      {t('first-name')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      sx={{ input: { fontSize: '14px' } }}
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
                  <div className="flex items-start">
                    <label htmlFor="lastName" className="body-3 !mt-1 mr-2 w-[95px] min-w-[95px]">
                      {t('last-name')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      sx={{ input: { fontSize: '14px' } }}
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
                  <div className="flex items-start">
                    <label htmlFor="email" className="body-3 !mt-1 mr-2 w-[95px] min-w-[95px]">
                      {t('email')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      sx={{
                        input: { fontSize: '14px' },
                      }}
                      FormHelperTextProps={{
                        id: 'email-helper-text',
                        sx: {
                          backgroundColor: '#f9f3eb !important',
                          margin: '0px',
                          padding: '3px 14px 0px 14px',
                        }, // Specific inline styling for this helper text
                      }}
                      id="email"
                      name="email"
                      className=" rounded-md bg-white"
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
                  <div className="flex items-start">
                    <label htmlFor="phone" className="body-3 !mt-1 mr-2 w-[95px] min-w-[95px]">
                      {t('phone')}
                      <span className="relative top-[-2px] text-error">*</span>
                    </label>
                    <TextField
                      sx={{
                        input: { fontSize: '14px', backgroundColor: 'white' },
                        backgroundColor: '#f9f3eb',
                      }}
                      id="phone"
                      name="phone"
                      className=" rounded-md bg-white "
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
                    <div className="mb-5 mr-2 flex h-[40px] w-[95px] min-w-[95px] items-center">
                      <label htmlFor="resume" className="body-3">
                        {c('resume-cv')}
                        <span className="relative top-[-2px] text-error">*</span>
                      </label>
                    </div>
                    <FileInput
                      control={control}
                      name="resume"
                      label={c('attach-{}', { value: c('resume-cv') })}
                      rules={{
                        required: true,
                        validate: (file) => {
                          if (!file || !(file instanceof File)) {
                            return t('please-enter-a-valid-{}', {
                              name: c('resume-cv').toLowerCase(),
                            });
                          }
                          return (
                            file.size < 1048576 * MAX_FILE_SIZE_MB ||
                            c('file-size-cannot-exceed-{}-mb', { value: MAX_FILE_SIZE_MB })
                          );
                        },
                      }}
                      helperText={c('file-types-{}', {
                        value: 'pdf, doc, docx, txt, rtf (5MB)',
                      })}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-4 py-4 max-md:w-full">
                  <div className="flex items-start">
                    <div className="mb-5 mr-2 flex h-[40px] w-[95px] min-w-[95px] items-center">
                      <label htmlFor="coverLetter" className="body-3">
                        {t('cover-letter')}
                      </label>
                    </div>
                    <FileInput
                      control={control}
                      name="coverLetter"
                      label={c('attach-{}', { value: t('cover-letter') })}
                      rules={{
                        validate: (file) => {
                          if (!file) {
                            return true;
                          }
                          if (!(file instanceof File)) {
                            return t('please-enter-a-valid-{}', {
                              name: c('resume-cv').toLowerCase(),
                            });
                          }
                          return (
                            file.size < 1048576 * MAX_FILE_SIZE_MB ||
                            c('file-size-cannot-exceed-{}-mb', { value: MAX_FILE_SIZE_MB })
                          );
                        },
                      }}
                      helperText={c('file-types-{}', {
                        value: 'pdf, doc, docx, txt, rtf (5MB)',
                      })}
                    />
                  </div>
                </div>
                <div className="w-full px-4 py-4 text-center">
                  <Button disabled={!isValid}>{b('submit-application')}</Button>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </Block>
    </div>
  );
}
