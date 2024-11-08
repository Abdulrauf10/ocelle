import Navigator from './Navigator';
import ReferralDialog from './ReferralDialog';

import { getLoginedMe } from '@/actions';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sticky from '@/components/Sticky';
import Toast from '@/components/Toast';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { referralCode, email } = await getLoginedMe();

  return (
    <ReferralDialog email={email} referralCode={referralCode}>
      <Sticky>
        <Header nav={<Navigator />} disableGetStartedButton />
      </Sticky>
      {children}
      <Footer />
      <Toast />
    </ReferralDialog>
  );
}
