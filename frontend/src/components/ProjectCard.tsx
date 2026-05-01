import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface ProjectCardProps {
  project: {
    title: string;
    category: string;
    image: string;
    description: string;
    link?: string;
    tags?: string[];
  };
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      exit={{ opacity: 0, scale: 0.9 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-[400px] md:h-[500px] w-full rounded-[2rem] md:rounded-[2.5rem] cursor-pointer"
    >
      {/* Background Image with Parallax-ish Scale */}
      <div 
        style={{
          transform: "translateZ(-50px)",
        }}
        className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden"
      >
        <motion.div 
          className="w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </motion.div>
      </div>

      {/* Glass Content Card */}
      <div 
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between"
      >
        {/* Top Section: Category & Link */}
        <div className="flex justify-between items-start">
          <motion.span 
            style={{ transform: "translateZ(20px)" }}
            className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan backdrop-blur-md"
          >
            {project.category}
          </motion.span>
          
          <motion.div 
            style={{ transform: "translateZ(30px)" }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-accent-cyan group-hover:text-primary group-hover:border-accent-cyan transition-all duration-500"
          >
            <ArrowUpRight size={20} className="md:w-6 md:h-6 group-hover:rotate-45 transition-transform duration-500" />
          </motion.div>
        </div>

        {/* Bottom Section: Title & Description */}
        <div className="space-y-3 md:space-y-4">
          <motion.div 
            style={{ transform: "translateZ(40px)" }}
            className="space-y-1 md:space-y-2"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-accent-cyan transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed line-clamp-2 max-w-[95%] md:max-w-[90%]">
              {project.description}
            </p>
          </motion.div>

          <motion.div 
            style={{ transform: "translateZ(25px)" }}
            className="flex flex-wrap gap-2 pt-1 md:pt-2"
          >
            {project.tags?.map((tag) => (
              <span key={tag} className="text-[8px] md:text-[9px] font-medium text-white/40 uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 group-hover:border-accent-cyan/30 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}
