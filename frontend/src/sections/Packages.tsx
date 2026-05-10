import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Rocket, Crown, Star, Smartphone, Code2, PenTool, Layout, Video, Search, Type, Printer, Monitor, X, Loader2, CheckCircle2, Send } from 'lucide-react';
import { cn } from '../utils/cn';
import { PackageCard } from '../components/PackageCard';

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
      description: 'High-end responsive website design and development with modern tech stack.',
      features: ['Website Design & Development', 'Custom UI Components', 'CMS Integration', 'Mobile Optimization', 'Basic SEO'],
      icon: <Code2 size={24} />,
      color: 'cyan',
      popular: true
    },
    {
      name: 'App Ecosystem',
      price: '$3,500',
      description: 'Full-scale mobile and web application development for established brands.',
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
      description: 'Establish your visual identity with professional, modern logo design.',
      features: ['Logo Design (3 Concepts)', 'Vector Source Files', 'Brand Color Palette', 'Typography Guide'],
      icon: <PenTool size={24} />,
      color: 'purple',
      popular: true
    },
    {
      name: 'Corporate Identity',
      price: '$950',
      description: 'Complete branding suite including high-end stationery and digital assets.',
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
      description: 'User-centric product design and comprehensive interface architecture.',
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
      description: 'Engaging, professional animations designed to tell your unique brand story.',
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
      description: 'Drive high-quality traffic and professionally manage your social presence.',
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
      description: 'Professional content creation and high-quality physical print services.',
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
      description: 'Secure, reliable, and high-performance cloud hosting for your web application.',
      features: ['High-Uptime Hosting', 'Free SSL Certificate', 'Automated Backups', 'Global CDN Integration', '24/7 Monitoring'],
      icon: <Monitor size={24} />,
      color: 'cyan',
      popular: true
    },
    {
      name: 'Enterprise Cloud',
      price: '$199/mo',
      description: 'Scalable, high-security cloud infrastructure for enterprise-level platforms.',
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
    glow: 'shadow-[0_0_50px_rgba(0,242,255,0.1)]',
    button: 'bg-accent-cyan text-primary'
  },
  purple: {
    accent: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
    border: 'hover:border-accent-purple/40',
    glow: 'shadow-[0_0_50px_rgba(112,0,255,0.1)]',
    button: 'bg-accent-purple text-white'
  },
  orange: {
    accent: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'hover:border-orange-500/40',
    glow: 'shadow-[0_0_50px_rgba(249,115,22,0.1)]',
    button: 'bg-orange-500 text-white'
  },
  pink: {
    accent: 'text-pink-500',
    bg: 'bg-pink-500/10',
    border: 'hover:border-pink-500/40',
    glow: 'shadow-[0_0_50px_rgba(236,72,153,0.1)]',
    button: 'bg-pink-500 text-white'
  },
  blue: {
    accent: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'hover:border-blue-400/40',
    glow: 'shadow-[0_0_50px_rgba(96,165,250,0.1)]',
    button: 'bg-blue-400 text-white'
  },
  emerald: {
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'hover:border-emerald-400/40',
    glow: 'shadow-[0_0_50px_rgba(52,211,153,0.1)]',
    button: 'bg-emerald-400 text-white'
  }
};

export function Packages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Web & Mobile Dev');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        if (!res.ok) throw new Error('Failed to fetch packages');
        const data = await res.json();
        if (data && data.length > 0) {
          setPackages(data);
          setActiveCategory(data[0].category);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Use backend data if available, fallback to hardcoded
  const finalPackages = packages.length > 0 ? packages : Object.entries(packagesData).flatMap(([cat, pkgs]) => pkgs.map(p => ({ ...p, category: cat })));
  const finalCategories = packages.length > 0 ? Array.from(new Set(packages.map(p => p.category))) : categories;

  const groupedPackages = finalPackages.reduce((acc: any, pkg: any) => {
    if (!acc[pkg.category]) acc[pkg.category] = [];
    acc[pkg.category].push(pkg);
    return acc;
  }, {});

  const getIcon = (iconName: string) => {
    const Icons: any = { Code2, Smartphone, PenTool, Star, Layout, Video, Search, Type, Monitor, Crown };
    const IconComp = Icons[iconName] || Code2;
    return <IconComp size={24} />;
  };

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
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-3 md:mb-4 block"
          >
            Pricing Plans
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4 md:mb-6"
          >
            Service <span className="text-gradient">Packages</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-base md:text-lg px-4 md:px-0"
          >
            Choose the package that aligns with the expertise you need. 
            All plans are designed for maximum brand impact and ROI.
          </motion.p>
        </div>

        {/* Categories mapped directly from Expertise */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-20"
        >
          {finalCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border",
                activeCategory === cat 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-transparent border-white/5 text-white/40 hover:border-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          <AnimatePresence>
            {groupedPackages[activeCategory]?.map((pkg: any, index: number) => {
              const style = domainStyles[pkg.color as keyof typeof domainStyles] || domainStyles.cyan;
              // If it's a backend package, map the icon
              const displayPkg = {
                ...pkg,
                icon: typeof pkg.icon === 'string' ? getIcon(pkg.icon) : pkg.icon
              };
              
              return (
                <motion.div
                  key={`${activeCategory}-${pkg.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="h-full"
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }}
                >
                  <PackageCard 
                    pkg={displayPkg} 
                    style={style} 
                    index={index} 
                    onOrder={() => handleOrder(displayPkg)} 
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md sm:max-w-lg glass-card rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <div>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white">Order: {selectedPackage.name}</h2>
                    <p className="text-white/40 text-xs md:text-sm">You are ordering the <span className="text-accent-cyan font-bold">{selectedPackage.price}</span> plan.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>

                {success ? (
                  <div className="py-10 md:py-12 text-center space-y-4 md:space-y-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mx-auto">
                      <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-display font-bold">Order Received!</h3>
                      <p className="text-white/40 text-xs md:text-sm max-w-[250px] mx-auto">Our team will reach out to you within 24 hours to begin the onboarding process.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="space-y-2 group">
                      <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 outline-none focus:border-accent-cyan/50 text-white transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 outline-none focus:border-accent-cyan/50 text-white transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Requirements (Optional)</label>
                      <textarea 
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 md:py-5 outline-none focus:border-accent-cyan/50 text-white resize-none transition-all text-sm"
                        placeholder="Any specific requests?"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 md:py-5 bg-accent-cyan text-primary font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-[10px] md:text-xs"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                          Confirm Order
                          <Send size={16} className="md:w-[18px] md:h-[18px]" />
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
