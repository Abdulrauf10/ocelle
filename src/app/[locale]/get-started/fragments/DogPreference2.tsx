import React from 'react';
import { useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import Image from 'next/image';
import PictureRadio from '@/components/controls/PictureRadio';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';

export default function DogPreference2Fragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useForm();
  const options = React.useMemo(() => {
    return [
      { label: t('none'), value: 'none' },
      { label: t('chicken'), value: 'chicken' },
      { label: t('beef'), value: 'beef' },
      { label: t('pork'), value: 'pork' },
      { label: t('lamb'), value: 'lamb' },
      { label: t('duck'), value: 'duck' },
    ];
  }, [t]);

  const onSubmit = React.useCallback(() => {
    navigate(Stage.Owner);
  }, [navigate]);

  const name = 'Charlie';

  return (
    <Container className="text-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t.rich('does-{}-have-any-food-allergies-or-sensitivities', {
            name,
            br: () => <br className="max-md:hidden" />,
          })}
        >
          <div className="mx-auto -mt-4 flex max-w-[380px] flex-wrap justify-center">
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="checkbox"
                label={options[0].label}
                value={options[0].value}
                control={control}
                name="allergies[0]"
                error={Array.isArray(errors.allergies) && !!errors.allergies[0]}
                rules={{
                  validate: {
                    required: (value, formValues) => formValues.allergies.some((value) => !!value),
                    conflict: (value, formValues) =>
                      !value || !formValues.allergies.some((value, idx) => idx > 0 && value),
                  },
                }}
                onChange={() => trigger('allergies')}
              />
            </div>
            {options.map((option, idx) => {
              if (idx === 0) {
                return;
              }
              return (
                <div className="mt-4 px-3" key={option.value}>
                  <InteractiveBlock
                    type="checkbox"
                    label={options[idx].label}
                    value={options[idx].value}
                    control={control}
                    name={`allergies[${idx}]`}
                    error={Array.isArray(errors.allergies) && !!errors.allergies[idx]}
                    rules={{
                      validate: {
                        required: (value, formValues) =>
                          formValues.allergies.some((value) => !!value),
                        conflict: (value, formValues) => !value || !formValues.allergies[0],
                      },
                    }}
                    onChange={() => trigger('allergies')}
                  />
                </div>
              );
            })}
          </div>
          {Array.isArray(errors.allergies) &&
            errors.allergies.some((x) => x.type === 'conflict') && (
              <p className="mx-auto mt-3 max-w-[360px] text-sm text-error">
                You’ve indicated that [Charlie] has no allergies (“None!”) as well as allergies to [
                {getValues('allergies')
                  .map((v: unknown, i: number) => (v ? options[i].label : v))
                  .filter((v: unknown, i: number) => !!v && i !== 0)
                  .join(', ')}
                ]. Please recheck and re-enter your selection.
              </p>
            )}
        </Section>
        <SectionBreak />
        <Section title={t('what-is-{}-currently-eating', { name })}>
          <div className="mx-auto -mt-4 flex max-w-[530px] flex-wrap justify-between">
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="dry"
                control={control}
                name="eating"
                label={t('dry')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="wet"
                control={control}
                name="eating"
                label={t('wet')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="raw"
                control={control}
                name="eating"
                label={t('raw')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="dehydrated"
                control={control}
                name="eating"
                label={t('dehydrated')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="fresh"
                control={control}
                name="eating"
                label={t('fresh')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="homemade"
                control={control}
                name="eating"
                label={t('homemade')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="other"
                control={control}
                name="eating"
                label={t('other')}
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section
          title={t.rich('how-many-treats-or-table-scraps-does-{}-normally-get', {
            name,
            br: () => <br className="max-md:hidden" />,
          })}
        >
          <div className="mx-auto -mt-4 flex max-w-[520px] flex-wrap justify-center">
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="none"
                control={control}
                name="treats"
                label={t('none')}
                error={!!errors.treats}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="some"
                control={control}
                name="treats"
                label={t('some')}
                error={!!errors.treats}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <InteractiveBlock
                type="radio"
                value="lots"
                control={control}
                name="treats"
                label={t('lots')}
                error={!!errors.treats}
                rules={{ required: true }}
              />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title={t('how-picky-is-{}-at-mealtimes', { name })}>
          <div className="mx-auto mt-10 max-w-[640px]">
            <PictureRadio
              name="picky"
              rules={{ required: true }}
              control={control}
              error={!!errors.picky}
              radios={[
                {
                  label: t('can-be-picky'),
                  value: 'picky',
                  children: (
                    <div className="flex items-end">
                      <Image src="/question/picky.svg" alt="Picky dog" width={130} height={50} />
                    </div>
                  ),
                },
                {
                  label: t('is-a-good-eater'),
                  value: 'eater',
                  children: (
                    <div className="flex items-end">
                      <Image
                        src="/question/good-eater.svg"
                        alt="Eater dog"
                        width={80}
                        height={73}
                      />
                    </div>
                  ),
                },
                {
                  label: t('will-eat-anything'),
                  value: 'eatAnything',
                  children: (
                    <Image
                      src="/question/eat-anything.svg"
                      alt="Eat anything dog"
                      width={70}
                      height={81}
                    />
                  ),
                },
              ]}
            />
          </div>
        </Section>
        <Button className="mt-10">{t('continue')}</Button>
      </form>
    </Container>
  );
}
