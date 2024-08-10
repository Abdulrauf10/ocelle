import Navigator from './Navigator';
import ReferralDialog from './ReferralDialog';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sticky from '@/components/Sticky';
import Toast from '@/components/Toast';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReferralDialog>
      <Sticky>
        <Header nav={<Navigator />} disableGetStartedButton />
      </Sticky>
      {children}
      <Footer />
      <Toast />
    </ReferralDialog>
  );
}
