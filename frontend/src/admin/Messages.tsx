import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Trash2,
  Loader2,
  X,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  Clock,
  Archive,
  ShoppingBag,
  Inbox,
  Send,
  Building2
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { cn } from '../utils/cn';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'Contact' | 'Order';
  source: 'Creative Orbit' | 'AZ Tech Designs';
  status: 'Unread' | 'Read' | 'Archived';
  createdAt: string;
}

const TypeBadge = ({ type }: { type: string }) => {
  const styles = {
    'Contact': 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    'Order': 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[type as keyof typeof styles]}`}>
      {type}
    </span>
  );
};

const SourceBadge = ({ source }: { source: string }) => {
  const styles = {
    'Creative Orbit': 'bg-white/5 text-white/50 border-white/10',
    'AZ Tech Designs': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[source as keyof typeof styles] || styles['Creative Orbit']}`}>
      {source || 'Creative Orbit'}
    </span>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'Unread') return <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />;
  if (status === 'Read') return <CheckCircle2 size={14} className="text-white/20" />;
  return <Archive size={14} className="text-white/20" />;
};

export const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Contact' | 'Order'>('All');
  const [filterSource, setFilterSource] = useState<'All' | 'Creative Orbit' | 'AZ Tech Designs'>('All');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setMessages(messages.map(m => m._id === id ? { ...m, status: status as any } : m));
        if (selectedMessage?._id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (response.ok) {
        setMessages(messages.filter(m => m._id !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.source || 'Creative Orbit').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || m.type === filterType;
    const messageSource = m.source || 'Creative Orbit';
    const matchesSource = filterSource === 'All' || messageSource === filterSource;
    return matchesSearch && matchesFilter && matchesSource;
  });

  return (
    <AdminLayout title="Messages">
      <div className="flex flex-col h-full lg:h-[calc(100vh-180px)] gap-6 md:gap-8">
        {/* Header / Search Area (Centered) */}
        <div className="flex flex-col items-center gap-4 md:gap-6 max-w-2xl mx-auto w-full">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Messages</h1>
            <p className="text-white/40 text-sm md:text-base">Manage your incoming inquiries and service orders.</p>
          </div>

          <div className="flex gap-1 md:gap-2 p-1 md:p-1.5 bg-white/5 rounded-2xl border border-white/5 w-full overflow-x-auto no-scrollbar">
            {(['All', 'Contact', 'Order'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-2 px-4 text-[10px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap ${filterType === type ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-1 md:gap-2 p-1 md:p-1.5 bg-white/5 rounded-2xl border border-white/5 w-full overflow-x-auto no-scrollbar">
            {(['All', 'Creative Orbit', 'AZ Tech Designs'] as const).map(source => (
              <button
                key={source}
                onClick={() => setFilterSource(source)}
                className={`flex-1 py-2 px-3 text-[10px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap ${filterSource === source ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                  }`}
              >
                {source === 'All' ? 'All Sites' : source}
              </button>
            ))}
          </div>

          <div className="relative group w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-cyan transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search your inbox..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 md:py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 overflow-hidden relative min-h-[400px]">
          {/* Sidebar / List */}
          <div className={cn(
            "w-full lg:w-1/3 glass-effect rounded-2xl md:rounded-[2rem] border-white/5 overflow-hidden flex flex-col transition-all duration-300",
            selectedMessage && "hidden lg:flex"
          )}>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="h-full flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-accent-cyan" size={32} />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Inbox size={24} className="text-white/20" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Your inbox is clear.</p>
                    <p className="text-white/30 text-[10px] mt-1">No messages found for this filter.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredMessages.map((msg) => (
                    <motion.div
                      key={msg._id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'Unread') handleUpdateStatus(msg._id, 'Read');
                      }}
                      className={`p-4 md:p-5 cursor-pointer transition-all hover:bg-white/[0.03] relative group ${selectedMessage?._id === msg._id ? 'bg-white/[0.05]' : ''
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2 md:gap-3">
                          <StatusIcon status={msg.status} />
                          <h4 className={`text-sm font-bold truncate max-w-[120px] md:max-w-[150px] ${msg.status === 'Unread' ? 'text-white' : 'text-white/50'
                            }`}>
                            {msg.name}
                          </h4>
                        </div>
                        <span className="text-[9px] md:text-[10px] text-white/20 whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-[11px] md:text-xs mb-2 truncate ${msg.status === 'Unread' ? 'text-white/80' : 'text-white/30'
                        }`}>
                        {msg.subject}
                      </p>
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <TypeBadge type={msg.type} />
                          <SourceBadge source={msg.source || 'Creative Orbit'} />
                        </div>
                        {msg.type === 'Order' && (
                          <ShoppingBag size={12} className="text-accent-purple opacity-50" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Content Area */}
          <div className={cn(
            "flex-1 lg:flex glass-effect rounded-2xl md:rounded-[2rem] border-white/5 overflow-hidden flex flex-col absolute inset-0 lg:relative z-20 bg-primary lg:bg-transparent transition-transform duration-300",
            selectedMessage ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}>
            <AnimatePresence mode='wait'>
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col h-full"
                >
                  <div className="p-4 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex gap-3 md:gap-4 items-center">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="lg:hidden p-2 text-white/40 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/10">
                        <User className="w-5 h-5 md:w-6 md:h-6 text-accent-cyan" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-xl font-bold text-white truncate max-w-[150px] md:max-w-none">{selectedMessage.name}</h3>
                        <p className="text-white/40 text-[10px] md:text-sm flex items-center gap-1.5 md:gap-2">
                          <Mail className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="truncate max-w-[120px] md:max-w-none">{selectedMessage.email}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage._id, 'Archived')}
                        className="p-2 md:p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedMessage._id)}
                        className="p-2 md:p-3 bg-white/5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                    <div className="mb-6 md:mb-10">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <TypeBadge type={selectedMessage.type} />
                        <SourceBadge source={selectedMessage.source || 'Creative Orbit'} />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/20">
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-6 md:mb-8">
                        {selectedMessage.subject}
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-white/70 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-8 border-t border-white/5 bg-white/[0.01]">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button className="flex-1 py-3.5 md:py-4 bg-accent-cyan text-primary font-bold rounded-2xl flex items-center justify-center gap-2 md:gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-accent-cyan/10 text-sm md:text-base">
                        <Send size={18} />
                        Reply via Email
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage._id, 'Read')}
                        className="py-3.5 md:py-4 px-6 md:px-8 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 transition-all text-sm md:text-base"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-10 text-center gap-6">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5 relative">
                    <MessageSquare size={40} className="text-white/10" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="absolute inset-0 bg-accent-cyan/5 rounded-full blur-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white/80">Select a message</h3>
                    <p className="text-white/30 max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                      Choose a conversation from the left panel to view the full details and take action.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
