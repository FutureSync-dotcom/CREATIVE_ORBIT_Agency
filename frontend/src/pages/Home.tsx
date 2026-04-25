import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Navigation } from '../components/Navigation';
import { Hero3D } from '../sections/Hero3D';
import { Services } from '../sections/Services';
import { Packages } from '../sections/Packages';
import { Portfolio } from '../sections/Portfolio';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Footer } from '../components/Footer';

export function Home({ settings }: { settings: any }) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="min-h-screen bg-primary selection:bg-accent-cyan/30 selection:text-accent-cyan">
      <Navigation settings={settings} />
      <Hero3D settings={settings} />
      <Services />
      <Portfolio />
      <Packages />
      <About settings={settings} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
