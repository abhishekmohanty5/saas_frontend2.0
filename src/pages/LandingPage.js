import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSubSphere from '../components/HeroSubSphere';
import TickerBar from '../components/TickerBar';
import LiveBackendStream from '../components/EngineShowcase';
import HowItWorks from '../components/HowItWorks';
import ApiDocsSection from '../components/ApiDocsSection';
import InfraTrustSection from '../components/InfraTrustSection';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

import Aegis3DOverlay from '../components/Aegis3DOverlay';
import SectionDivider from '../components/SectionDivider';

const LandingPage = () => {
  useEffect(() => {
    // Scroll reveal observer with higher threshold for dramatic entry
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--white)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <Aegis3DOverlay />
      <Navbar />
      <HeroSubSphere />
      <TickerBar />

      <SectionDivider />

      <div className="reveal">
        <LiveBackendStream />
      </div>

      <SectionDivider />

      <div className="reveal">
        <HowItWorks />
      </div>

      <SectionDivider />

      <div className="reveal">
        <ApiDocsSection />
      </div>

      <SectionDivider />

      <div className="reveal">
        <InfraTrustSection />
      </div>

      <div className="reveal">
        <Testimonials />
      </div>

      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;