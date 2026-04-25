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

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'Contact' | 'Order';
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
        body: JSON.stringify({ status: 'Read' }),
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
                         m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="Messages">
      <div className="flex flex-col h-[calc(100vh-180px)] gap-8">
        {/* Header / Search Area (Centered) */}
        <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto w-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Messages</h1>
            <p className="text-white/40">Manage your incoming inquiries and service orders.</p>
          </div>

          <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 w-full">
            {(['All', 'Contact', 'Order'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  filterType === type ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {type}
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
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Sidebar / List */}
          <div className="w-full lg:w-1/3 glass-effect rounded-[2rem] border-white/5 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-accent-cyan" size={32} />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Inbox size={24} className="text-white/20" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Your inbox is clear.</p>
                    <p className="text-white/30 text-xs mt-1">No messages found for this filter.</p>
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
                      className={`p-5 cursor-pointer transition-all hover:bg-white/[0.03] relative group ${
                        selectedMessage?._id === msg._id ? 'bg-white/[0.05]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={msg.status} />
                          <h4 className={`text-sm font-bold truncate max-w-[150px] ${
                            msg.status === 'Unread' ? 'text-white' : 'text-white/50'
                          }`}>
                            {msg.name}
                          </h4>
                        </div>
                        <span className="text-[10px] text-white/20 whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs mb-2 truncate ${
                        msg.status === 'Unread' ? 'text-white/80' : 'text-white/30'
                      }`}>
                        {msg.subject}
                      </p>
                      <div className="flex justify-between items-center">
                        <TypeBadge type={msg.type} />
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

          {/* Message Content */}
          <div className="hidden lg:flex flex-1 glass-effect rounded-[2rem] border-white/5 overflow-hidden flex flex-col">
            <AnimatePresence mode='wait'>
              {selectedMessage ? (
                <motion.div 
                  key={selectedMessage._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col h-full"
                >
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/10">
                        <User size={24} className="text-accent-cyan" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                        <p className="text-white/40 text-sm flex items-center gap-2">
                          <Mail size={14} />
                          {selectedMessage.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(selectedMessage._id, 'Archived')}
                        className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        title="Archive"
                      >
                        <Archive size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(selectedMessage._id)}
                        className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-4">
                        <TypeBadge type={selectedMessage.type} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                          Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white leading-tight mb-8">
                        {selectedMessage.subject}
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-white/70 text-lg leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                    <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-accent-cyan text-primary font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-accent-cyan/10">
                        <Send size={18} />
                        Reply via Email
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedMessage._id, 'Read')}
                        className="px-8 py-4 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 transition-all"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-6">
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
