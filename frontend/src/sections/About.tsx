import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Eye, Zap, ShieldCheck, Globe, Users } from 'lucide-react';
import { cn } from '../utils/cn';

const stats = [
  { label: 'Global Clients', value: '150+', icon: <Globe size={20} /> },
  { label: 'Projects Done', value: '320+', icon: <Zap size={20} /> },
  { label: 'Team Experts', value: '45+', icon: <Users size={20} /> },
  { label: 'Client Success', value: '99%', icon: <ShieldCheck size={20} /> },
];

const values = [
  {
    title: 'Precision Engineering',
    description: 'We believe in writing clean, scalable, and high-performance code that stands the test of time.',
    icon: <Target className="text-accent-cyan" />
  },
  {
    title: 'Future-Ready Design',
    description: 'Our designs are not just for today; we build experiences that remain relevant in the evolving digital landscape.',
    icon: <Eye className="text-accent-purple" />
  }
];

export function About({ settings }: { settings: any }) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  const agencyName = settings?.agencyName || 'Agency';

  return (
    <section id="about" className="py-32 bg-primary relative overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-6 block">
              The Agency Narrative
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[1.2]">
              Architecting <span className="text-gradient">Human-Centric</span> Digital Ecosystems.
            </h2>
            <p className="text-lg text-white/40 leading-relaxed mb-10">
              {agencyName} was born out of a passion for bridging the gap between complex 
              technology and intuitive human experiences. We don't just build software; 
              we craft digital journeys that empower brands and resonate with users globally.
            </p>

            <div className="space-y-8">
              {values.map((value, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-xl glass-effect flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{value.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Interactive Visuals/Stats */}
          <motion.div 
            style={{ scale, opacity }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="glass-effect p-8 rounded-[2.5rem] flex flex-col items-center text-center group border-white/5 hover:border-white/20 transition-all duration-500"
                  data-magnetic
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent-cyan mb-4 group-hover:bg-accent-cyan/10 transition-colors">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-2 group-hover:text-gradient transition-all duration-500">
                    {stat.value}
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Floating Glass Illustration Card */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-cyan/5 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
