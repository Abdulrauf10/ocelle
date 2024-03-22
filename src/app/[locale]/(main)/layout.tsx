import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Notice from '@/components/Notice';
import Navigator from '@/components/Navigator';
import Sticky from '@/components/Sticky';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Notice />
        <Header nav={<Navigator />} />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
