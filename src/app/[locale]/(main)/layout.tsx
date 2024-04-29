import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import Promotion from '@/components/Promotion';
import Sticky from '@/components/Sticky';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Promotion />
        <Header nav={<Navigator />} />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
