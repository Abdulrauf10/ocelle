'use client';

import { useRouter } from '@/navigation';
import { Switch, ThemeProvider, createTheme } from '@mui/material';
import Container from '@/components/Container';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Button from '@/components/buttons/Button';
import { useTranslations } from 'next-intl';

export default function Subscriptions() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <ThemeProvider
      theme={createTheme({
        components: {
          MuiSwitch: {
            styleOverrides: {
              root: {
                width: 160,
                height: 40,
                paddingTop: 4,
                paddingBottom: 4,
              },
              switchBase: {
                top: 0,
                left: 8,
                '&.Mui-checked': {
                  transform: 'translateX(103px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#5289B1',
                    '&:before': {
                      display: 'block',
                    },
                    '&:after': {
                      display: 'none',
                    },
                  },
                },
              },
              thumb: {
                width: 22,
                height: 22,
              },
              track: {
                opacity: 1,
                borderRadius: 30,
                backgroundColor: '#CDCAC2',
                color: '#fff',
                textAlign: 'center',
                '&:before': {
                  content: `"${t('plan-{}', { status: t('active') })}"`,
                  position: 'relative',
                  top: 4,
                  right: 5,
                  display: 'none',
                },
                '&:after': {
                  content: `"${t('plan-{}', { status: t('inactive') })}"`,
                  position: 'relative',
                  top: 4,
                  left: 8,
                },
              },
            },
          },
        },
      })}
    >
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <h1 className="heading-4 text-center font-bold text-primary">
            {t('your-subscriptions')}
          </h1>
          <div className="mx-auto mt-4 max-w-[580px] rounded-3xl border border-gray bg-white p-6 text-center shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
            <div className="text-xl font-bold text-gold">{t('reactivate-or-suspend-a-plan')}</div>
            <div className="mt-4 flex items-center">
              <div className="w-1/2 px-2">[Charlie]</div>
              <div className="w-1/2 px-2 text-left">
                <Switch />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="w-1/2 px-2">[Muffin]</div>
              <div className="w-1/2 px-2 text-left">
                <Switch />
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-[460px]">
              <div className="-m-2 flex flex-wrap">
                <div className="w-1/2 p-2 max-sm:w-full">
                  <Button className="mx-auto max-w-[240px]" fullWidth reverse>
                    {t('cancel')}
                  </Button>
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <Button className="mx-auto max-w-[240px]" fullWidth>
                    {t('save-changes')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <UnderlineButton
              theme="primary"
              label={t('pause-all-deliveries')}
              href="/account/pause-delivery"
            />
            <br />
            <UnderlineButton
              theme="primary"
              label={t('cancel-my-ocelle-subscriptions')}
              href="/account/subscription/cancel"
            />
          </div>
          <div className="mt-6 text-center">
            <UnderlineButton type="button" onClick={() => router.back()} label={t('go-back')} />
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
