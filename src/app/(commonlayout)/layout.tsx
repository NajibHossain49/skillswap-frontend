import { Navbar } from '@/app/(commonlayout)/Navbar';
import { Footer } from '@/app/(commonlayout)/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
