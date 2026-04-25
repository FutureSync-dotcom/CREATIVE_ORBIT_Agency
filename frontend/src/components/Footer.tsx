import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Share2, ArrowUp, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

const footerLinks = {
  Services: [
    { name: 'Web Development', href: '#services' },
    { name: 'Mobile Apps', href: '#services' },
    { name: 'UI/UX Design', href: '#services' },
    { name: 'Cloud Hosting', href: '#services' },
  ],
  Company: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Work', href: '#portfolio' },
    { name: 'Packages', href: '#packages' },
    { name: 'Contact', href: '#contact' },
  ],
  Resources: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Documentation', href: '#' },
  ]
};

export function Footer({ settings }: { settings: any }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const agencyName = settings?.agencyName || 'Agency';
  const half = Math.ceil(agencyName.length / 2);
  const firstHalf = agencyName.slice(0, half);
  const secondHalf = agencyName.slice(half);

  return (
    <footer className="relative bg-primary pt-20 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Logo & Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={scrollToTop}>
              <div className="w-10 h-10 rounded-xl bg-accent-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)] group-hover:scale-110 transition-transform">
                <Zap className="text-primary w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tighter text-white uppercase">
                {firstHalf}<span className="text-accent-cyan">{secondHalf}</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              {settings?.tagline || 'Architecting the next generation of digital ecosystems with precision, passion, and future-ready technology.'}
            </p>
            <div className="flex gap-4">
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/30 hover:text-accent-cyan transition-all">
                  <Share2 size={18} />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/30 hover:text-accent-cyan transition-all">
                  <Share2 size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-white/40 hover:text-accent-cyan transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent-cyan scale-0 group-hover:scale-100 transition-transform" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-white/20 text-xs tracking-wide text-center md:text-left">
            © 2026 {agencyName} Software Agency. Built for the Digital Future.
          </p>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            data-magnetic
          >
            Back to top
            <div className="w-10 h-10 rounded-full glass-effect flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-primary transition-all">
              <ArrowUp size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
