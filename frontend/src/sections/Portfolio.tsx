import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

const categories = ['All', 'Websites', 'Apps', 'Branding'];

const projects = [
  {
    title: 'Nexus Fintech Dashboard',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&w=800&q=80',
    description: 'A comprehensive financial management platform with real-time analytics.'
  },
  {
    title: 'Lumina Fashion App',
    category: 'Apps',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke iOS application for high-end fashion e-commerce.'
  },
  {
    title: 'Aether Brand Identity',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    description: 'Strategic visual identity for an AI-driven logistics startup.'
  },
  {
    title: 'Horizon Corporate Web',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Next-gen corporate ecosystem with interactive 3D elements.'
  },
  {
    title: 'Pulse Health Tracker',
    category: 'Apps',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    description: 'Intuitive health and wellness monitoring mobile application.'
  },
  {
    title: 'Zenith Architecture',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Portfolio website for an international architectural firm.'
  }
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 block"
            >
              Selected Works
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold"
            >
              Recent <span className="text-gradient">Projects</span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border",
                  activeCategory === cat 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-transparent border-white/5 text-white/40 hover:border-white/10"
                )}
                data-magnetic
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden glass-effect border-white/5"
              >
                {/* Scrolling Image Container */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-full transition-transform duration-[3s] ease-in-out group-hover:scale-110">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent-cyan px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
                        {project.category}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-cyan hover:text-primary transition-all">
                        <ExternalLink size={18} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </motion.div>
                </div>

                {/* Static Preview Title (Hidden on Hover) */}
                <div className="absolute bottom-8 left-8 right-8 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="glass-effect px-6 py-4 rounded-2xl border-white/10">
                    <h4 className="font-bold text-white/90">{project.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
