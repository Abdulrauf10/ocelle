import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from './Navigator';
import Sticky from '@/components/Sticky';
import LoginButton from '@/components/buttons/LoginButton';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Header nav={<Navigator />} loginButton={<LoginButton />} disableGetStartedButton />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
