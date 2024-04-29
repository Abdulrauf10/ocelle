import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer hideNav />
      <Toast promotion />
    </>
  );
}
