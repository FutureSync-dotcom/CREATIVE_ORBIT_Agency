import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from '../components/Navigation';
import { Hero3D } from '../sections/Hero3D';
import { Services } from '../sections/Services';
import { Packages } from '../sections/Packages';
import { Portfolio } from '../sections/Portfolio';
import { TestimonialBook } from '../sections/TestimonialBook';
import { Process } from '../sections/Process';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Footer } from '../components/Footer';

export function Home({ settings }: { settings: any }) {
  useEffect(() => {
    const lenis = new Lenis();
    
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Initial refresh after a short delay to ensure components are mounted
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <main className="min-h-screen bg-primary selection:bg-accent-cyan/30 selection:text-accent-cyan">
      <Navigation settings={settings} />
      <Hero3D settings={settings} />
      <Services />
      <Portfolio />
      <TestimonialBook />
      <Process />
      <Packages />
      <About settings={settings} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
