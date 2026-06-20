import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Share2, Loader2, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export function Contact({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email Us', value: settings?.contactEmail || 'contact@agency.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Call Us', value: settings?.phone || '+1 (555) 000-0000' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Our Office', value: settings?.address || 'Digital Nomad Valley, CA' },
  ];

  const socialIcons = {
    twitter: <Share2 size={18} className="md:w-5 md:h-5" />,
    linkedin: <Share2 size={18} className="md:w-5 md:h-5" />,
    instagram: <Share2 size={18} className="md:w-5 md:h-5" />,
    github: <Share2 size={18} className="md:w-5 md:h-5" />,
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Web & Mobile Dev',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'Contact',
          source: 'Creative Orbit'
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: 'Web & Mobile Dev', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={containerRef} className="py-32 bg-primary relative overflow-hidden">
      {/* Innovative Parallax Background Elements */}
      <motion.div style={{ y: y1, opacity }} className="absolute top-20 right-10 pointer-events-none">
        <Sparkles className="text-accent-cyan/20 w-32 h-32 blur-sm" />
      </motion.div>
      <motion.div style={{ y: y2, opacity }} className="absolute bottom-20 left-10 pointer-events-none">
        <MessageSquare className="text-accent-purple/20 w-40 h-40 blur-md" />
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Contact Info */}
          <div className="space-y-10 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4 md:mb-6 block">
                Let's Connect
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-bold mb-6 md:mb-8 leading-[1.1]">
                Have a Vision? <br />
                <span className="text-gradient">Let's Build It.</span>
              </h2>
              <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-md mx-auto md:mx-0">
                Whether you're looking for a full-scale digital ecosystem or a specialized 
                design revamp, our team is ready to accelerate your journey.
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              {contactInfo.map((info, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center text-center sm:text-left group cursor-pointer"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/30 group-hover:text-accent-cyan transition-all duration-500">
                    {info.icon}
                  </div>
                  <div>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-1 group-hover:text-accent-cyan transition-colors">
                      {info.label}
                    </span>
                    <span className="text-lg md:text-xl font-medium text-white/80 group-hover:text-white transition-colors break-all">
                      {info.value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 }}
              className="flex justify-center md:justify-start gap-4"
            >
              {Object.entries(settings?.socialLinks || {}).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a 
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-accent-cyan hover:border-accent-cyan/30 hover:bg-accent-cyan/5 transition-all duration-300"
                  >
                    {socialIcons[platform as keyof typeof socialIcons] || <Share2 size={18} className="md:w-5 md:h-5" />}
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Right Side: Contact Form (with 3D Tilt Innovation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <AnimatePresence mode='wait'>
                {success ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12 md:py-20 text-center space-y-6"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-4 animate-bounce">
                      <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-display font-bold">Message Sent!</h3>
                      <p className="text-white/40 text-sm md:text-base">We've received your vision and will respond shortly.</p>
                    </div>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-bold transition-all"
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 md:space-y-8 relative z-10"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2 group">
                        <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/10 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Project Domain
                      </label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white/60 appearance-none cursor-pointer text-sm"
                      >
                        <option>Web & Mobile Dev</option>
                        <option>Logo & Branding</option>
                        <option>UI/UX Design</option>
                        <option>Hosting & Deployment</option>
                      </select>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        How can we help?
                      </label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your project vision..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/10 resize-none text-sm"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 md:py-5 bg-accent-cyan text-primary font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-3 group/btn hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-[10px] md:text-xs"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                          Send Vision
                          <Send className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Innovative Floating Element */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 md:-top-10 md:-right-10 w-16 h-16 md:w-24 md:h-24 bg-accent-cyan/10 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl z-20 pointer-events-none"
            >
              <Send className="text-accent-cyan w-6 h-6 md:w-10 md:h-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
