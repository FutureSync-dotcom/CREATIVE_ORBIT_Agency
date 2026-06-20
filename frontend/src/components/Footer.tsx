import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Share2, ArrowUp, Zap, MessageCircle } from 'lucide-react';
import { cn } from '../utils/cn';

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const footerLinks = {
  Resources: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-conditions' },
  ],
  Contact: [
    { name: 'info@creativeorbit.co.uk', href: 'mailto:info@creativeorbit.co.uk', icon: <Mail size={14} /> },
    { name: '020 3932 2335', href: 'tel:02039322335', icon: <Phone size={14} /> },
    { name: '07412 842430', href: 'https://wa.me/447412842430', icon: <WhatsAppIcon size={14} /> },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 md:mb-20">
          
          {/* Logo & Info */}
          <div className="space-y-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 group cursor-pointer" onClick={scrollToTop}>
              <div className="w-40 md:w-56 h-12 md:h-16 flex items-center justify-center overflow-hidden relative">
                <img src="/logo.png?v=1.3" alt="Creative Orbit" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" style={{ filter: 'brightness(1.2)' }} />
              </div>
            </div>
            <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              {settings?.tagline || 'Architecting the next generation of digital ecosystems with precision, passion, and future-ready technology.'}
            </p>
            <div className="flex justify-center sm:justify-start gap-4">
              {Object.entries(settings?.socialLinks || {}).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a 
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/30 hover:text-accent-cyan transition-all"
                  >
                    <Share2 size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="text-center sm:text-left">
              <h4 className="text-white font-bold mb-4 md:mb-6 text-[10px] md:text-xs uppercase tracking-[0.2em]">{title}</h4>
              <ul className="space-y-3 md:space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-white/40 hover:text-accent-cyan transition-colors text-xs md:text-sm flex items-center justify-center sm:justify-start gap-2 group"
                    >
                      {(link as any).icon ? (
                        <span className="text-accent-cyan opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0">
                          {(link as any).icon}
                        </span>
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-accent-cyan scale-0 group-hover:scale-100 transition-transform shrink-0" />
                      )}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <p className="text-white/20 text-[10px] md:text-xs tracking-wide text-center md:text-left">
            © 2026 {agencyName} Software Agency. Built for the Digital Future.
          </p>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-white/30 hover:text-white transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest"
            data-magnetic
          >
            Back to top
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full glass-effect flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-primary transition-all">
              <ArrowUp size={14} className="md:w-4 md:h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
