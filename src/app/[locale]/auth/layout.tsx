import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navigator from '@/components/Navigator';
import Notice from '@/components/Notice';
import Sticky from '@/components/Sticky';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-beige">
        <Sticky>
          <Notice />
          <Header nav={<Navigator />} />
        </Sticky>
        {children}
      </div>
      <Footer />
    </>
  );
}
