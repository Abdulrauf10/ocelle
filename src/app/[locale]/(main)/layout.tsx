import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Notice from '@/components/Notice';
import Navigator from '@/components/Navigator';
import Sticky from '@/components/Sticky';
import LoginButton from '@/components/buttons/LoginButton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Notice />
        <Header nav={<Navigator />} loginButton={<LoginButton />} />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
