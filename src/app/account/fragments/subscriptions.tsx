import { Switch, ThemeProvider, createTheme } from '@mui/material';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/headings/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { Route } from '../types';
import Button from '@/components/Button';

export default function SubscriptionsFragment({ navigate }: FragmentProps<Route>) {
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
                  content: '"Plan Active"',
                  position: 'relative',
                  top: 4,
                  right: 5,
                  display: 'none',
                },
                '&:after': {
                  content: '"Plan Inactive"',
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
      <div className="py-10">
        <Container>
          <H2 inline className="text-center text-primary">
            Your Subscriptions
          </H2>
          <div className="border-gray mx-auto mt-4 max-w-[580px] rounded-3xl border bg-white p-6 text-center shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
            <div className="text-gold text-xl font-bold">Reactivate Or Suspend A Plan</div>
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
                    Cancel
                  </Button>
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <Button className="mx-auto max-w-[240px]" fullWidth>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <UnderlineButton
              className="!text-primary"
              label="Pause All Deliveries"
              onClick={() => navigate('pause')}
            />
            <br />
            <UnderlineButton className="!text-primary" label="Cancel My OCELLE Subscriptions" />
          </div>
          <div className="mt-6 text-center">
            <UnderlineButton type="button" onClick={() => navigate(-1)} label="Go Back" />
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}
