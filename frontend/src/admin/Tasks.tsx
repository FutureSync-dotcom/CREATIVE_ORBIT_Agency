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
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  Briefcase,
  ChevronRight,
  ListTodo
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  title: string;
  project: any;
  description: string;
  status: 'Todo' | 'Doing' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
}

const priorityStyles = {
  'Low': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Medium': 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  'High': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusIcons = {
  'Todo': <Clock size={16} className="text-white/20" />,
  'Doing': <div className="w-4 h-4 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />,
  'Done': <CheckCircle2 size={16} className="text-green-400" />,
};

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    status: 'Todo',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
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
    const method = currentTask._id ? 'PUT' : 'POST';
    const url = currentTask._id 
      ? `http://localhost:5001/api/tasks/${currentTask._id}` 
      : 'http://localhost:5001/api/tasks';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(currentTask),
      });

      if (response.ok) {
        fetchTasks();
        setIsModalOpen(false);
        setCurrentTask({ status: 'Todo', priority: 'Medium' });
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatusMap = {
      'Todo': 'Doing',
      'Doing': 'Done',
      'Done': 'Todo'
    };
    const nextStatus = nextStatusMap[task.status];
    
    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Tasks">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-white/40 mt-1">Manage project milestones and daily to-dos.</p>
          </div>
          <button
            onClick={() => {
              setCurrentTask({ status: 'Todo', priority: 'Medium' });
              setIsModalOpen(true);
            }}
            className="relative z-20 px-5 py-2.5 bg-accent-cyan text-primary font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all active:scale-95"
          >
            <Plus size={20} />
            Create Task
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Todo', count: tasks.filter(t => t.status === 'Todo').length, color: 'text-white/40' },
            { label: 'In Progress', count: tasks.filter(t => t.status === 'Doing').length, color: 'text-accent-cyan' },
            { label: 'Completed', count: tasks.filter(t => t.status === 'Done').length, color: 'text-green-400' },
            { label: 'High Priority', count: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length, color: 'text-red-400' },
          ].map((stat, i) => (
            <div key={i} className="glass-effect p-6 rounded-2xl border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.count}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <ListTodo size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-sm"
              />
            </div>
          </div>

          <div className="glass-effect rounded-3xl border-white/5 overflow-hidden">
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="animate-spin text-accent-cyan mx-auto" size={32} />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-20 text-center text-white/20">No tasks found.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleToggleStatus(task)}
                        className="w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center hover:border-accent-cyan/50 transition-all"
                      >
                        {statusIcons[task.status]}
                      </button>
                      <div>
                        <h4 className={`font-semibold transition-all ${
                          task.status === 'Done' ? 'text-white/20 line-through' : 'text-white'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest flex items-center gap-1">
                            <Briefcase size={10} />
                            {task.project?.name || 'No Project'}
                          </p>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest flex items-center gap-1">
                            <Calendar size={10} />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setCurrentTask(task);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-accent-cyan transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
                  <h2 className="text-2xl font-bold text-white">{currentTask._id ? 'Edit Task' : 'New Task'}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Task Title</label>
                    <input 
                      type="text" 
                      required
                      value={currentTask.title || ''}
                      onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                      placeholder="e.g. Design homepage mockup"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Project</label>
                      <select 
                        required
                        value={typeof currentTask.project === 'object' ? currentTask.project._id : currentTask.project}
                        onChange={(e) => setCurrentTask({...currentTask, project: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      >
                        <option value="">Select a project</option>
                        {projects.map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Due Date</label>
                      <input 
                        type="date" 
                        value={currentTask.dueDate?.split('T')[0] || ''}
                        onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Priority</label>
                      <select 
                        value={currentTask.priority}
                        onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Initial Status</label>
                      <select 
                        value={currentTask.status}
                        onChange={(e) => setCurrentTask({...currentTask, status: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white/80"
                      >
                        <option value="Todo">To Do</option>
                        <option value="Doing">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Description (Optional)</label>
                    <textarea 
                      rows={3}
                      value={currentTask.description || ''}
                      onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent-cyan/50 text-white resize-none"
                      placeholder="Add more details about this task..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-accent-cyan text-primary font-bold rounded-2xl shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {currentTask._id ? 'Update Task' : 'Create Task'}
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
