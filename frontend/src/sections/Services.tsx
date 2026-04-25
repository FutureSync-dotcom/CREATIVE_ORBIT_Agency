import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  PenTool, 
  Smartphone, 
  Layout, 
  Video, 
  Printer, 
  Type, 
  Share2, 
  Search, 
  Monitor 
} from 'lucide-react';
import { cn } from '../utils/cn';

const categories = ['All', 'Development', 'Design', 'Marketing', 'Hosting'];

const services = [
  {
    title: 'Website Design & Development',
    category: 'Development',
    description: 'Bespoke, high-performance web applications built with modern frameworks.',
    icon: <Code2 size={24} />,
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    title: 'Mobile Application Development',
    category: 'Development',
    description: 'Cross-platform iOS and Android apps with seamless native performance.',
    icon: <Smartphone size={24} />,
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    title: 'Logo Design',
    category: 'Design',
    description: 'Unique brand identities that capture your essence and vision.',
    icon: <PenTool size={24} />,
    color: 'from-orange-500/20 to-red-500/20'
  },
  {
    title: 'Product Design',
    category: 'Design',
    description: 'User-centric UI/UX design for digital products and platforms.',
    icon: <Layout size={24} />,
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    title: 'Animation',
    category: 'Design',
    description: 'Engaging motion graphics and 2D/3D animations for storytelling.',
    icon: <Video size={24} />,
    color: 'from-yellow-500/20 to-amber-500/20'
  },
  {
    title: 'Search Engine Optimization',
    category: 'Marketing',
    description: 'Data-driven SEO strategies to boost your organic visibility and rank.',
    icon: <Search size={24} />,
    color: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    title: 'Social Media Management',
    category: 'Marketing',
    description: 'Strategic content and community management for social growth.',
    icon: <Share2 size={24} />,
    color: 'from-indigo-500/20 to-purple-500/20'
  },
  {
    title: 'Content Writing',
    category: 'Marketing',
    description: 'Compelling copy and technical writing that converts visitors.',
    icon: <Type size={24} />,
    color: 'from-slate-500/20 to-gray-500/20'
  },
  {
    title: 'Stationery Design',
    category: 'Design',
    description: 'Professional business cards, letterheads, and print materials.',
    icon: <Monitor size={24} />,
    color: 'from-rose-500/20 to-pink-500/20'
  },
  {
    title: 'Printing Services',
    category: 'Design',
    description: 'High-quality physical prints for all your corporate and marketing needs.',
    icon: <Printer size={24} />,
    color: 'from-amber-500/20 to-orange-500/20'
  },
  {
    title: 'Cloud Hosting & Maintenance',
    category: 'Hosting',
    description: 'Secure, high-uptime cloud hosting and proactive server maintenance.',
    icon: <Monitor size={24} />,
    color: 'from-cyan-500/20 to-blue-500/20'
  }
];

export function Services() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  // Dynamic Marquee Logic: Only use marquee if there are enough cards to warrant it.
  const useMarquee = filteredServices.length > 3;
  const displayServices = useMarquee 
    ? [...filteredServices, ...filteredServices, ...filteredServices] 
    : filteredServices;

  return (
    <section id="services" className="py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 mb-16">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Our <span className="text-gradient">Expertise</span>
          </motion.h2>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                activeCategory === cat 
                  ? "bg-accent-cyan text-primary" 
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-scrolling Row or Static Grid */}
      <div className="flex overflow-hidden justify-center">
        <div
          className={cn(
            "flex gap-6 px-4",
            useMarquee ? "animate-marquee hover:[animation-play-state:paused]" : "flex-wrap justify-center max-w-7xl",
            activeCategory !== 'All' && useMarquee && "[animation-duration:20s]"
          )}
        >
          {displayServices.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className="glass-effect group p-8 rounded-[2.5rem] w-[350px] shrink-0 hover:border-accent-cyan/40 transition-all duration-500 perspective-1000"
              data-magnetic
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br transition-all duration-500 group-hover:scale-110",
                service.color
              )}>
                <div className="text-accent-cyan drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">{service.icon}</div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-accent-cyan transition-colors">
                {service.title}
              </h3>
              
              <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                {service.description}
              </p>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-cyan opacity-50 group-hover:opacity-100">{service.category}</span>
                <div className="w-6 h-6 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan text-xs">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Blur Backgrounds */}
      {useMarquee && (
        <>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-full bg-gradient-to-r from-primary to-transparent z-20 pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-full bg-gradient-to-l from-primary to-transparent z-20 pointer-events-none" />
        </>
      )}
    </section>
  );
}
