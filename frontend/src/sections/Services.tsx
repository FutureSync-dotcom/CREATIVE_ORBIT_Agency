import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { ServiceCard } from '../components/ServiceCard';

const categories = ['All', 'Development', 'Design', 'Marketing', 'Hosting'];

const services = [
  {
    title: 'Website Design & Development',
    category: 'Development',
    description: 'Bespoke, high-performance web applications built with modern frameworks like React and Next.js.',
    icon: <Code2 size={24} />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Mobile Application Development',
    category: 'Development',
    description: 'Cross-platform iOS and Android apps with seamless native performance and elegant user interfaces.',
    icon: <Smartphone size={24} />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Logo Design',
    category: 'Design',
    description: 'Unique brand identities that capture your essence and vision, designed to leave a lasting impression.',
    icon: <PenTool size={24} />,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Product Design',
    category: 'Design',
    description: 'User-centric UI/UX design for digital products and platforms, focusing on usability and aesthetics.',
    icon: <Layout size={24} />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Animation',
    category: 'Design',
    description: 'Engaging motion graphics and 2D/3D animations that bring your stories and data to life.',
    icon: <Video size={24} />,
    color: 'from-yellow-500 to-amber-500'
  },
  {
    title: 'Search Engine Optimization',
    category: 'Marketing',
    description: 'Data-driven SEO strategies to boost your organic visibility, traffic, and search engine ranking.',
    icon: <Search size={24} />,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Social Media Management',
    category: 'Marketing',
    description: 'Strategic content planning and community management to grow your brand presence across all social platforms.',
    icon: <Share2 size={24} />,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Content Writing',
    category: 'Marketing',
    description: 'Compelling copy and technical writing tailored to your audience that drives engagement and conversion.',
    icon: <Type size={24} />,
    color: 'from-slate-500 to-gray-500'
  },
  {
    title: 'Stationery Design',
    category: 'Design',
    description: 'Professional business cards, letterheads, and other corporate print materials that maintain brand consistency.',
    icon: <Monitor size={24} />,
    color: 'from-rose-500 to-pink-500'
  },
  {
    title: 'Printing Services',
    category: 'Design',
    description: 'High-quality physical prints with premium finishes for all your corporate and marketing needs.',
    icon: <Printer size={24} />,
    color: 'from-amber-500 to-orange-500'
  },
  {
    title: 'Cloud Hosting & Maintenance',
    category: 'Hosting',
    description: 'Secure, high-uptime cloud hosting solutions and proactive server maintenance to keep your business online.',
    icon: <Monitor size={24} />,
    color: 'from-cyan-500 to-blue-500'
  }
];

export function Services() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const useMarquee = filteredServices.length > 3;
  const displayServices = useMarquee 
    ? [...filteredServices, ...filteredServices, ...filteredServices] 
    : filteredServices;

  return (
    <section id="services" className="py-32 bg-primary relative overflow-hidden">
      {/* Background Ambient Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.03)_0%,transparent_70%)] -z-10" />

      <div className="container mx-auto px-6 relative z-10 mb-20">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 block"
          >
            What We Do
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-display font-bold leading-tight"
          >
            Our <span className="text-gradient">Expertise</span>
          </motion.h2>
        </div>

        {/* Categories Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border",
                activeCategory === cat 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-transparent border-white/5 text-white/40 hover:border-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Auto-scrolling Row or Static Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex overflow-hidden justify-center py-10"
      >
        <div
          className={cn(
            "flex gap-8 px-4",
            useMarquee ? "animate-marquee hover:[animation-play-state:paused]" : "flex-wrap justify-center max-w-7xl",
            activeCategory !== 'All' && useMarquee && "[animation-duration:25s]"
          )}
        >
          <AnimatePresence mode="popLayout">
            {displayServices.map((service, index) => (
              <ServiceCard
                key={`${service.title}-${index}`}
                service={service}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Edge Fading Gradients for Marquee */}
      {useMarquee && (
        <>
          <div className="absolute top-0 left-0 h-full w-[200px] bg-gradient-to-r from-primary to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-[200px] bg-gradient-to-l from-primary to-transparent z-20 pointer-events-none" />
        </>
      )}
    </section>
  );
}
