import Navigator from './Navigator';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sticky from '@/components/Sticky';
import Toast from '@/components/Toast';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Header nav={<Navigator />} disableGetStartedButton />
      </Sticky>
      {children}
      <Footer />
      <Toast />
    </>
  );
}
