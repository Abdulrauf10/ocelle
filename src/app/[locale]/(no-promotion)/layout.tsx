import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigator from '@/components/Navigator';
import Sticky from '@/components/Sticky';

export default function NoPromotionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Header nav={<Navigator />} />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
