import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from './Navigator';
import Sticky from '@/components/Sticky';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Header nav={<Navigator />} disableGetStartedButton />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
