import Footer from '@/components/Footer';
import Promotion from '@/components/Promotion';
import Toast from '@/components/Toast';

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">
        <Promotion />
        {children}
      </div>
      <Footer hideNav />
      <Toast promotion />
    </>
  );
}
