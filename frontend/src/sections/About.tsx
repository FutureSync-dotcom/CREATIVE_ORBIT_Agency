import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Target, Eye, Zap, ShieldCheck, Globe, Users, Orbit } from 'lucide-react';
import { cn } from '../utils/cn';
import { AboutCard } from '../components/AboutCard';

const stats = [
  { label: 'Global Clients', value: 150, suffix: '+', icon: <Globe size={24} /> },
  { label: 'Projects Done', value: 320, suffix: '+', icon: <Zap size={24} /> },
  { label: 'Team Experts', value: 45, suffix: '+', icon: <Users size={24} /> },
  { label: 'Client Success', value: 99, suffix: '%', icon: <ShieldCheck size={24} /> },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function About({ settings }: { settings: any }) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const agencyName = settings?.agencyName || 'Agency';

  return (
    <section id="about" className="py-32 bg-primary relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[150px] rounded-full pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Side: Text Narrative (5 Columns) */}
          <div className="lg:col-span-5 space-y-10 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 md:mb-6 block">
                Innovative Agency
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 md:mb-8 leading-[1.1]">
                Redefining the <span className="text-gradient">Digital</span> Frontier.
              </h2>
              <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-xl">
                {agencyName} isn't just a development studio. We are architects of the future, 
                blending deep technical prowess with artistic vision to create ecosystems 
                that breathe life into brands.
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              <AboutCard delay={0.2} className="p-5 md:p-6">
                <div className="flex gap-5 md:gap-6 items-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan shrink-0">
                    <Target size={24} className="md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-1">Precision Engineering</h4>
                    <p className="text-white/40 text-xs md:text-sm">Clean, scalable architectures built for tomorrow.</p>
                  </div>
                </div>
              </AboutCard>

              <AboutCard delay={0.3} className="p-5 md:p-6">
                <div className="flex gap-5 md:gap-6 items-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple shrink-0">
                    <Eye size={24} className="md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-1">Visionary Design</h4>
                    <p className="text-white/40 text-xs md:text-sm">Experiences that resonate and convert at first sight.</p>
                  </div>
                </div>
              </AboutCard>
            </div>
          </div>

          {/* Right Side: Bento Grid Stats (7 Columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 h-full">
            {/* Large Stat Card */}
            <AboutCard delay={0.4} className="sm:col-span-1 h-[240px] md:h-[300px] flex flex-col justify-center items-center text-center p-6">
              <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-full bg-white/5 text-accent-cyan">
                <Orbit size={36} className="md:w-12 md:h-12 animate-spin-slow" />
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">
                <Counter value={stats[1].value} suffix={stats[1].suffix} />
              </h3>
              <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-white/30">{stats[1].label}</p>
            </AboutCard>

            {/* Small Stat Cards Column */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <AboutCard delay={0.5} className="h-[120px] md:h-[140px] flex items-center gap-4 md:gap-6 p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent-cyan shrink-0">
                  {stats[0].icon}
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold"><Counter value={stats[0].value} suffix={stats[0].suffix} /></h4>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/20">{stats[0].label}</p>
                </div>
              </AboutCard>

              <AboutCard delay={0.6} className="h-[120px] md:h-[140px] flex items-center gap-4 md:gap-6 p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent-cyan shrink-0">
                  {stats[2].icon}
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold"><Counter value={stats[2].value} suffix={stats[2].suffix} /></h4>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/20">{stats[2].label}</p>
                </div>
              </AboutCard>
            </div>

            {/* Wide Full Success Card */}
            <AboutCard delay={0.7} className="sm:col-span-2 h-auto md:h-[180px] flex flex-col md:flex-row items-center justify-between p-8 md:px-12 bg-gradient-to-br md:bg-gradient-to-r from-accent-cyan/10 to-transparent gap-8">
              <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center text-accent-cyan shrink-0">
                  <ShieldCheck size={28} className="md:w-8 md:h-8" />
                </div>
                <div>
                  <h4 className="text-4xl md:text-5xl font-display font-bold leading-none mb-2">
                    <Counter value={stats[3].value} suffix={stats[3].suffix} />
                  </h4>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/30">{stats[3].label}</p>
                </div>
              </div>
              <div className="hidden lg:block">
                <motion.div 
                  style={{ rotate }}
                  className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-accent-cyan/20 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
                </motion.div>
              </div>
            </AboutCard>
          </div>

        </div>
      </div>
    </section>
  );
}
