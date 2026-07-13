import {
  CTASection,
  FAQSection,
  FeaturedSkillsSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  LogoCloudSection,
  PricingSection,
  StatsSection,
  TestimonialsSection,
} from './components/Homesections';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper-100 dark:bg-ink-900">
      <HeroSection />
      <LogoCloudSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedSkillsSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
