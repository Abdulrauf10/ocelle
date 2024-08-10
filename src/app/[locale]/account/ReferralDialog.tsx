'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import { Dialog, DialogContent } from '@/components/Dialog';
import Button from '@/components/buttons/Button';
import CloseCircle from '@/components/icons/CloseCircle';

const ReferralDialogContext = React.createContext({ openDialog: () => {} });

export default function ReferralDialog({ children }: React.PropsWithChildren) {
  const r = useTranslations('Referral');
  const [open, setOpen] = React.useState(true);
  const [referral, setReferral] = React.useState(true);

  const openDialog = React.useCallback(() => setOpen(true), []);
  const closeDialog = React.useCallback(() => {
    setOpen(false);
    setReferral(false);
  }, []);

  return (
    <ReferralDialogContext.Provider value={{ openDialog }}>
      {children}
      <Dialog open={open}>
        <DialogContent className="p-3">
          <div className="relative flex w-[860px] items-stretch overflow-hidden rounded-3xl border-2 border-primary bg-white text-left shadow-black/20 drop-shadow-style-1 max-md:flex-wrap">
            <div className="mx-auto w-[480px]">
              <div className="relative pt-[72.9%]">
                <Image
                  src="/account/referral-dialog-pic.jpg"
                  alt="dog with ocelle box"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center border-l-2 border-solid border-primary px-6 text-center">
              {referral ? (
                <>
                  <div className="heading-4 font-bold text-primary">{r('block-2-title-2')}</div>
                  <div className="pt-5"></div>
                  <p className="body-3 max-w-[280px]">
                    {r.rich('block-2-content-1', {
                      value: 50,
                      highlight: (chunks) => (
                        <span className="font-bold text-dark-green">{chunks}</span>
                      ),
                    })}
                  </p>
                  <div className="pt-4"></div>
                  <div className="w-[200px] overflow-hidden rounded-[10px] border-[1.5px] border-primary text-[0px]">
                    <div className="text-[14px] leading-[30px]">xxxx38</div>
                    <button className="w-full bg-primary text-[16px] leading-[30px] text-white outline-none">
                      Copy Code
                    </button>
                  </div>
                  <div className="pt-2.5"></div>
                  <div className="body-3">{r('block-2-content-2')}</div>
                  <div className="pt-2.5"></div>
                  <div className="mx-auto flex w-[185px] justify-between">
                    <button>
                      <Image width={23} height={23} src="/account/share-fb.svg" alt="facebook" />
                    </button>
                    <button>
                      <Image
                        width={23}
                        height={23}
                        src="/account/share-messager.svg"
                        alt="messager"
                      />
                    </button>
                    <button>
                      <Image
                        width={23}
                        height={23}
                        src="/account/share-whatsapp.svg"
                        alt="whatsapp"
                      />
                    </button>
                    <button>
                      <Image width={23} height={23} src="/account/share-email.svg" alt="email" />
                    </button>
                  </div>
                  <div className="pt-3"></div>
                  <div className="body-3 max-w-[280px]">
                    {r('block-2-content-3', { value: 'ksaunders@ocelle.dog' })}
                  </div>
                </>
              ) : (
                <>
                  <div className="heading-4 font-bold text-primary">
                    {r.rich('block-1-title-1', {
                      value: 50,
                      highlight: (chunks) => (
                        <span className="font-bold text-dark-green">{chunks}</span>
                      ),
                    })}
                  </div>
                  <div className="pt-5"></div>
                  <p className="body-3 max-w-[280px]">{r.rich('block-1-content-1')}</p>
                  <div className="pt-3"></div>
                  <p className="body-3 max-w-[280px]">
                    {r.rich('block-1-content-2', {
                      value: 50,
                      highlight: (chunks) => (
                        <span className="font-bold text-dark-green">{chunks}</span>
                      ),
                    })}
                  </p>
                  <div className="pt-5"></div>
                  <Button theme="primary" onClick={() => setReferral(true)}>
                    {r('block-1-content-3')}
                  </Button>
                </>
              )}
              <button className="absolute right-4 top-3 cursor-pointer" onClick={closeDialog}>
                <CloseCircle className="h-6 w-6 text-gray" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ReferralDialogContext.Provider>
  );
}

export function useReferralDialogContext() {
  return React.useContext(ReferralDialogContext);
}
