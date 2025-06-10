import React from 'react';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import CTA from '../components/landing/CTA';

export default function AboutPage() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
} 