import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Loader2, Package as PackageIcon, Layers, DollarSign, List } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { cn } from '../utils/cn';

export function Packages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    features: '',
    icon: 'Code2',
    color: 'cyan',
    popular: false,
    order: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
    };

    try {
      const url = editingPkg ? `/api/packages/${editingPkg._id}` : '/api/packages';
      const method = editingPkg ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        fetchPackages();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error saving package:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (res.ok) fetchPackages();
    } catch (err) {
      console.error('Error deleting package:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      features: '',
      icon: 'Code2',
      color: 'cyan',
      popular: false,
      order: 0
    });
    setEditingPkg(null);
  };

  const openEdit = (pkg: any) => {
    setEditingPkg(pkg);
    setFormData({
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      description: pkg.description,
      features: pkg.features.join(', '),
      icon: pkg.icon,
      color: pkg.color,
      popular: pkg.popular,
      order: pkg.order
    });
    setIsModalOpen(true);
  };

  const categories = Array.from(new Set(packages.map(p => p.category)));

  return (
    <AdminLayout title="Service Packages">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Service Packages</h1>
            <p className="text-white/40 text-sm">Manage your pricing plans and categories.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-accent-cyan text-primary font-bold rounded-xl hover:scale-105 transition-all"
          >
            <Plus size={20} /> Add Package
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-accent-cyan" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg._id}
                layout
                className="glass-card p-6 rounded-3xl border-white/5 space-y-4 relative group"
              >
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "p-3 rounded-2xl bg-white/5",
                    pkg.popular ? "text-accent-cyan" : "text-white/40"
                  )}>
                    <PackageIcon size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(pkg)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => deletePackage(pkg._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan px-2 py-0.5 bg-accent-cyan/10 rounded-full">{pkg.category}</span>
                    {pkg.popular && <span className="text-[10px] font-black uppercase tracking-widest text-accent-purple px-2 py-0.5 bg-accent-purple/10 rounded-full">Popular</span>}
                  </div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-2xl font-display font-black text-white mt-2">{pkg.price}</p>
                </div>

                <p className="text-white/40 text-sm line-clamp-2">{pkg.description}</p>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Features ({pkg.features.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.slice(0, 3).map((f: string, i: number) => (
                      <span key={i} className="text-[10px] text-white/60 bg-white/5 px-2 py-1 rounded-lg">{f}</span>
                    ))}
                    {pkg.features.length > 3 && <span className="text-[10px] text-white/40 px-2 py-1">+{pkg.features.length - 3} more</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && packages.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <PackageIcon size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 italic">No packages found. Start by adding one!</p>
          </div>
        )}
      </div>

      {/* Package Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-primary/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border-white/10 p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">{editingPkg ? 'Edit Package' : 'New Package'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Package Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50" placeholder="e.g. Dynamic Web" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Category</label>
                    <input type="text" required list="categories" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50" placeholder="e.g. Web & Mobile Dev" />
                    <datalist id="categories">
                      {categories.map((c: any) => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Price</label>
                    <input type="text" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50" placeholder="e.g. $1,200 or $49/mo" />
                  </div>
                  <div className="space-y-2 flex items-center gap-4 pt-6">
                    <button type="button" onClick={() => setFormData({...formData, popular: !formData.popular})} className={cn("flex items-center gap-2 px-4 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest", formData.popular ? "bg-accent-purple/20 border-accent-purple/50 text-accent-purple" : "bg-white/5 border-white/10 text-white/40")}>
                      {formData.popular ? <Check size={16} /> : <div className="w-4 h-4" />} Popular Choice
                    </button>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Display Order</label>
                      <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Description</label>
                  <textarea rows={2} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50 resize-none" placeholder="Short pitch for this plan..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Features (comma separated)</label>
                  <textarea rows={3} required value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50 resize-none" placeholder="Feature 1, Feature 2, Feature 3..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Icon (Lucide Name)</label>
                    <select value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50">
                      <option value="Code2">Code2</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="PenTool">PenTool</option>
                      <option value="Star">Star</option>
                      <option value="Layout">Layout</option>
                      <option value="Video">Video</option>
                      <option value="Search">Search</option>
                      <option value="Type">Type</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Crown">Crown</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Color Theme</label>
                    <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-cyan/50">
                      <option value="cyan">Cyan (Default)</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                      <option value="pink">Pink</option>
                      <option value="blue">Blue</option>
                      <option value="emerald">Emerald</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 bg-accent-cyan text-primary font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs shadow-lg shadow-accent-cyan/20">
                  {loading ? <Loader2 className="animate-spin" /> : 'Save Package'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
