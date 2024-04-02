import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Notice from '@/components/Notice';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">
        <Notice />
        <Header
          disableLanguageSwitch
          disableGetStartedButton
          disableMenuButton
          disableLoginButton
        />
        {children}
      </div>
      <Footer hideNav />
    </>
  );
}
