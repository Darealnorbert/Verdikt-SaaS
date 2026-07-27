import Navbar from '@/components/nav/Navbar'
import HeroSection from '@/components/hero/HeroSection'
import WhatIfSection from '@/components/sections/WhatIfSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import TerminalSection from '@/components/sections/TerminalSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import StatsBand from '@/components/sections/StatsBand'
import PricingSection from '@/components/pricing/PricingSection'
import FaqSection from '@/components/faq/FaqSection'
import FinalCta from '@/components/sections/FinalCta'
import Footer from '@/components/nav/Footer'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="orb-3" />
      <Navbar />
      <HeroSection />
      <WhatIfSection />
      <HowItWorksSection />
      <TerminalSection />
      <FeaturesSection />
      <StatsBand />
      <PricingSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  )
}
