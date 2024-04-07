import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import Notice from '@/components/Notice';
import Sticky from '@/components/Sticky';
import LoginButton from '@/components/buttons/LoginButton';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-beige">
        <Sticky>
          <Notice />
          <Header nav={<Navigator />} loginButton={<LoginButton />} />
        </Sticky>
        {children}
      </div>
      <Footer />
    </>
  );
}
