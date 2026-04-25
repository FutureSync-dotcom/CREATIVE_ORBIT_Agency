import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Rocket, Crown, Star, Smartphone, Code2, PenTool, Layout, Video, Search, Type, Printer, Monitor, X, Loader2, CheckCircle2, Send } from 'lucide-react';
import { cn } from '../utils/cn';

const categories = [
  'Web & Mobile Dev',
  'Logo & Identity',
  'UI/UX Design',
  'Motion & Animation',
  'SEO & SMM',
  'Content & Print',
  'Deployment & Hosting'
];

const packagesData = {
  'Web & Mobile Dev': [
    {
      name: 'Dynamic Web',
      price: '$1,200',
      description: 'High-end responsive website design and development.',
      features: ['Website Design & Development', 'Custom UI Components', 'CMS Integration', 'Mobile Optimization', 'Basic SEO'],
      icon: <Code2 size={24} />,
      color: 'cyan',
      popular: true
    },
    {
      name: 'App Ecosystem',
      price: '$3,500',
      description: 'Full-scale mobile and web application development.',
      features: ['Mobile Application Development', 'Cross-platform (iOS/Android)', 'API Integration', 'Backend Support', 'App Store Submission'],
      icon: <Smartphone size={24} />,
      color: 'cyan',
      popular: false
    }
  ],
  'Logo & Identity': [
    {
      name: 'Essential Brand',
      price: '$450',
      description: 'Establish your visual identity with professional logo design.',
      features: ['Logo Design (3 Concepts)', 'Vector Source Files', 'Brand Color Palette', 'Typography Guide'],
      icon: <PenTool size={24} />,
      color: 'purple',
      popular: true
    },
    {
      name: 'Corporate Identity',
      price: '$950',
      description: 'Complete branding suite including stationery design.',
      features: ['Premium Logo Design', 'Stationery Design', 'Business Card Design', 'Letterhead & Envelopes', 'Brand Guidelines'],
      icon: <Star size={24} />,
      color: 'purple',
      popular: false
    }
  ],
  'UI/UX Design': [
    {
      name: 'Product Design',
      price: '$1,800',
      description: 'User-centric product design and interface architecture.',
      features: ['Product Design (UX)', 'UI Interface Design', 'Interactive Prototypes', 'User Journey Mapping', 'Design System'],
      icon: <Layout size={24} />,
      color: 'blue',
      popular: true
    }
  ],
  'Motion & Animation': [
    {
      name: 'Motion Graphics',
      price: '$1,500',
      description: 'Engaging animations to tell your brand story.',
      features: ['2D/3D Animation', 'Motion Graphic Design', 'Video Editing', 'Sound Design', 'Social Media Shorts'],
      icon: <Video size={24} />,
      color: 'pink',
      popular: true
    }
  ],
  'SEO & SMM': [
    {
      name: 'Digital Growth',
      price: '$800/mo',
      description: 'Drive traffic and manage your social presence.',
      features: ['Search Engine Optimization', 'Social Media Marketing', 'Community Management', 'Monthly Analytics', 'Ad Campaign Setup'],
      icon: <Search size={24} />,
      color: 'orange',
      popular: true
    }
  ],
  'Content & Print': [
    {
      name: 'Creative Content',
      price: '$600/mo',
      description: 'Professional content and high-quality print services.',
      features: ['Content Writing', 'Copywriting', 'Printing Services', 'Brochure Design', 'Flyer & Poster Design'],
      icon: <Type size={24} />,
      color: 'emerald',
      popular: true
    }
  ],
  'Deployment & Hosting': [
    {
      name: 'Managed Hosting',
      price: '$49/mo',
      description: 'Secure, reliable cloud hosting for your web application.',
      features: ['High-Uptime Hosting', 'Free SSL Certificate', 'Automated Backups', 'Global CDN Integration', '24/7 Monitoring'],
      icon: <Monitor size={24} />,
      color: 'cyan',
      popular: true
    },
    {
      name: 'Enterprise Cloud',
      price: '$199/mo',
      description: 'Scalable cloud infrastructure for high-traffic platforms.',
      features: ['Auto-scaling Clusters', 'Custom CI/CD Pipeline', 'Premium Security Suite', 'Load Balancing', 'Dedicated Support Engineer'],
      icon: <Crown size={24} />,
      color: 'cyan',
      popular: false
    }
  ]
};

const domainStyles = {
  cyan: {
    accent: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'hover:border-accent-cyan/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,242,255,0.15)]',
    button: 'bg-accent-cyan text-primary'
  },
  purple: {
    accent: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
    border: 'hover:border-accent-purple/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(112,0,255,0.15)]',
    button: 'bg-accent-purple text-white'
  },
  orange: {
    accent: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'hover:border-orange-500/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]',
    button: 'bg-orange-500 text-white'
  },
  pink: {
    accent: 'text-pink-500',
    bg: 'bg-pink-500/10',
    border: 'hover:border-pink-500/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]',
    button: 'bg-pink-500 text-white'
  },
  blue: {
    accent: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'hover:border-blue-400/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]',
    button: 'bg-blue-400 text-white'
  },
  emerald: {
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'hover:border-emerald-400/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    button: 'bg-emerald-400 text-white'
  }
};

export function Packages() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof packagesData>('Web & Mobile Dev');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleOrder = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: `Order: ${selectedPackage.name} (${selectedPackage.price})`,
          type: 'Order'
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          setFormData({ name: '', email: '', message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="packages" className="py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Service <span className="text-gradient">Packages</span>
          </motion.h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Choose the package that aligns with the expertise you need. 
            All plans are designed for maximum brand impact.
          </p>
        </div>

        {/* Categories mapped directly from Expertise */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border",
                activeCategory === cat 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-transparent border-white/5 text-white/40 hover:border-white/10"
              )}
              data-magnetic
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {packagesData[activeCategory]?.map((pkg, index) => {
              const style = domainStyles[pkg.color as keyof typeof domainStyles];
              return (
                <motion.div
                  key={`${activeCategory}-${pkg.name}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "glass-effect group relative p-10 rounded-[3rem] flex flex-col transition-all duration-500 border-white/5",
                    style.border,
                    style.glow,
                    pkg.popular && "border-white/20 z-10"
                  )}
                >
                  {pkg.popular && (
                    <div className={cn(
                      "absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl",
                      style.button
                    )}>
                      Best Seller
                    </div>
                  )}

                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8", style.bg, style.accent)}>
                    {pkg.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold">{pkg.price}</span>
                  </div>

                  <p className="text-white/40 text-sm leading-relaxed mb-8">
                    {pkg.description}
                  </p>

                  <div className="space-y-4 mb-10 flex-grow">
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={cn("mt-1 shrink-0", style.accent)}>
                          <Check size={16} />
                        </div>
                        <span className="text-sm text-white/60">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleOrder(pkg)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                      pkg.popular ? style.button : "bg-white/5 text-white hover:bg-white/10"
                    )} 
                    data-magnetic
                  >
                    Get Started
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-effect rounded-[2.5rem] shadow-2xl overflow-hidden border-white/10"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Order: {selectedPackage.name}</h2>
                    <p className="text-white/40 text-sm">You are ordering the {selectedPackage.price} plan.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {success ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold">Order Submitted!</h3>
                    <p className="text-white/40">We will contact you shortly to finalize details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Requirements (Optional)</label>
                      <textarea 
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent-cyan/50 text-white resize-none"
                        placeholder="Any specific requests?"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-accent-cyan text-primary font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                          Confirm Order
                          <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
