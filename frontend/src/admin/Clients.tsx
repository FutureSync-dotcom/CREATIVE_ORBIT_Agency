import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2,
  Trash2,
  Loader2,
  X,
  User,
  Edit2,
  Eye,
  Briefcase,
  ExternalLink,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

interface Client {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Lead';
  totalProjects: number;
  totalRevenue: number;
}

interface Project {
  _id: string;
  name: string;
  status: string;
  progress: number;
  budget: number;
  dueDate: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'Active': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Inactive': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Lead': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.Lead}`}>
      {status}
    </span>
  );
};

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone || '',
        status: client.status
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'Lead'
      });
    }
    setIsModalOpen(true);
  };

  const handleViewClient = async (client: Client) => {
    setViewingClient(client);
    setIsViewModalOpen(true);
    setProjectsLoading(true);
    try {
      const response = await fetch(`/api/projects/client/${client._id}`);
      const data = await response.json();
      setClientProjects(data);
    } catch (error) {
      console.error('Error fetching client projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) {
        setClients(clients.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const url = editingClient 
      ? `/api/clients/${editingClient._id}`
      : '/api/clients';
    
    const method = editingClient ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchClients();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Clients">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-white/40 mt-1 text-sm md:text-base">Manage your agency's client relationships.</p>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto px-5 py-3 bg-accent-cyan text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all relative z-[45]"
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20"
            />
          </div>
          <button className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white/60">
            <Filter size={18} />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* Clients List */}
        <div className="glass-effect rounded-3xl overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Client Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Projects</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Total Revenue</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode='popLayout'>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <Loader2 className="animate-spin text-accent-cyan mx-auto" size={32} />
                      </td>
                    </tr>
                  ) : filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-white/40">
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <motion.tr 
                        key={client._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/5">
                              <User size={18} className="text-accent-cyan" />
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-accent-cyan transition-colors">{client.name}</p>
                              <div className="flex items-center gap-1.5 text-xs text-white/40">
                                <Building2 size={12} />
                                {client.company}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-white/60">
                              <Mail size={12} className="text-accent-cyan" />
                              {client.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                              <Phone size={12} className="text-accent-purple" />
                              {client.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={client.status} />
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-white/80">{client.totalProjects} Projects</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-mono font-bold text-accent-cyan">${client.totalRevenue?.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleViewClient(client)}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent-purple transition-all"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleOpenModal(client)}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent-cyan transition-all"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(client._id)}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewingClient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass-effect rounded-[2.5rem] shadow-2xl overflow-hidden border-white/10 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/10">
                    <User size={40} className="text-accent-cyan" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{viewingClient.name}</h2>
                    <p className="text-white/40 flex items-center gap-2 mt-1">
                      <Building2 size={16} />
                      {viewingClient.company}
                    </p>
                    <div className="flex gap-4 mt-4">
                      <StatusBadge status={viewingClient.status} />
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Mail size={14} className="text-accent-cyan" />
                        {viewingClient.email}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Total Revenue</p>
                    <p className="text-2xl font-mono font-bold text-accent-cyan">${viewingClient.totalRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Projects</p>
                    <p className="text-2xl font-bold text-white">{clientProjects.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Phone</p>
                    <p className="text-lg font-medium text-white/80">{viewingClient.phone || 'N/A'}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-accent-cyan" />
                  Assigned Projects
                </h3>

                {projectsLoading ? (
                  <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-accent-cyan mx-auto" size={32} />
                  </div>
                ) : clientProjects.length === 0 ? (
                  <div className="py-20 text-center glass-effect rounded-3xl border-dashed border-white/10">
                    <p className="text-white/30">No projects found for this client.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientProjects.map((project) => (
                      <div key={project._id} className="glass-effect p-5 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/50 flex items-center justify-center border border-white/5">
                            <Briefcase size={20} className="text-accent-cyan" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-accent-cyan transition-colors">{project.name}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Budget: ${project.budget?.toLocaleString()}</span>
                              <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase tracking-tighter">
                                <Clock size={10} />
                                Due {new Date(project.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="w-24">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-bold text-white/40">{project.progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent-cyan rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            project.status === 'Completed' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-accent-cyan/20 text-accent-cyan bg-accent-cyan/5'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-8 py-3 bg-white/5 text-white/60 font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-effect rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-white/10 custom-scrollbar"
            >
              <div className="p-6 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
                    <p className="text-white/40 text-sm mt-1">Fill in the contact information below.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2 group col-span-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                          <User size={18} />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Client Name"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Company
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                          <Building2 size={18} />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Company Name"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="email@company.com"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                          <Phone size={18} />
                        </div>
                        <input 
                          type="text" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+1 555 000 0000"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Status
                      </label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white appearance-none cursor-pointer"
                      >
                        <option value="Lead">Lead</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={formLoading}
                      className="flex-[2] py-4 bg-accent-cyan text-primary font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all disabled:opacity-50"
                    >
                      {formLoading ? <Loader2 className="animate-spin" size={20} /> : (editingClient ? 'Update Client' : 'Create Client')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};
