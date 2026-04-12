import { FAQSection, FeaturedSkillsSection, FeaturesSection, HeroSection, HowItWorksSection, NewsletterSection, StatsSection, TestimonialsSection } from "./components/Homesections";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-900">
     

      <HeroSection />         {/* 1. Hero + stats */}
      <HowItWorksSection />   {/* 2. 4-step process */}
      <FeaturedSkillsSection />{/* 3. Skill cards grid */}
      <FeaturesSection />     {/* 4. Why SkillSwap */}
      <StatsSection />        {/* 5. Big numbers */}
      <TestimonialsSection /> {/* 6. Reviews */}
      <FAQSection />          {/* 7. Accordion FAQ */}
      <NewsletterSection />   {/* 8. CTA + email */}

    </div>
  );
}