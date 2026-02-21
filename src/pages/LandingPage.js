import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSubSphere from '../components/HeroSubSphere';
import TickerBar from '../components/TickerBar';
import BentoFeatures from '../components/BentoFeatures';
import HowItWorks from '../components/HowItWorks';
import ApiDocsSection from '../components/ApiDocsSection';
import PricingSubSphereStatic from '../components/PricingSubSphereStatic';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const LandingPage = () => {
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <HeroSubSphere />
      <TickerBar />
      <BentoFeatures />
      <HowItWorks />
      <ApiDocsSection />
      <PricingSubSphereStatic />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;