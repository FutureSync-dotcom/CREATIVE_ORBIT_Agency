import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Star,
  Briefcase,
  ChevronRight,
  X,
  Trash2,
  Loader2,
  Calendar,
  DollarSign,
  FileText,
  User,
  Building2
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { cn } from '../utils/cn';

// Removed Client interface

interface Project {
  _id: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
  budget: number;
  isFeatured: boolean;
  image: string;
  results: string[];
  tags: string[];
  challenge?: string;
  description?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'Completed': 'bg-green-500/10 text-green-400 border-green-500/20',
    'In Progress': 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'On Hold': 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.Pending}`}>
      {status}
    </span>
  );
};

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    status: 'Pending',
    progress: 0,
    budget: 0,
    isFeatured: false,
    image: '',
    results: '', // as comma separated string in form
    tags: '', // as comma separated string in form
    challenge: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

// Removed fetchClients

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        isFeatured: project.isFeatured || false,
        image: project.image || '',
        results: project.results ? project.results.join(', ') : '',
        tags: project.tags ? project.tags.join(', ') : '',
        challenge: project.challenge || '',
        description: project.description || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        status: 'Pending',
        progress: 0,
        budget: 0,
        isFeatured: false,
        image: '',
        results: '',
        tags: '',
        challenge: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const url = editingProject 
      ? `/api/projects/${editingProject._id}`
      : '/api/projects';
    
    const method = editingProject ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({
          ...formData,
          results: formData.results.split(',').map(s => s.trim()).filter(s => s !== ''),
          tags: formData.tags.split(',').map(s => s.trim()).filter(s => s !== '')
        }),
      });

      if (response.ok) {
        await fetchProjects();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Projects">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-white/40 mt-1 text-sm md:text-base">Manage and track all agency projects.</p>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto px-5 py-3 bg-accent-cyan text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all relative z-[45]"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search projects..."
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

        {/* Projects Grid/Table */}
        <div className="glass-effect rounded-3xl overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Project Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Progress</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode='popLayout'>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="inline-block w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full"
                        />
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-white/40">
                        No projects found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <motion.tr 
                        key={project._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/5">
                              <Briefcase size={18} className="text-accent-cyan" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-white group-hover:text-accent-cyan transition-colors">{project.name}</p>
                                {project.isFeatured && (
                                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                )}
                              </div>
                              <p className="text-xs text-white/40">Budget: ${project.budget?.toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                        {/* Removed Client Info Column */}
                        <td className="px-6 py-5">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-32">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-bold text-white/40">{project.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                className={`h-full rounded-full ${
                                  project.progress === 100 ? 'bg-green-400' : 'bg-accent-cyan'
                                }`}
                              />
                            </div>
                          </div>
                        </td>
                        {/* Removed Due Date Column */}
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenModal(project)}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent-cyan transition-all"
                            >
                              <ExternalLink size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(project._id)}
                              className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-all"
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

      {/* Modal Overlay */}
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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-effect rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-white/10 custom-scrollbar"
            >
              <div className="p-6 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                    <p className="text-white/40 text-sm mt-1">Fill in the details to {editingProject ? 'update' : 'create'} the project.</p>
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
                    {/* Project Name */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Project Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                          <Briefcase size={18} />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Naccarry App"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Removed Assign Client Section */}

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
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Progress ({formData.progress}%)
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent-cyan mt-5"
                      />
                    </div>

                    {/* Removed Due Date Section */}

                    {/* Budget */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                        Budget ($)
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                          <DollarSign size={18} />
                        </div>
                        <input 
                          type="number" 
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="space-y-2 group flex flex-col justify-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 mb-2">
                        Show in Portfolio
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                        className={cn(
                          "flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all",
                          formData.isFeatured 
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" 
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                        )}
                      >
                        <Star size={18} className={cn(formData.isFeatured && "fill-yellow-500")} />
                        <span className="text-sm font-bold uppercase tracking-widest">
                          {formData.isFeatured ? 'Featured Project' : 'Normal Project'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                      Description
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-5 text-white/20 group-focus-within:text-accent-cyan transition-colors">
                        <FileText size={18} />
                      </div>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Project requirements and details..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white resize-none"
                      />
                    </div>
                  </div>

                  {/* Portfolio Specific Fields */}
                  <div className="pt-4 border-t border-white/5 space-y-6">
                    <h4 className="text-xs font-bold text-accent-cyan uppercase tracking-widest px-4">Portfolio Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Image URL */}
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                          Project Image URL
                        </label>
                        <input 
                          type="text" 
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                          Technologies (Comma separated)
                        </label>
                        <input 
                          type="text" 
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          placeholder="React, Node.js, GSAP"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>

                      {/* Results */}
                      <div className="space-y-2 group md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                          Key Results (Comma separated)
                        </label>
                        <input 
                          type="text" 
                          value={formData.results}
                          onChange={(e) => setFormData({...formData, results: e.target.value})}
                          placeholder="99.9% Uptime, 2x Conversion, Mobile Friendly"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white"
                        />
                      </div>

                      {/* Challenge */}
                      <div className="space-y-2 group md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 group-focus-within:text-accent-cyan transition-colors">
                          The Challenge
                        </label>
                        <textarea 
                          value={formData.challenge}
                          onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                          placeholder="What was the main problem you solved?"
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white resize-none"
                        />
                      </div>
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
                      {formLoading ? <Loader2 className="animate-spin" size={20} /> : (editingProject ? 'Update Project' : 'Create Project')}
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
