import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface PackageCardProps {
  pkg: {
    name: string;
    price: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
    color: string;
    popular: boolean;
  };
  style: {
    accent: string;
    bg: string;
    border: string;
    glow: string;
    button: string;
  };
  index: number;
  onOrder: () => void;
}

export function PackageCard({ pkg, style, index, onOrder }: PackageCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
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
      className={cn(
        "glass-card group relative p-10 rounded-[3rem] flex flex-col h-full transition-all duration-500",
        style.border,
        pkg.popular && "border-white/20 z-10"
      )}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className={cn(
          "absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl z-20",
          style.button
        )}>
          Best Seller
        </div>
      )}

      <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex flex-col h-full">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-white/10 transition-all duration-500 group-hover:scale-110",
          style.accent
        )}>
          {pkg.icon}
        </div>

        <h3 className="text-3xl font-display font-bold mb-2 group-hover:text-accent-cyan transition-colors">{pkg.name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-display font-extrabold text-white">{pkg.price}</span>
        </div>

        {pkg.description && (
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            {pkg.description}
          </p>
        )}

        <div className="relative mb-10 flex-grow isolate">
          <div 
            onWheel={(e) => e.stopPropagation()}
            className="h-[280px] overflow-y-auto custom-scrollbar pr-2 features-mask space-y-4 overscroll-contain touch-pan-y relative z-20"
          >
            {pkg.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 group/feat">
                <div className={cn("mt-1 shrink-0 transition-transform group-hover/feat:scale-110", style.accent)}>
                  <Check size={18} />
                </div>
                <span className="text-sm text-white/60 group-hover/feat:text-white transition-colors">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onOrder}
          className={cn(
            "w-full py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs",
            pkg.popular ? style.button : "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
          )}
        >
          Get Started
        </button>
      </div>

      {/* Decorative Glow */}
      <div className={cn(
        "absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
        style.glow
      )} />
    </motion.div>
  );
}
