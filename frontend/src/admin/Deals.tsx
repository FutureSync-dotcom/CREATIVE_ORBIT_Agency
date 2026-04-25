import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Loader2, 
  X, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

interface Client {
  _id: string;
  name: string;
  company: string;
}

interface Deal {
  _id: string;
  title: string;
  client: any;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  expectedCloseDate: string;
  probability: number;
  notes: string;
  createdAt: string;
}

const stageStyles = {
  'Discovery': 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  'Proposal': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Negotiation': 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  'Won': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Lost': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDeal, setCurrentDeal] = useState<Partial<Deal>>({
    stage: 'Discovery',
    probability: 50,
    value: 0
  });

  useEffect(() => {
    fetchDeals();
    fetchClients();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentDeal._id ? 'PUT' : 'POST';
    const url = currentDeal._id 
      ? `/api/deals/${currentDeal._id}` 
      : '/api/deals';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(currentDeal),
      });

      if (response.ok) {
        fetchDeals();
        setIsModalOpen(false);
        setCurrentDeal({ stage: 'Discovery', probability: 50, value: 0 });
      }
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const totalPipelineValue = deals.reduce((acc, d) => acc + (d.value || 0), 0);
  const weightedValue = deals.reduce((acc, d) => acc + (d.value * (d.probability / 100)), 0);

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.client?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Deals">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
            <p className="text-white/40 mt-1">Track deals, negotiations, and revenue forecasts.</p>
          </div>
          <button
            onClick={() => {
              setCurrentDeal({ stage: 'Discovery', probability: 50, value: 0 });
              setIsModalOpen(true);
            }}
            className="relative z-20 px-5 py-2.5 bg-accent-purple text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add New Deal
          </button>
        </div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect p-8 rounded-3xl border-white/5 bg-gradient-to-br from-accent-cyan/5 to-transparent">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">Total Pipeline</p>
            <h3 className="text-4xl font-bold text-white mb-4">${totalPipelineValue.toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-xs text-accent-cyan bg-accent-cyan/10 w-fit px-2 py-1 rounded">
              <TrendingUp size={12} />
              <span>Gross Value</span>
            </div>
          </div>
          
          <div className="glass-effect p-8 rounded-3xl border-white/5 bg-gradient-to-br from-accent-purple/5 to-transparent">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">Weighted Forecast</p>
            <h3 className="text-4xl font-bold text-white mb-4">${Math.round(weightedValue).toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-xs text-accent-purple bg-accent-purple/10 w-fit px-2 py-1 rounded">
              <Target size={12} />
              <span>Based on Probabilities</span>
            </div>
          </div>

          <div className="glass-effect p-8 rounded-3xl border-white/5">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">Active Deals</p>
            <h3 className="text-4xl font-bold text-white mb-4">{deals.length}</h3>
            <div className="flex items-center gap-2 text-xs text-white/20 bg-white/5 w-fit px-2 py-1 rounded">
              <Briefcase size={12} />
              <span>In Pipeline</span>
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-purple transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-accent-purple mx-auto" size={32} />
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="py-20 text-center glass-effect rounded-3xl border-white/5">
              <p className="text-white/20">No deals found in your pipeline.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredDeals.map((deal) => (
                <motion.div
                  key={deal._id}
                  layout
                  className="glass-effect p-6 rounded-3xl border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent-purple border border-white/5">
                      <DollarSign size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-accent-purple transition-colors">{deal.title}</h3>
                      <p className="text-sm text-white/40 flex items-center gap-2">
                        {deal.client?.company || deal.client?.name || 'Unknown Client'}
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        Added {new Date(deal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <div className="text-right hidden xl:block">
                      <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-1">Probability</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent-purple rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white/60">{deal.probability}%</span>
                      </div>
                    </div>

                    <div className="min-w-[100px]">
                      <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-1">Value</p>
                      <p className="text-lg font-bold text-white">${deal.value?.toLocaleString()}</p>
                    </div>

                    <div className="min-w-[120px]">
                      <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-1">Stage</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${stageStyles[deal.stage]}`}>
                        {deal.stage}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setCurrentDeal(deal);
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-accent-purple hover:bg-white/10 transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(deal._id)}
                        className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-red-400 hover:bg-white/10 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-effect rounded-[2.5rem] shadow-2xl border-white/10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">{currentDeal._id ? 'Edit Deal' : 'Add New Deal'}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Deal Title</label>
                    <input 
                      type="text" 
                      required
                      value={currentDeal.title || ''}
                      onChange={(e) => setCurrentDeal({...currentDeal, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-purple/50 text-white"
                      placeholder="e.g. Website Redesign for Naccarry"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Select Client</label>
                      <select 
                        required
                        value={typeof currentDeal.client === 'object' ? currentDeal.client._id : currentDeal.client}
                        onChange={(e) => setCurrentDeal({...currentDeal, client: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-purple/50 text-white/80"
                      >
                        <option value="">Select a client</option>
                        {clients.map(c => (
                          <option key={c._id} value={c._id}>{c.company || c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Deal Value ($)</label>
                      <input 
                        type="number" 
                        required
                        value={currentDeal.value || 0}
                        onChange={(e) => setCurrentDeal({...currentDeal, value: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-purple/50 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Pipeline Stage</label>
                      <select 
                        value={currentDeal.stage}
                        onChange={(e) => setCurrentDeal({...currentDeal, stage: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-purple/50 text-white/80"
                      >
                        <option value="Discovery">Discovery</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Win Probability (%)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={currentDeal.probability || 0}
                        onChange={(e) => setCurrentDeal({...currentDeal, probability: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-purple/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Expected Close</label>
                      <input 
                        type="date" 
                        value={currentDeal.expectedCloseDate?.split('T')[0] || ''}
                        onChange={(e) => setCurrentDeal({...currentDeal, expectedCloseDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-purple/50 text-white/80"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Deal Notes</label>
                    <textarea 
                      rows={3}
                      value={currentDeal.notes || ''}
                      onChange={(e) => setCurrentDeal({...currentDeal, notes: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent-purple/50 text-white resize-none"
                      placeholder="Next steps, specific requirements..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-accent-purple text-white font-bold rounded-2xl shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {currentDeal._id ? 'Update Deal' : 'Start Deal'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};
