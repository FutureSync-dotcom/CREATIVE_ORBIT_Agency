import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../utils/cn';

interface ServiceCardProps {
  service: {
    title: string;
    category: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  };
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="glass-card group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] w-[280px] md:w-[350px] shrink-0 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute -top-16 md:-top-24 -right-16 md:-right-24 w-32 md:w-48 h-32 md:h-48 rounded-full blur-[60px] md:blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br",
        service.color
      )} />

      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        <div className={cn(
          "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 bg-white/5 border border-white/10 transition-all duration-500 group-hover:scale-110 group-hover:border-accent-cyan/30 group-hover:shadow-[0_0_30px_rgba(0,242,255,0.1)]",
        )}>
          <div className="text-accent-cyan group-hover:scale-110 transition-transform duration-500">
            {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 md:w-8 md:h-8" })}
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-display font-bold mb-3 md:mb-4 group-hover:text-accent-cyan transition-colors">
          {service.title}
        </h3>
        
        <p className="text-white/40 text-xs md:text-sm leading-relaxed group-hover:text-white/70 transition-colors line-clamp-3">
          {service.description}
        </p>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-accent-cyan opacity-50 group-hover:opacity-100 transition-opacity">
            {service.category}
          </span>
          <motion.div 
            whileHover={{ x: 5 }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent-cyan/5 border border-accent-cyan/10 flex items-center justify-center text-accent-cyan text-[10px] md:text-xs group-hover:bg-accent-cyan group-hover:text-primary transition-all duration-300"
          >
            →
          </motion.div>
        </div>
      </div>

      {/* 3D Reflection Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      />
    </motion.div>
  );
}
