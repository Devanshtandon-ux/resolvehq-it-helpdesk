import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { ProductStory } from '../components/landing/ProductStory';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { InteractiveMiniDemo } from '../components/landing/InteractiveMiniDemo';
import { DashboardShowcase } from '../components/landing/DashboardShowcase';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FinalCTA } from '../components/landing/FinalCTA';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProductStory />
        <FeaturesGrid />
        <InteractiveMiniDemo />
        <DashboardShowcase />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};
