import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu } from 'lucide-react';
import { cn } from '../utils/cn';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Packages', href: '#packages' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Navigation({ settings }: { settings: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const agencyName = settings?.agencyName || 'Agency';
  const half = Math.ceil(agencyName.length / 2);
  const firstHalf = agencyName.slice(0, half);
  const secondHalf = agencyName.slice(half);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        scrolled ? 'py-3' : 'py-6'
      )}
    >
      <div className={cn(
        'max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500',
        scrolled ? 'glass-effect border-white/5' : 'bg-transparent'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer" data-magnetic>
          <div className="w-10 h-10 bg-accent-cyan/10 rounded-xl flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan/20 transition-all duration-300">
            <Cpu size={24} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight uppercase">
            {firstHalf}<span className="text-accent-cyan">{secondHalf}</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                const id = link.href.replace('#', '');
                if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
                else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-white/70 hover:text-accent-cyan transition-colors"
              data-magnetic
            >
              {link.name}
            </a>
          ))}
          <button className="px-6 py-2 bg-accent-cyan text-primary font-bold rounded-full text-sm hover:scale-105 transition-transform active:scale-95" data-magnetic>
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 glass-effect rounded-3xl p-8 flex flex-col items-center gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-white/70"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="w-full py-3 bg-accent-cyan text-primary font-bold rounded-full">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
