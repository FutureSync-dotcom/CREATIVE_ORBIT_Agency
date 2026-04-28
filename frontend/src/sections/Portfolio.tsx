import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';

const categories = ['All', 'Websites', 'Apps', 'Branding'];

const projects = [
  {
    title: 'Nexus Fintech Dashboard',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&w=800&q=80',
    description: 'A comprehensive financial management platform with real-time analytics.',
    tags: ['React', 'D3.js', 'Firebase']
  },
  {
    title: 'Lumina Fashion App',
    category: 'Apps',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke iOS application for high-end fashion e-commerce.',
    tags: ['SwiftUI', 'Node.js', 'Stripe']
  },
  {
    title: 'Aether Brand Identity',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    description: 'Strategic visual identity for an AI-driven logistics startup.',
    tags: ['Identity', 'Motion', 'Logo']
  },
  {
    title: 'Horizon Corporate Web',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Next-gen corporate ecosystem with interactive 3D elements.',
    tags: ['Three.js', 'Next.js', 'GSAP']
  },
  {
    title: 'Pulse Health Tracker',
    category: 'Apps',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    description: 'Intuitive health and wellness monitoring mobile application.',
    tags: ['React Native', 'HealthKit']
  },
  {
    title: 'Zenith Architecture',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Portfolio website for an international architectural firm.',
    tags: ['Minimalist', 'React', 'Tailwind']
  }
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32 bg-primary relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 block"
            >
              Selected Works
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-7xl font-display font-bold leading-tight"
            >
              Recent <span className="text-gradient">Projects</span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border
                  ${activeCategory === cat 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-transparent border-white/5 text-white/40 hover:border-white/10 hover:text-white"
                  }
                `}
                data-magnetic
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: (index % 3) * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98] 
                }}
              >
                <ProjectCard 
                  project={project} 
                  index={index} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
