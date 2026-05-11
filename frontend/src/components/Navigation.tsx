import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Packages', href: '#packages' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Navigation({ settings, hasProjects }: { settings: any, hasProjects: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  const filteredNavLinks = navLinks.filter(link => {
    if (link.name === 'Portfolio' && !hasProjects) return false;
    return true;
  });

  const agencyName = settings?.agencyName || 'Agency';
  const half = Math.ceil(agencyName.length / 2);
  const firstHalf = agencyName.slice(0, half);
  const secondHalf = agencyName.slice(half);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active Section Tracking
      const sections = filteredNavLinks.map(link => {
        const id = link.href.replace('#', '');
        if (!id) return { name: 'Home', offset: 0 };
        const el = document.getElementById(id);
        return { name: link.name, offset: el?.offsetTop || 0 };
      });

      const currentScroll = window.scrollY + 100;
      const current = sections.reduce((prev, curr) => {
        return (currentScroll >= curr.offset) ? curr : prev;
      });
      
      setActiveSection(current.name);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredNavLinks]);

  // Handle cross-page hash scrolling
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const offset = el.offsetTop - 100;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname, location.hash]);

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      if (link.href === '#') {
        navigate('/');
      } else {
        navigate('/' + link.href);
      }
      return;
    }

    const id = link.href.replace('#', '');
    if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
    else {
      const el = document.getElementById(id);
      if (el) {
        const offset = el.offsetTop - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      } else {
        navigate('/' + link.href);
      }
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-4 md:px-6 py-4',
        scrolled ? 'py-2 md:py-3' : 'py-6 md:py-8'
      )}
    >
      <div className={cn(
        'max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-2 md:py-3 rounded-full transition-all duration-700 border border-transparent',
        scrolled ? 'glass-card border-white/5 shadow-2xl scale-[0.98]' : 'bg-transparent'
      )}>
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 md:gap-3 group cursor-pointer" 
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-40 md:w-56 h-12 md:h-16 flex items-center justify-center overflow-hidden relative">
            <img src="/logo.png?v=1.3" alt="Creative Orbit" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" style={{ filter: 'brightness(1.2)' }} />
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-1 xl:gap-2">
          {filteredNavLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <button
                onClick={() => handleLinkClick(link)}
                className={cn(
                  "px-4 lg:px-5 py-2.5 text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all duration-500 relative z-10 whitespace-nowrap",
                  activeSection === link.name ? "text-primary" : "text-white/40 hover:text-white"
                )}
              >
                {link.name}
              </button>
              
              {activeSection === link.name && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-white rounded-full -z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                />
              )}
            </motion.div>
          ))}
          
          <div className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-white/10">
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) {
                  const offset = el.offsetTop - 100;
                  window.scrollTo({ top: offset, behavior: 'smooth' });
                } else {
                  navigate('/#contact');
                }
              }}
              className="group px-4 lg:px-6 py-2.5 bg-accent-cyan text-primary font-bold rounded-full text-[10px] lg:text-xs hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)] whitespace-nowrap"
            >
              Get Started
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "xl:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            isOpen ? "bg-white text-primary" : "bg-white/5 text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-20 left-4 right-4 glass-card rounded-[2rem] p-8 flex flex-col items-center gap-6 xl:hidden border-white/5 shadow-2xl z-[60]"
          >
            {filteredNavLinks.map((link, i) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "text-xl font-display font-bold transition-all",
                  activeSection === link.name ? "text-accent-cyan" : "text-white/30 hover:text-white"
                )}
                onClick={() => handleLinkClick(link)}
              >
                {link.name}
              </motion.button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                const el = document.getElementById('contact');
                if (el) {
                  const offset = el.offsetTop - 100;
                  window.scrollTo({ top: offset, behavior: 'smooth' });
                } else {
                  navigate('/#contact');
                }
              }}
              className="w-full py-4 bg-accent-cyan text-primary font-bold rounded-2xl text-xs uppercase tracking-widest shadow-lg"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
