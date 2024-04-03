import Footer from '@/components/Footer';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer hideNav />
    </>
  );
}
