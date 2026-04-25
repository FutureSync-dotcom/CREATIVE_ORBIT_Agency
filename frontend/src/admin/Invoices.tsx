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
  FileText, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  MoreVertical,
  Building2,
  Briefcase
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

interface Client {
  _id: string;
  name: string;
  company: string;
}

interface Project {
  _id: string;
  name: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: any;
  project?: any;
  amount: number;
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue';
  dueDate: string;
  createdAt: string;
}

const statusStyles = {
  'Draft': 'bg-white/5 text-white/40 border-white/10',
  'Pending': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Paid': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    status: 'Pending',
    amount: 0,
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchProjects();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/invoices', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/clients', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/projects', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentInvoice._id ? 'PUT' : 'POST';
    const url = currentInvoice._id 
      ? `http://localhost:5001/api/invoices/${currentInvoice._id}` 
      : 'http://localhost:5001/api/invoices';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(currentInvoice),
      });

      if (response.ok) {
        fetchInvoices();
        setIsModalOpen(false);
        setCurrentInvoice({ status: 'Pending', amount: 0, invoiceNumber: `INV-${Date.now().toString().slice(-6)}` });
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const response = await fetch(`http://localhost:5001/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const filteredInvoices = invoices.filter(i => 
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.client?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Invoices">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-white/40 mt-1">Manage billing and track agency revenue.</p>
          </div>
          <button
            onClick={() => {
              setCurrentInvoice({ status: 'Pending', amount: 0, invoiceNumber: `INV-${Date.now().toString().slice(-6)}` });
              setIsModalOpen(true);
            }}
            className="relative z-20 px-5 py-2.5 bg-accent-cyan text-primary font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all active:scale-95"
          >
            <Plus size={20} />
            Create Invoice
          </button>
        </div>

        {/* Finance Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Invoiced', value: `$${invoices.reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`, color: 'text-white' },
            { label: 'Paid Revenue', value: `$${invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`, color: 'text-green-400' },
            { label: 'Outstanding', value: `$${invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`, color: 'text-accent-cyan' },
            { label: 'Overdue', value: `$${invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`, color: 'text-red-400' },
          ].map((stat, i) => (
            <div key={i} className="glass-effect p-6 rounded-2xl border-white/5">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by invoice # or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-sm"
            />
          </div>
        </div>

        <div className="glass-effect rounded-3xl border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Invoice #</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Client</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Amount</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Due Date</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30">Status</th>
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
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-white/20">No invoices found.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-cyan border border-white/5">
                            <FileText size={18} />
                          </div>
                          <span className="font-bold text-white">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white/80">{invoice.client?.company || invoice.client?.name}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1 flex items-center gap-1">
                          <Briefcase size={10} />
                          {invoice.project?.name || 'General Project'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">${invoice.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-white/40">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all" title="Download PDF">
                            <Download size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setCurrentInvoice(invoice);
                              setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent-cyan transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(invoice._id)}
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
              className="relative w-full max-w-xl glass-effect rounded-[2.5rem] shadow-2xl border-white/10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">{currentInvoice._id ? 'Edit Invoice' : 'New Invoice'}</h2>
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Invoice Number</label>
                      <input 
                        type="text" 
                        required
                        value={currentInvoice.invoiceNumber || ''}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, invoiceNumber: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Amount ($)</label>
                      <input 
                        type="number" 
                        required
                        value={currentInvoice.amount || 0}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, amount: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Select Client</label>
                    <select 
                      required
                      value={typeof currentInvoice.client === 'object' ? currentInvoice.client._id : currentInvoice.client}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, client: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                    >
                      <option value="">Select a client</option>
                      {clients.map(c => (
                        <option key={c._id} value={c._id}>{c.company || c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Due Date</label>
                      <input 
                        type="date" 
                        required
                        value={currentInvoice.dueDate?.split('T')[0] || ''}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, dueDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Status</label>
                      <select 
                        value={currentInvoice.status}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, status: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-accent-cyan text-primary font-bold rounded-2xl shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {currentInvoice._id ? 'Update Invoice' : 'Create Invoice'}
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
