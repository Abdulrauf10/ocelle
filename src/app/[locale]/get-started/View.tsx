import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ProgressBar from './ProgressBar';
import Stage from './Stage';
import { useSurvey } from './SurveyContext';

import Header from '@/components/Header';
import { useRouter } from '@/navigation';

function UnderlineBackButton({
  show,
  className,
  onClick,
}: {
  show?: boolean;
  className?: string;
  onClick(): void;
}) {
  const t = useTranslations();
  return (
    <motion.div
      variants={{
        show: { opacity: 1, pointerEvents: 'all' },
        hide: { opacity: 0, pointerEvents: 'none' },
      }}
      initial={!show ? 'hide' : 'show'}
      animate={!show ? 'hide' : 'show'}
      transition={{ duration: 0.1 }}
      className={className}
    >
      <button className="mt-1 flex select-none items-center text-lg text-primary" onClick={onClick}>
        <i className="relative -top-px mr-1 inline-block rotate-[135deg] border-[length:0_1px_1px_0] border-primary p-1"></i>
        {t('back')}
      </button>
    </motion.div>
  );
}

export default function View({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const location = useLocation();
  const navigate = useNavigate();
  const { prevDog } = useSurvey();

  const handleBackClick = React.useCallback(() => {
    if (location.pathname === Stage.Welcome) {
      return router.push('/');
    }
    if (location.pathname === Stage.Dog) {
      prevDog();
    }
    navigate(-1);
  }, [location.pathname, router, prevDog, navigate]);

  return (
    <>
      <Header
        disableMenuButton
        disableLanguageSwitch
        disableGetStartedButton
        startAdornment={
          <div className="mt-1 hidden px-2 max-xl:block">
            <UnderlineBackButton
              show={
                location.pathname !== Stage.Calculating && location.pathname !== Stage.Processing
              }
              onClick={handleBackClick}
            />
          </div>
        }
        endAdornment={
          !(location.pathname === Stage.Calculating || location.pathname === Stage.Processing) && (
            <div className="w-full max-xl:mt-3 max-xl:px-2">
              <div className="flex w-full justify-center max-xl:mt-2 xl:absolute xl:bottom-3 xl:left-1/2 xl:-translate-x-1/2 xl:px-[280px]">
                <div className="relative w-full max-w-[460px]">
                  <UnderlineBackButton
                    className="absolute -left-[80px] -top-2 select-none max-xl:hidden"
                    onClick={handleBackClick}
                    show
                  />
                  <ProgressBar stage={(location.pathname as Stage) || Stage.Welcome} />
                </div>
              </div>
            </div>
          )
        }
      />
      <main className="overflow-hidden py-[30px]">{children}</main>
    </>
  );
}
