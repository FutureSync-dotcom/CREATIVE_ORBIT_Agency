import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, ArrowRight, ArrowUpRight, CheckCircle2, Star, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const categories = ['All', 'Websites', 'Apps', 'Branding'];

const projects = [
  {
    title: 'Nexus Fintech',
    category: 'Fintech Ecosystem',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&w=1200&q=80',
    description: 'A revolutionary wealth management platform that processes $2M+ in daily transactions with zero latency.',
    results: ['99.9% Uptime', '40% Faster Onboarding', '200k+ Active Users'],
    tags: ['React', 'D3.js', 'Firebase'],
    challenge: 'Designing a secure yet intuitive interface for complex financial data visualization.'
  },
  {
    title: 'Lumina Fashion',
    category: 'E-Commerce App',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    description: 'A luxury fashion app that leverages AR to let customers "try on" accessories from their mobile devices.',
    results: ['25% Conversion Boost', 'Global Shipping API', 'iOS & Android'],
    tags: ['SwiftUI', 'Node.js', 'Stripe'],
    challenge: 'Integrating low-latency AR models into a high-performance shopping experience.'
  },
  {
    title: 'Aether Logistics',
    category: 'AI Platform',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    description: 'Autonomous supply chain management system powered by neural networks for predictive shipping.',
    results: ['Reduced Waste by 30%', 'AI-Route Optimization', 'Enterprise Scale'],
    tags: ['Three.js', 'Next.js', 'GSAP'],
    challenge: 'Simplifying multi-layered logistical data into a real-time command center dashboard.'
  }
];

function ProjectRow({ project, index }: { project: any; index: number }) {
  const isEven = index % 2 === 0;
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.9, 1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={containerRef} className="py-24 md:py-48 relative border-b border-white/5 last:border-0">
      <div className={cn(
        "container mx-auto px-6 flex flex-col gap-12 lg:gap-32 items-center",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      )}>
        {/* Project Info */}
        <div className="flex-1 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-accent-cyan/50" />
              <span className="text-accent-cyan font-bold uppercase tracking-[0.4em] text-[10px]">
                {project.category}
              </span>
            </div>
            <h3 className="text-5xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter">
              {project.title.split(' ').map((word: string, i: number) => (
                <span key={i} className="inline-block overflow-hidden mr-3">
                  <motion.span
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h3>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl font-medium"
          >
            {project.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.results.map((res: string, i: number) => (
                <div key={res} className="flex items-start gap-4 group">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent-cyan group-hover:scale-150 transition-transform shadow-[0_0_15px_rgba(0,242,255,0.5)]" />
                  <span className="text-sm md:text-base font-bold text-white/70 uppercase tracking-widest">{res}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-6 group"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent-cyan group-hover:bg-accent-cyan transition-all duration-500">
                <ArrowRight size={24} className="text-white group-hover:text-primary group-hover:-rotate-45 transition-all" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                View Case Study
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Project Image */}
        <motion.div 
          style={{ scale, opacity }}
          className="flex-1 relative w-full"
        >
          <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/5 aspect-[4/3] lg:aspect-[5/6] shadow-2xl">
            <motion.img 
              style={{ y: imageY }}
              src={project.image} 
              alt={project.title}
              className="absolute inset-0 w-full h-[120%] object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
            />
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-white/5 pointer-events-none" />
          </div>

          {/* Floating Stats */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={cn(
              "absolute hidden md:flex flex-col gap-2 p-6 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 z-20",
              isEven ? "-right-10 top-20" : "-left-10 top-20"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan">Technology Stack</span>
            <div className="flex gap-2">
              {project.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-bold text-white/80">{tag}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-primary relative overflow-hidden pt-32">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-cyan/5 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-purple/5 blur-[150px] -z-10" />

      <div className="container mx-auto px-6 relative z-10 mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 block"
        >
          The Archive
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-display font-bold leading-tight"
        >
          Selected <span className="text-gradient">Creations</span>
        </motion.h2>
      </div>

      <div className="relative">
        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
      </div>

      {/* View More Button */}
      <div className="container mx-auto px-6 py-20 flex justify-center">
        <Link to="/projects">
          <motion.div
            whileHover="hover"
            className="group relative inline-flex items-center justify-center p-1 rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-cyan animate-spin-slow opacity-20 group-hover:opacity-100 transition-opacity" />
            <div className="relative px-12 py-6 bg-primary rounded-full flex items-center gap-4 transition-all group-hover:bg-primary/90">
              <span className="text-xl md:text-2xl font-display font-bold uppercase tracking-widest text-white">
                View All Projects
              </span>
              <motion.div
                variants={{
                  hover: { x: 5, y: -5 }
                }}
              >
                <ArrowUpRight size={24} className="text-accent-cyan" />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
