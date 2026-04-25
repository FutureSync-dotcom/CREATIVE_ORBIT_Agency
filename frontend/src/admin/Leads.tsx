import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Loader2, 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Star
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  value: number;
  notes: string;
  createdAt: string;
}

const statusStyles = {
  'New': 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  'Contacted': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Qualified': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Lost': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLead, setCurrentLead] = useState<Partial<Lead>>({
    status: 'New',
    source: 'Website',
    value: 0
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/leads', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentLead._id ? 'PUT' : 'POST';
    const url = currentLead._id 
      ? `http://localhost:5001/api/leads/${currentLead._id}` 
      : 'http://localhost:5001/api/leads';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(currentLead),
      });

      if (response.ok) {
        fetchLeads();
        setIsModalOpen(false);
        setCurrentLead({ status: 'New', source: 'Website', value: 0 });
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`http://localhost:5001/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Leads">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
            <p className="text-white/40 mt-1">Track and qualify potential opportunities.</p>
          </div>
          <button
            onClick={() => {
              setCurrentLead({ status: 'New', source: 'Website', value: 0 });
              setIsModalOpen(true);
            }}
            className="relative z-20 px-5 py-2.5 bg-accent-cyan text-primary font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add New Lead
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Leads', value: leads.length, icon: User, color: 'text-accent-cyan' },
            { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, icon: Star, color: 'text-green-400' },
            { label: 'Potential Value', value: `$${leads.reduce((acc, l) => acc + (l.value || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-accent-purple' },
            { label: 'Conversion Rate', value: `${leads.length ? Math.round((leads.filter(l => l.status === 'Qualified').length / leads.length) * 100) : 0}%`, icon: TrendingUp, color: 'text-blue-400' },
          ].map((stat, i) => (
            <div key={i} className="glass-effect p-6 rounded-2xl border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name, email or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-sm"
            />
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white flex items-center gap-2 text-sm transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Leads Table */}
        <div className="glass-effect rounded-3xl border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Lead</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Company & Source</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Value</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Status</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Added</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <Loader2 className="animate-spin text-accent-cyan mx-auto" size={32} />
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-white/20">No leads found.</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center text-accent-cyan font-bold">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{lead.name}</p>
                            <p className="text-xs text-white/30">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white/80">{lead.company || 'Private'}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{lead.source}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-accent-cyan">${lead.value?.toLocaleString() || '0'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyles[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/40">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setCurrentLead(lead);
                              setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent-cyan transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(lead._id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
                  <h2 className="text-2xl font-bold text-white">{currentLead._id ? 'Edit Lead' : 'Add New Lead'}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={currentLead.name || ''}
                        onChange={(e) => setCurrentLead({...currentLead, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={currentLead.email || ''}
                        onChange={(e) => setCurrentLead({...currentLead, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Company Name</label>
                      <input 
                        type="text" 
                        value={currentLead.company || ''}
                        onChange={(e) => setCurrentLead({...currentLead, company: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Phone Number</label>
                      <input 
                        type="tel" 
                        value={currentLead.phone || ''}
                        onChange={(e) => setCurrentLead({...currentLead, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Status</label>
                      <select 
                        value={currentLead.status}
                        onChange={(e) => setCurrentLead({...currentLead, status: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Lead Value ($)</label>
                      <input 
                        type="number" 
                        value={currentLead.value || 0}
                        onChange={(e) => setCurrentLead({...currentLead, value: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Source</label>
                      <input 
                        type="text" 
                        value={currentLead.source || ''}
                        onChange={(e) => setCurrentLead({...currentLead, source: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                        placeholder="Website, Referral..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Notes</label>
                    <textarea 
                      rows={3}
                      value={currentLead.notes || ''}
                      onChange={(e) => setCurrentLead({...currentLead, notes: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent-cyan/50 text-white resize-none"
                      placeholder="Add any additional details..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-accent-cyan text-primary font-bold rounded-2xl shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {currentLead._id ? 'Update Lead' : 'Create Lead'}
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
