import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Share2, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function Contact({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email Us', value: settings?.contactEmail || 'contact@agency.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Call Us', value: settings?.phone || '+1 (555) 000-0000' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Our Office', value: settings?.address || 'Digital Nomad Valley, CA' },
  ];
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
          type: 'Contact'
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
    <section id="contact" className="py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan mb-6 block">
              Let's Connect
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[1.2]">
              Have a Vision? <br />
              <span className="text-gradient">Let's Build It.</span>
            </h2>
            <p className="text-lg text-white/40 leading-relaxed mb-12 max-w-md">
              Whether you're looking for a full-scale digital ecosystem or a specialized 
              design revamp, our team is ready to accelerate your journey.
            </p>

            <div className="space-y-8 mb-12">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex gap-6 items-center group">
                  <div className="w-12 h-12 rounded-xl glass-effect flex items-center justify-center shrink-0 group-hover:bg-accent-cyan/10 group-hover:text-accent-cyan transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 block mb-1">
                      {info.label}
                    </span>
                    <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">
                      {info.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/30 hover:text-accent-cyan transition-all">
                  <Share2 size={18} />
                </a>
              )}
              {settings?.socialLinks?.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/30 hover:text-accent-cyan transition-all">
                  <Share2 size={18} />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-effect p-8 md:p-12 rounded-[3rem] border-white/5 relative"
          >
            <AnimatePresence mode='wait'>
              {success ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Message Received!</h3>
                  <p className="text-white/40">We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-accent-cyan text-sm font-bold mt-4 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/10"
                      />
                    </div>
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                      Project Domain
                    </label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white/40 appearance-none"
                    >
                      <option>Web & Mobile Dev</option>
                      <option>Logo & Branding</option>
                      <option>UI/UX Design</option>
                      <option>Hosting & Deployment</option>
                    </select>
                  </div>

                  <div className="space-y-2 relative group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                      How can we help?
                    </label>
                    <textarea 
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your vision..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/10 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-accent-cyan text-primary font-bold rounded-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                    data-magnetic
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Decorative Glow */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-accent-cyan/10 blur-[80px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
