import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import ProgressBar from './ProgressBar';
import Stage from './Stage';

import Header from '@/components/Header';

function UnderlineBackButton({
  show,
  className,
  onClick,
}: {
  show: boolean;
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
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Header
        disableMenuButton
        disableLanguageSwitch
        disableGetStartedButton
        startAdornment={
          <div className="mt-1 hidden px-2 max-lg:block">
            <UnderlineBackButton
              show={
                location.pathname !== Stage.Welcome &&
                location.pathname !== Stage.Calculating &&
                location.pathname !== Stage.Processing
              }
              onClick={() => navigate(-1)}
            />
          </div>
        }
        endAdornment={
          !(location.pathname === Stage.Calculating || location.pathname === Stage.Processing) && (
            <div className="w-full max-lg:mt-3 max-lg:px-2">
              <div className="flex w-full justify-center max-lg:mt-2 lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 lg:px-[280px]">
                <div className="relative w-full max-w-[460px]">
                  <UnderlineBackButton
                    className="absolute -left-[80px] -top-2 select-none max-lg:hidden"
                    show={location.pathname !== Stage.Welcome}
                    onClick={() => navigate(-1)}
                  />
                  <ProgressBar stage={(location.pathname as Stage) || Stage.Welcome} />
                </div>
              </div>
            </div>
          )
        }
      />
      <main className="py-[clamp(16px,2.4vw,30px)]">{children}</main>
    </>
  );
}
