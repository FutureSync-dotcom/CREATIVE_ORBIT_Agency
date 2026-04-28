import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  LogOut,
  Zap,
  Star,
  TrendingUp,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import './Dashboard.css';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link to={path} className="block">
    <motion.div
      whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.95 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        active ? 'bg-white/10 text-accent-cyan shadow-lg shadow-accent-cyan/10' : 'text-white/60 hover:text-white'
      }`}
    >
      <Icon size={20} className={active ? 'text-accent-cyan' : ''} />
      <span className="font-medium">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeIndicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)]"
        />
      )}
    </motion.div>
  </Link>
);

export const AdminLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [agencyName, setAgencyName] = useState(() => {
    return localStorage.getItem('agencyName') || 'Agency';
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.agencyName) {
          setAgencyName(data.agencyName);
          localStorage.setItem('agencyName', data.agencyName);
        }
      })
      .catch(err => console.error('Failed to fetch agency settings', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const half = Math.ceil(agencyName.length / 2);
  const firstHalf = agencyName.slice(0, half);
  const secondHalf = agencyName.slice(half);

  const hasPermission = (perm: string) => {
    if (!adminUser?.permissions) return true; // Default to all if not set (for super admin)
    return adminUser.permissions.includes(perm);
  };

  return (
    <div className="min-h-screen bg-primary text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col glass-effect z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-cyan rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
              <Zap size={22} className="text-primary fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">
              {firstHalf}<span className="text-accent-cyan">{secondHalf}</span>
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Admin Control Center</p>
        </div>

        <nav className="flex-1 px-4 space-y-8 py-6 overflow-y-auto custom-scrollbar">
          {/* Main Section */}
          {hasPermission('dashboard') && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-4 mb-4">Main</p>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Overview" 
                path="/admin" 
                active={location.pathname === '/admin'} 
              />
            </div>
          )}

          {/* Relations Section */}
          {(hasPermission('clients') || hasPermission('messages') || hasPermission('leads') || hasPermission('deals')) && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-4 mb-4">Relations</p>
              {hasPermission('clients') && (
                <SidebarItem 
                  icon={Users} 
                  label="Clients" 
                  path="/admin/clients" 
                  active={location.pathname === '/admin/clients'} 
                />
              )}
              {hasPermission('messages') && (
                <SidebarItem 
                  icon={MessageSquare} 
                  label="Messages" 
                  path="/admin/messages" 
                  active={location.pathname === '/admin/messages'} 
                />
              )}
              {hasPermission('leads') && (
                <SidebarItem 
                  icon={Star} 
                  label="Leads" 
                  path="/admin/leads" 
                  active={location.pathname === '/admin/leads'} 
                />
              )}
              {hasPermission('deals') && (
                <SidebarItem 
                  icon={TrendingUp} 
                  label="Deals" 
                  path="/admin/deals" 
                  active={location.pathname === '/admin/deals'} 
                />
              )}
            </div>
          )}

          {/* Operations Section */}
          {(hasPermission('projects') || hasPermission('tasks')) && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-4 mb-4">Operations</p>
              {hasPermission('projects') && (
                <SidebarItem 
                  icon={Briefcase} 
                  label="Projects" 
                  path="/admin/projects" 
                  active={location.pathname === '/admin/projects'} 
                />
              )}
              {hasPermission('tasks') && (
                <SidebarItem 
                  icon={CheckCircle2} 
                  label="Tasks" 
                  path="/admin/tasks" 
                  active={location.pathname === '/admin/tasks'} 
                />
              )}
            </div>
          )}

          {/* Finance Section */}
          {hasPermission('invoices') && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-4 mb-4">Finance</p>
              <SidebarItem 
                icon={DollarSign} 
                label="Invoices" 
                path="/admin/invoices" 
                active={location.pathname === '/admin/invoices'} 
              />
            </div>
          )}

          {/* System Section */}
          {hasPermission('settings') && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-4 mb-4">System</p>
              <SidebarItem 
                icon={Settings} 
                label="Settings" 
                path="/admin/settings" 
                active={location.pathname === '/admin/settings'} 
              />
            </div>
          )}
        </nav>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        {/* Topbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-primary/80 backdrop-blur-md z-40">
          <div className="flex-1 flex items-center">
            {/* Search removed as requested */}
          </div>

          <div className="flex-1 flex justify-center">
            <h2 className="text-lg font-bold tracking-tight text-white/90">{title}</h2>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all"
              >
                <Bell size={20} />
              </motion.button>
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-cyan rounded-full border-2 border-primary shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="flex items-center gap-3 pl-2">
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{adminUser?.name || 'Admin'}</p>
                <p className="text-[10px] text-accent-cyan uppercase tracking-wider font-bold">
                  {adminUser?.role || 'Super Admin'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple p-0.5">
                <div className="w-full h-full rounded-[10px] bg-primary flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-accent-cyan font-bold text-sm uppercase">
                    {(adminUser?.name || 'A').charAt(0)}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
