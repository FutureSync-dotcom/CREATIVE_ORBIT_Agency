import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  TrendingUp, 
  LogOut,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap
} from 'lucide-react';
import './Dashboard.css';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <motion.button
    whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
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
  </motion.button>
);

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: any, color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
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
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  </motion.div>
);

const RecentProject = ({ name, status, client, date }: { name: string, status: 'Completed' | 'In Progress' | 'Pending', client: string, date: string }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/5">
        <Briefcase size={18} className="text-accent-cyan" />
      </div>
      <div>
        <h4 className="font-semibold text-white group-hover:text-accent-cyan transition-colors">{name}</h4>
        <p className="text-xs text-white/40">{client}</p>
      </div>
    </div>
    
    <div className="flex items-center gap-8">
      <div className="hidden md:block">
        <p className="text-xs text-white/40 mb-1">Due Date</p>
        <p className="text-sm font-medium text-white/80">{date}</p>
      </div>
      
      <div className="flex items-center gap-2 min-w-[120px]">
        {status === 'Completed' ? (
          <CheckCircle2 size={14} className="text-green-400" />
        ) : status === 'In Progress' ? (
          <Clock size={14} className="text-accent-cyan" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20" />
        )}
        <span className={`text-xs font-medium ${
          status === 'Completed' ? 'text-green-400' : 
          status === 'In Progress' ? 'text-accent-cyan' : 'text-white/40'
        }`}>
          {status}
        </span>
      </div>
      
      <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-white/10 rounded-lg">
        <MoreVertical size={18} className="text-white/40" />
      </motion.button>
    </div>
  </div>
);

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-primary text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col glass-effect z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-cyan rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
              <Zap size={22} className="text-primary fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">CORE<span className="text-accent-cyan">TECH</span></span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Admin Control Center</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activeTab === 'Overview'} 
            onClick={() => setActiveTab('Overview')} 
          />
          <SidebarItem 
            icon={Briefcase} 
            label="Projects" 
            active={activeTab === 'Projects'} 
            onClick={() => setActiveTab('Projects')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Clients" 
            active={activeTab === 'Clients'} 
            onClick={() => setActiveTab('Clients')} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Messages" 
            active={activeTab === 'Messages'} 
            onClick={() => setActiveTab('Messages')} 
          />
          <div className="my-6 border-t border-white/5 mx-2" />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'Settings'} 
            onClick={() => setActiveTab('Settings')} 
          />
        </nav>

        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300">
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
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-96 group focus-within:border-accent-cyan/50 transition-all">
            <Search size={18} className="text-white/30 group-focus-within:text-accent-cyan" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-6">
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
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Alex Rivera</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple p-0.5">
                <div className="w-full h-full rounded-[10px] bg-primary flex items-center justify-center overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Sections */}
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
              <p className="text-white/40 mt-1">Welcome back, here's what's happening today.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-accent-cyan text-primary font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all"
            >
              <Plus size={20} />
              New Project
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value="$128,430" 
              change="+12.5%" 
              icon={TrendingUp} 
              color="#00F2FF" 
            />
            <StatCard 
              title="Active Projects" 
              value="24" 
              change="+3.2%" 
              icon={Briefcase} 
              color="#7000FF" 
            />
            <StatCard 
              title="New Leads" 
              value="156" 
              change="+18.7%" 
              icon={Users} 
              color="#00F2FF" 
            />
            <StatCard 
              title="Avg. Response" 
              value="2.4h" 
              change="-0.5%" 
              icon={Clock} 
              color="#7000FF" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Projects List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Projects</h2>
                <button className="text-accent-cyan text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="glass-effect rounded-2xl p-2 divide-y divide-white/5">
                <RecentProject 
                  name="E-commerce Rebrand" 
                  client="StyleCloud Inc." 
                  status="In Progress" 
                  date="Oct 24, 2023" 
                />
                <RecentProject 
                  name="SaaS Dashboard UI" 
                  client="Flux Media" 
                  status="Completed" 
                  date="Oct 20, 2023" 
                />
                <RecentProject 
                  name="Mobile App Design" 
                  client="HealthSync" 
                  status="Pending" 
                  date="Oct 28, 2023" 
                />
                <RecentProject 
                  name="Corporate Website" 
                  client="NexGen Labs" 
                  status="In Progress" 
                  date="Nov 05, 2023" 
                />
              </div>
            </div>

            {/* Side Card / Notifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Platform Status</h2>
              <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-white/80">All systems operational</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Server Load</span>
                      <span className="font-mono text-accent-cyan">32%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '32%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-accent-cyan"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm pt-2">
                      <span className="text-white/40">API Usage</span>
                      <span className="font-mono text-accent-purple">68%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '68%' }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-accent-purple"
                      />
                    </div>
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-white/50 leading-relaxed">
                      Your monthly backup is scheduled for <span className="text-white">Sunday at 03:00 AM</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-xl glass-effect hover:bg-white/10 transition-all text-center group">
                  <Plus size={20} className="mx-auto mb-2 text-accent-cyan group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Add Team</span>
                </button>
                <button className="p-4 rounded-xl glass-effect hover:bg-white/10 transition-all text-center group">
                  <MessageSquare size={20} className="mx-auto mb-2 text-accent-purple group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Broadcast</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
