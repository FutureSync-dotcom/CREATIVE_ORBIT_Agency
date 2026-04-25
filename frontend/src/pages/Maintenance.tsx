import { motion } from 'framer-motion';
import { Settings, Zap, Mail } from 'lucide-react';

export const Maintenance = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 blur-[120px] rounded-full" />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Animated Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan"
              >
                <Settings size={48} />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-white shadow-lg shadow-accent-purple/40"
              >
                <Zap size={16} />
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Under <span className="text-accent-cyan">Maintenance</span>
            </h1>
            <p className="text-xl text-white/40 max-w-lg mx-auto leading-relaxed">
              We're currently upgrading our platform to serve you better. 
              Our digital agency will be back online shortly.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect px-6 py-4 rounded-2xl border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Contact Us</p>
                <p className="text-sm font-bold text-white">contact@agency.com</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-center gap-6 text-white/20">
            <p className="text-xs font-bold uppercase tracking-[0.3em]">Agency Ecosystem</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
