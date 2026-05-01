import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Globe,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Phone,
  MapPin,
  Link as LinkIcon,
  Building2,
  Zap,
  Users,
  Settings as SettingsIcon
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

type Tab = 'General' | 'Agency Profile' | 'Team' | 'Security';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : { name: 'Admin', email: '', role: 'Super Admin' };
  });

  const [adminForm, setAdminForm] = useState({
    name: adminUser.name,
    oldPassword: '',
    newPassword: ''
  });

  const [profileError, setProfileError] = useState('');

  // Team Management State
  const [admins, setAdmins] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: ['dashboard']
  });

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    agencyName: 'Digital Agency',
    contactEmail: 'contact@agency.com',
    phone: '',
    address: '',
    website: '',
    tagline: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      instagram: '',
      github: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUser(data);
        localStorage.setItem('adminUser', JSON.stringify(data));
        setAdminForm(prev => ({ ...prev, name: data.name }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleUserAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = selectedAdmin
        ? `/api/admins/${selectedAdmin._id}`
        : '/api/admins';
      const method = selectedAdmin ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        setShowUserModal(false);
        fetchAdmins();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error with user action:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleSaveAdmin = async () => {
    setSaving(true);
    setProfileError('');
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(adminForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setAdminUser(data);
      localStorage.setItem('adminUser', JSON.stringify(data));
      setSuccess(true);
      setAdminForm(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving admin profile:', error);
      setProfileError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleMaintenance = () => {
    const newVal = !settings.maintenanceMode;
    setSettings({ ...settings, maintenanceMode: newVal });
    // Auto save for toggle
    setTimeout(() => handleSave(), 100);
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-accent-cyan" size={32} />
        </div>
      </AdminLayout>
    );
  }

  const tabs: { id: Tab; icon: any }[] = [
    { id: 'General', icon: User },
    { id: 'Agency Profile', icon: Building2 },
    { id: 'Team', icon: Users },
    { id: 'Security', icon: Lock },
  ];

  return (
    <AdminLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-white/40 mt-1 text-sm md:text-base">Manage your agency identity and system preferences.</p>
          </div>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-accent-cyan text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : (
              success ? <CheckCircle2 size={18} /> : <Save size={18} />
            )}
            {success ? 'Saved' : 'Save All Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:w-full shrink-0 ${activeTab === tab.id ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20' : 'text-white/40 hover:bg-white/5 border border-transparent'
                  }`}
              >
                <tab.icon size={18} />
                <span className="text-sm font-bold">{tab.id}</span>
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'General' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="glass-effect p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 space-y-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/5 text-center sm:text-left">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple p-0.5 shrink-0">
                        <div className="w-full h-full rounded-[18px] bg-primary flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-accent-cyan font-bold text-2xl uppercase">
                            {adminUser?.name?.charAt(0) || 'A'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{adminUser?.name || 'Admin'}</h3>
                        <p className="text-sm text-white/40">{adminUser?.role || 'Super Admin'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Full Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="text"
                            value={adminForm.name}
                            onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Account Email</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="email"
                            value={adminUser?.email}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none text-white/40 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Current Password</label>
                        <div className="relative">
                          <Shield size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="password"
                            value={adminForm.oldPassword}
                            onChange={(e) => setAdminForm({ ...adminForm, oldPassword: e.target.value })}
                            placeholder="Required to change password"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white placeholder:text-white/10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">New Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="password"
                            value={adminForm.newPassword}
                            onChange={(e) => setAdminForm({ ...adminForm, newPassword: e.target.value })}
                            placeholder="Leave blank to keep current"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white placeholder:text-white/10"
                          />
                        </div>
                      </div>
                    </div>

                    {profileError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-center gap-3">
                        <AlertTriangle size={16} />
                        {profileError}
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveAdmin}
                        className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Save size={16} />
                        Update Profile
                      </button>
                    </div>
                  </div>

                  <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 ${settings.maintenanceMode
                      ? 'bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/5'
                      : 'glass-effect border-white/5'
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-3">
                        <AlertTriangle size={20} className={settings.maintenanceMode ? 'text-red-400' : 'text-accent-cyan'} />
                        Maintenance Mode
                      </h3>
                      <div
                        onClick={toggleMaintenance}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 p-1 ${settings.maintenanceMode ? 'bg-red-500' : 'bg-white/10'
                          }`}
                      >
                        <motion.div
                          animate={{ x: settings.maintenanceMode ? 24 : 0 }}
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Restricts public access to the website. Dashboard remains operational.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Agency Profile' && (
                <motion.div
                  key="agency"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="glass-effect p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                      <Globe size={20} className="text-accent-cyan" />
                      Public Identity
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Agency Name</label>
                        <div className="relative">
                          <Building2 size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="text"
                            value={settings.agencyName}
                            onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Tagline</label>
                        <div className="relative">
                          <Zap size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="text"
                            value={settings.tagline}
                            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Contact Email</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Website URL</label>
                        <div className="relative">
                          <LinkIcon size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="text"
                            value={settings.website}
                            onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="text"
                            value={settings.phone}
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Headquarters</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-5 top-4 text-white/20" />
                          <input
                            type="text"
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-effect p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                      <Share2 size={20} className="text-accent-cyan" />
                      Social Presence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: 'twitter', label: 'Twitter / X', icon: Globe },
                        { id: 'linkedin', label: 'LinkedIn', icon: Globe },
                        { id: 'instagram', label: 'Instagram', icon: Globe },
                        { id: 'github', label: 'GitHub', icon: Globe },
                      ].map((social) => (
                        <div key={social.id} className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">{social.label}</label>
                          <div className="relative">
                            <social.icon size={16} className="absolute left-5 top-4 text-white/20" />
                            <input
                              type="text"
                              value={(settings.socialLinks as any)[social.id]}
                              onChange={(e) => setSettings({
                                ...settings,
                                socialLinks: { ...settings.socialLinks, [social.id]: e.target.value }
                              })}
                              placeholder="https://..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:border-accent-cyan/50 text-white placeholder:text-white/5"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Team' && (
                <motion.div
                  key="team"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-3">
                      <Users size={20} className="text-accent-cyan" />
                      Team Members
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedAdmin(null);
                        setUserForm({ name: '', email: '', password: '', role: 'admin', permissions: ['dashboard'] });
                        setShowUserModal(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 rounded-xl text-sm font-bold hover:bg-accent-cyan/20 transition-all text-center"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="space-y-4">
                    {admins.map((admin) => (
                      <div key={admin._id} className="glass-effect p-6 rounded-2xl border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent-cyan font-bold uppercase">
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{admin.name}</p>
                            <p className="text-xs text-white/30">{admin.email} • {admin.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div className="hidden md:flex flex-wrap gap-1 justify-end max-w-[300px]">
                            {admin.permissions?.map((p: string) => (
                              <span key={p} className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-wider text-white/40 whitespace-nowrap">
                                {p}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setUserForm({ ...admin, password: '' });
                                setShowUserModal(true);
                              }}
                              className="p-2 text-white/40 hover:text-accent-cyan"
                            >
                              <SettingsIcon size={16} />
                            </button>
                            {admin._id !== adminUser.id && (
                              <button
                                onClick={() => deleteAdmin(admin._id)}
                                className="p-2 text-white/40 hover:text-red-400"
                              >
                                <AlertTriangle size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showUserModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                        onClick={() => setShowUserModal(false)}
                      />
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative glass-effect p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                      >
                        <h2 className="text-2xl font-bold mb-6">
                          {selectedAdmin ? 'Edit Member' : 'New Team Member'}
                        </h2>
                        <form onSubmit={handleUserAction} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Full Name</label>
                            <input
                              type="text"
                              required
                              value={userForm.name}
                              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-accent-cyan/50 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                            <input
                              type="email"
                              required
                              value={userForm.email}
                              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-accent-cyan/50 text-white"
                            />
                          </div>
                          {!selectedAdmin && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Initial Password</label>
                              <input
                                type="password"
                                required
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-accent-cyan/50 text-white"
                              />
                            </div>
                          )}

                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Page Permissions</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                'dashboard', 'clients', 'messages', 'leads', 'deals', 'projects', 'tasks', 'invoices', 'settings'
                              ].map((perm) => (
                                <label key={perm} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                                  <input
                                    type="checkbox"
                                    checked={userForm.permissions.includes(perm)}
                                    onChange={(e) => {
                                      const newPerms = e.target.checked
                                        ? [...userForm.permissions, perm]
                                        : userForm.permissions.filter(p => p !== perm);
                                      setUserForm({ ...userForm, permissions: newPerms });
                                    }}
                                    className="accent-accent-cyan"
                                  />
                                  <span className="text-xs capitalize text-white/60">{perm}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowUserModal(false)}
                              className="flex-1 py-3 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/5 transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={saving}
                              className="flex-1 py-3 bg-accent-cyan text-primary rounded-xl text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                              {saving ? <Loader2 className="animate-spin mx-auto" size={18} /> : (selectedAdmin ? 'Save Changes' : 'Create Member')}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'Security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="glass-effect p-8 rounded-[2.5rem] border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                      <Shield size={20} className="text-accent-cyan" />
                      System Security
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', enabled: false },
                        { label: 'Login Notifications', desc: 'Receive an email every time someone logs into your account.', enabled: true },
                        { label: 'IP White-listing', desc: 'Restrict access to specific IP addresses.', enabled: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all">
                          <div>
                            <p className="text-sm font-bold text-white">{item.label}</p>
                            <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                          </div>
                          <div className="w-10 h-5 rounded-full bg-white/10 relative p-1 cursor-not-allowed">
                            <div className={`w-3 h-3 rounded-full bg-white/20 ${item.enabled ? 'translate-x-5' : ''}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const Share2 = ({ size, className }: { size: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
