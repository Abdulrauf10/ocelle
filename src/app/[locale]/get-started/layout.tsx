import Footer from '@/components/Footer';
import Notice from '@/components/Notice';

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">
        <Notice />
        {children}
      </div>
      <Footer hideNav />
    </>
  );
}
