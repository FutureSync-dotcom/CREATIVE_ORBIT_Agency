import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Briefcase, 
  Users, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  MoreVertical,
  Plus,
  MessageSquare,
  Loader2,
  Star,
  Target,
  Shield,
  Database,
  Globe,
  Activity
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

interface Stats {
  totalRevenue: number;
  activeProjects: number;
  totalProjects: number;
  completedProjects: number;
  totalLeads: number;
  newLeads: number;
  pipelineValue: number;
  totalClients: number;
  avgResponse: string;
  systemStatus?: {
    backend: string;
    database: string;
    lastLogin: string;
  };
}

const StatCard = ({ title, value, change, icon: Icon, color, loading }: { title: string, value: string | number, change: string, icon: any, color: string, loading?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="glass-effect p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`} style={{ backgroundColor: color }}></div>
    
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${color}1A` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {change}
      </span>
    </div>
    
    <div>
      <p className="text-white/50 text-sm font-medium">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg mt-1" />
      ) : (
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      )}
    </div>
  </motion.div>
);

const RecentProjectItem = ({ name, status, client, date }: { name: string, status: string, client: { name: string }, date: string }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/5">
        <Briefcase size={18} className="text-accent-cyan" />
      </div>
      <div>
        <h4 className="font-semibold text-white group-hover:text-accent-cyan transition-colors">{name}</h4>
        <p className="text-xs text-white/40">{client?.name || 'N/A'}</p>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
      <div className="hidden md:block">
        <p className="text-xs text-white/40 mb-1 font-bold uppercase tracking-wider">Due Date</p>
        <p className="text-sm font-bold text-white/80">{new Date(date).toLocaleDateString()}</p>
      </div>
      
      <div className="flex items-center gap-2 min-w-[100px] sm:min-w-[120px]">
        {status === 'Completed' ? (
          <CheckCircle2 size={14} className="text-green-400" />
        ) : (
          <Clock size={14} className="text-accent-cyan" />
        )}
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
          status === 'Completed' ? 'text-green-400' : 'text-accent-cyan'
        }`}>
          {status}
        </span>
      </div>
      
      <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-white/10 rounded-lg ml-auto sm:ml-0">
        <MoreVertical size={18} className="text-white/40" />
      </motion.button>
    </div>
  </div>
);

export const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          fetch('/api/stats', {
            headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
          }),
          fetch('/api/projects', {
            headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
          })
        ]);
        
        const statsData = await statsRes.json();
        const projectsData = await projectsRes.json();
        
        setStats(statsData);
        setRecentProjects(projectsData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout title="Overview">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-white/40 mt-1 text-sm md:text-base">
              Welcome back, {JSON.parse(localStorage.getItem('adminUser') || '{}').name?.split(' ')[0] || 'Admin'}. 
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/projects')}
            className="w-full sm:w-auto px-5 py-3 bg-accent-cyan text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all"
          >
            <Plus size={20} />
            New Project
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`} 
            change="+12.5%" 
            icon={TrendingUp} 
            color="#00F2FF" 
            loading={loading}
          />
          <StatCard 
            title="Active Projects" 
            value={stats?.activeProjects || 0} 
            change="+3.2%" 
            icon={Briefcase} 
            color="#7000FF" 
            loading={loading}
          />
          <StatCard 
            title="Active Leads" 
            value={stats?.totalLeads || 0} 
            change={`+${stats?.newLeads || 0} new`}
            icon={Star} 
            color="#FF00F2" 
            loading={loading}
          />
          <StatCard 
            title="Pipeline Value" 
            value={`$${stats?.pipelineValue?.toLocaleString() || '0'}`} 
            change="Forecast" 
            icon={Target} 
            color="#7000FF" 
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <button 
                onClick={() => navigate('/admin/projects')}
                className="text-accent-cyan text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="glass-effect rounded-2xl p-2 divide-y divide-white/5">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="animate-spin text-accent-cyan mx-auto" size={24} />
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="p-8 text-center text-white/40">No projects yet.</div>
              ) : (
                recentProjects.map((project) => (
                  <RecentProjectItem 
                    key={project._id}
                    name={project.name} 
                    client={project.client} 
                    status={project.status} 
                    date={project.dueDate} 
                  />
                ))
              )}
            </div>
          </div>

          {/* Side Card / Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">System Status</h2>
            <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Globe size={18} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium">Backend Status</p>
                      <p className="text-sm font-bold text-white">{stats?.systemStatus?.backend || 'Connecting...'}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent-cyan/10">
                      <Database size={18} className="text-accent-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium">Database Status</p>
                      <p className="text-sm font-bold text-white">{stats?.systemStatus?.database || 'Checking...'}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${stats?.systemStatus?.database === 'Connected' ? 'bg-accent-cyan animate-pulse' : 'bg-red-400'}`} />
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <Activity size={18} className="text-white/40" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium">Last Session</p>
                      <p className="text-sm font-bold text-white">
                        {stats?.systemStatus?.lastLogin ? new Date(stats?.systemStatus?.lastLogin).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl glass-effect hover:bg-white/10 transition-all text-center group">
                <Plus size={20} className="mx-auto mb-2 text-accent-cyan group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Add Team</span>
              </button>
              <button 
                onClick={() => navigate('/admin/messages')}
                className="p-4 rounded-xl glass-effect hover:bg-white/10 transition-all text-center group"
              >
                <MessageSquare size={20} className="mx-auto mb-2 text-accent-purple group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Messages</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Overview;
