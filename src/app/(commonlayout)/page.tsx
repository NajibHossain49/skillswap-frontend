
import { Navbar } from '@/app/(commonlayout)/Navbar';
import { FAQSection, FeaturedSkillsSection, FeaturesSection, HeroSection, HowItWorksSection, NewsletterSection, StatsSection, TestimonialsSection } from '../(commonlayout)/components/Homesections';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-900">


      <HeroSection />
      <HowItWorksSection />
      <FeaturedSkillsSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />


    </div>
  );
}