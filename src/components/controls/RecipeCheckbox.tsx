import React from 'react';
import Image from 'next/image';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';
import clsx from 'clsx';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import Close from '../icons/Close';
import RoundedCheckbox from './RoundedCheckbox';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../Dialog';

interface RecipeCheckboxProps {
  title: string;
  description: string;
  name: string;
  picture: string;
  ingredients: string;
  nutrientBlend: string;
  calorie: number;
  protein: number;
  fat: number;
  fibre: number;
  moisture: number;
  disabled?: boolean;
  control: Control<FieldValues, any>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  recommended?: boolean;
}

function Dotted() {
  return (
    <div className="after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-0 after:inline-block after:align-[3px] after:tracking-[6px] after:text-black after:content-dotted"></div>
  );
}

export default function RecipeCheckbox({
  picture,
  title,
  name,
  control,
  recommended,
  disabled,
  description,
  ingredients,
  nutrientBlend,
  calorie,
  protein,
  fat,
  fibre,
  moisture,
}: RecipeCheckboxProps) {
  const { field } = useController({ name, control });
  const [isOpen, setIsOpen] = React.useState(false);
  const [tab, setTab] = React.useState<'Ingredients' | 'Nutrition'>('Ingredients');

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  // Set up label and description ids
  const labelId = React.useId();
  const descriptionId = React.useId();

  return (
    <div
      className={clsx(
        'relative mx-auto mt-[70px] min-w-[230px] max-w-[280px] rounded-[20px] border p-[10px] shadow-[3px_3px_10px_rgba(0,0,0,.2)]',
        disabled
          ? 'pointer-events-none select-none border-[#7B8D97] bg-[#F2F4F5]'
          : 'border-gold bg-white'
      )}
    >
      <div className="absolute -top-[70px] left-1/2 -translate-x-1/2">
        {recommended && (
          <div
            className={clsx(
              'absolute -left-1/2 inline-block select-none rounded-3xl border border-white bg-secondary px-3 py-px text-center text-sm italic text-white'
            )}
          >
            RECOMMENDED
          </div>
        )}
        <Image
          src={picture}
          alt={title}
          width={140}
          height={140}
          className="min-w-[140px] rounded-2xl shadow-[3px_3px_10px_rgba(0,0,0,.2)]"
        />
      </div>
      <div className="h-[70px]"></div>
      <div className={clsx('mt-2 text-center', disabled ? 'text-[#BDC6CB]' : 'text-gold')}>
        <RoundedCheckbox
          name="w"
          control={control}
          label={title}
          value={11}
          className="text-gold font-bold"
          disabled={disabled}
        />
        <div className={clsx('mt-0.5 text-[#7B8D97]', disabled && 'text-opacity-50')}>$$</div>
        <div className="mt-0.5">
          <Dialog>
            <DialogTrigger className="font-light underline">See Details</DialogTrigger>
            <DialogContent className="relative m-3 flex max-w-screen-lg items-start rounded-3xl border-2 border-primary bg-white px-5 py-4 max-md:flex-wrap max-md:pt-9">
              <div className="w-[400px] min-w-[400px] max-lg:min-w-[320px] max-xs:w-full max-xs:min-w-full">
                <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                  <Image src="/meal-plan/chicken-recipe.jpg" alt="Chicken Recipe" fill />
                </div>
              </div>
              <div className="ml-6 py-1 max-md:mx-3 max-md:mt-4">
                <h2 id={labelId} className="text-xl font-bold text-primary max-lg:text-lg">
                  {title}
                </h2>
                <p id={descriptionId} className="mt-2 leading-tight">
                  {description}
                </p>
                <hr className="my-3 border-[#7B8D97]" />
                <div className="-mx-4 flex">
                  <button
                    className={clsx(
                      'mx-4 text-lg',
                      tab === 'Ingredients'
                        ? 'text-primary underline'
                        : 'text-[#7B8D97] hover:underline'
                    )}
                    type="button"
                    onClick={() => setTab('Ingredients')}
                  >
                    Ingredients
                  </button>
                  <button
                    className={clsx(
                      'mx-4 text-lg',
                      tab === 'Nutrition'
                        ? 'text-primary underline'
                        : 'text-[#7B8D97] hover:underline'
                    )}
                    type="button"
                    onClick={() => setTab('Nutrition')}
                  >
                    Nutrition
                  </button>
                </div>
                {tab === 'Ingredients' && (
                  <>
                    <p className="mt-3 leading-tight">
                      <strong>Ingredients</strong>
                      <br />
                      {ingredients}
                    </p>
                    <p className="mt-3 leading-tight">
                      <strong>Ocelle Targeted Nutrient Blend:</strong>
                      <br />
                      {nutrientBlend}
                    </p>
                  </>
                )}
                {tab === 'Nutrition' && (
                  <>
                    <div className="mt-2 flex flex-wrap justify-between">
                      <strong>CALORIE CONTENT:</strong>
                      <span>{calorie} kcal/kg</span>
                    </div>
                    <div className="mt-1">
                      <strong>GUARENTEED ANALYSIS:</strong>
                      <div className="mt-2 flex flex-wrap justify-between">
                        <span>Crude Protein</span>
                        <span>{protein}% Min</span>
                      </div>
                      <div className="my-1">
                        <Dotted />
                      </div>
                      <div className="flex flex-wrap justify-between">
                        <span>Crude Fat</span>
                        <span>{fat}% Min</span>
                      </div>
                      <div className="my-1">
                        <Dotted />
                      </div>
                      <div className="flex flex-wrap justify-between">
                        <span>Crude Firbe</span>
                        <span>{fibre}% Max</span>
                      </div>
                      <div className="my-1">
                        <Dotted />
                      </div>
                      <div className="flex flex-wrap justify-between">
                        <span>Moisture</span>
                        <span>{moisture}% Max</span>
                      </div>
                      <p className="mt-3 leading-tight">
                        Our {title} for Dogs is formulated to meet the nutritional levels
                        established by the AAFCO Dog Food Nutrient Profiles for all life stages,
                        including growth of large sized dogs (70 lbs. or more as an adult).
                      </p>
                    </div>
                  </>
                )}
                <DialogClose className="absolute right-4 top-3 cursor-pointer">
                  <Close className="h-[20px] w-[20px]" />
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
