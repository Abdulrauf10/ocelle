import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Stage from './Stage';
import ProgressBar from './ProgressBar';
import { useTranslations } from 'next-intl';

function BackButton({
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
      <button className="flex select-none items-center text-lg text-primary" onClick={onClick}>
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
        menu={false}
        languageSwitch={false}
        getStarted={false}
        startAdornment={
          <div className="hidden px-2 max-lg:block">
            <BackButton
              show={location.pathname !== Stage.Welcome && location.pathname !== Stage.Calculating}
              onClick={() => navigate(-1)}
            />
          </div>
        }
        endAdornment={
          !(location.pathname === Stage.Calculating) && (
            <div className="w-full max-lg:px-2">
              <div className="flex w-full justify-center max-lg:mt-8 lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:px-[280px]">
                <div className="relative w-full max-w-[460px]">
                  <BackButton
                    className="absolute -left-[80px] -top-px select-none max-lg:hidden"
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
      <main className="py-[3vw] max-sm:py-8">{children}</main>
    </>
  );
}
