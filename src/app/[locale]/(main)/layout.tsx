import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Notice from '@/components/Notice';
import Navigator from '@/components/Navigator';
import Sticky from '@/components/Sticky';

export const metadata: Metadata = {
  title: 'Ocelle | Science in Every Recipe. Love in Every Bite.',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sticky>
        <Notice />
        <Header nav={<Navigator />} />
      </Sticky>
      {children}
      <Footer />
    </>
  );
}
