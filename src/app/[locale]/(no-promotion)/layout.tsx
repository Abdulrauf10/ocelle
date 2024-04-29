import Footer from '@/components/Footer';
import Header from '@/components/Header';
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
