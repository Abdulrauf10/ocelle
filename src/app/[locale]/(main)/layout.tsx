import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Promotion from '@/components/Promotion';
import Navigator from '@/components/Navigator';
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
