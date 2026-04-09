import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Lock,
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Trash2, 
  Check, 
  ChevronRight, 
  Shield, 
  LayoutDashboard, 
  Database, 
  CreditCard, 
  Settings, 
  Search, 
  Bell, 
  User, 
  MoreHorizontal,
  ExternalLink,
  Info,
  Calendar,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { dashboardAPI } from '../services/api';

// --- Components ---

const Badge = ({ children, variant = 'active' }) => {
  const variants = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    revoked: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#0a0a0b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <div className="mt-4">{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessToast = ({ show, message }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0, y: 20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 20, x: '-50%' }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-xl shadow-lg"
      >
        <CheckCircle2 size={16} />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Main Page ---

const PremiumApiKeysPage = () => {
  const [rootCredentials, setRootCredentials] = useState({
    clientId: 'LOADING...',
    clientSecret: '••••••••••••••••••••••••••••••••',
    createdDate: '...'
  });

  const [keys, setKeys] = useState([
    { id: '1', name: 'Production Key', key: 'sk-live-7d2h9x4m1k5n8p0q9r2s', created: '2024-03-15', lastUsed: '2 hours ago', status: 'active' },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState('read');
  const [generatedKey, setGeneratedKey] = useState(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await dashboardAPI.getOverview();
      const data = response.data.data;
      setRootCredentials({
        clientId: data.clientId || 'NOT_PROVISIONED',
        clientSecret: data.clientSecret || 'NOT_PROVISIONED',
        createdDate: data.createdAt || 'Oct 24, 2025'
      });
    } catch (error) {
      console.error("Error fetching dashboard credentials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const toggleReveal = (id) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateKey = () => {
    // Note: This is currently a frontend-only simulation.
    // To support this in the backend, you would need an endpoint like:
    // api.post('/v1/tenant-admin/api-keys', { name, permissions })
    
    setIsLoading(true);
    setTimeout(() => {
      const newKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: newKeyName || 'Untitled Key',
        key: `sk-live-${Math.random().toString(36).substr(2, 20)}`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'active'
      };
      setGeneratedKey(newKey.key);
      setKeys([newKey, ...keys]);
      setIsLoading(false);
    }, 1200);
  };

  const handleRevokeKey = (id) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  const handleDeleteKey = (id) => {
    setKeys(keys.filter(k => k.id !== id));
  };


  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'apikeys', label: 'API Keys', icon: Key, active: true },
    { id: 'usage', label: 'Usage', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-400 font-sans selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,transparent_50%)] opacity-30" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 h-screen sticky top-0 hidden lg:flex flex-col p-6 bg-[#020203]/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Neutron</span>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                  item.active 
                    ? 'bg-white/5 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                    : 'hover:bg-white/[0.03] hover:text-zinc-200'
                }`}
              >
                <item.icon size={18} className={item.active ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                {item.label}
                {item.active && <div className="ml-auto w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
                  <p className="text-[10px] text-zinc-500 truncate">Pro Plan</p>
                </div>
              </div>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white rounded-lg transition-colors border border-white/5">
                Manage Billing
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 min-h-screen">
          {/* Top Bar */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020203]/40 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
                <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-semibold text-zinc-200">Main Project</span>
                <ChevronRight size={14} className="text-zinc-600" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search documentation..." 
                  className="bg-white/5 border border-white/5 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-64 transition-all"
                />
              </div>
              <button className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                <Bell size={18} />
              </button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
              </button>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-8 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-2 font-mono text-xs font-bold tracking-widest uppercase">
                  Security & Access
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">API Keys</h1>
                <p className="text-zinc-500 max-w-xl">
                  Manage your secret keys for authentication. These keys allow you to interact with our API programmatically. 
                  <span className="text-zinc-400 ml-1">Keep them safe.</span>
                </p>
              </div>
              <button 
                onClick={() => {
                  setGeneratedKey(null);
                  setNewKeyName('');
                  setIsCreateModalOpen(true);
                }}
                className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-xl shadow-white/5 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                Create New Key
              </button>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 mb-8 flex gap-4">
              <div className="mt-0.5">
                <AlertCircle className="text-amber-500" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-500 mb-1">Security Best Practices</p>
                <p className="text-xs text-amber-500/70 leading-relaxed">
                  Never commit your API keys to version control or expose them in client-side code. 
                  Use server-side environment variables for all confidential authentication.
                </p>
              </div>
            </div>

            {/* Project Credentials Card (Real Backend Data) */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Shield size={64} />
               </div>
               
               <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-indigo-500/10 rounded-lg">
                   <Database size={18} className="text-indigo-400" />
                 </div>
                 <h2 className="text-lg font-bold text-white tracking-tight">Project Credentials</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Client ID */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Client ID</label>
                     <span className="text-[10px] text-zinc-600 font-medium">Created {rootCredentials.createdDate}</span>
                   </div>
                   <div className="relative">
                     <input 
                       type="text" 
                       readOnly 
                       value={rootCredentials.clientId}
                       className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 font-mono text-xs text-white focus:outline-none"
                     />
                     <button 
                       onClick={() => handleCopy(rootCredentials.clientId)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                     >
                       <Copy size={14} />
                     </button>
                   </div>
                 </div>

                 {/* Client Secret */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Client Secret</label>
                     <div className="flex items-center gap-1">
                        <Lock size={10} className="text-rose-500" />
                        <span className="text-[10px] text-rose-500/70 font-bold uppercase tracking-tighter">Private</span>
                     </div>
                   </div>
                   <div className="relative">
                     <input 
                       type={revealedKeys['root'] ? "text" : "password"} 
                       readOnly 
                       value={rootCredentials.clientSecret}
                       className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 font-mono text-xs text-indigo-400/80 focus:outline-none"
                     />
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <button 
                          onClick={() => toggleReveal('root')}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                        >
                          {revealedKeys['root'] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button 
                          onClick={() => handleCopy(rootCredentials.clientSecret)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                        >
                          <Copy size={14} />
                        </button>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* API Keys Table/Cards */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl shadow-indigo-500/5">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Key size={16} className="text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Additional API Keys</h3>
                    <p className="text-[10px] text-zinc-500">Generate scoped keys for external integrations</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {keys.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Key Name</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Key Mask</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Created</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[13px]">
                      {keys.map((key) => (
                        <tr key={key.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3 text-sm font-semibold text-white">
                              {key.name}
                              <Badge variant={key.status}>{key.status}</Badge>
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-1">Last used: {key.lastUsed}</p>
                          </td>
                          <td className="px-6 py-5 font-mono text-xs">
                             <div className="flex items-center gap-2">
                                <span className={key.status === 'revoked' ? 'line-through text-zinc-700' : 'text-zinc-500'}>
                                  {revealedKeys[key.id] ? key.key : key.key.replace(/(?<=sk-live-).{8}/, '••••••••')}
                                </span>
                                {key.status !== 'revoked' && (
                                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleCopy(key.key)} className="p-1 hover:text-white"><Copy size={12} /></button>
                                    <button onClick={() => toggleReveal(key.id)} className="p-1 hover:text-white">{revealedKeys[key.id] ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                                  </div>
                                )}
                             </div>
                          </td>
                          <td className="px-6 py-5 text-zinc-500 font-medium">
                            {key.created}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {key.status === 'active' ? (
                                <button 
                                  onClick={() => handleRevokeKey(key.id)}
                                  className="text-[10px] font-bold text-rose-500/70 hover:text-rose-500 uppercase tracking-widest border border-rose-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg transition-all"
                                >
                                  Revoke
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleDeleteKey(key.id)}
                                  className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                      <Key size={24} className="text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">No additional keys</h3>
                    <p className="text-xs text-zinc-500 max-w-xs mb-6 font-medium">
                      You haven't generated any scoped API keys yet. Create one to limit access permissions.
                    </p>
                    <button 
                       onClick={() => setIsCreateModalOpen(true)}
                       className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                    >
                      Generate Key
                    </button>
                  </div>
                )}
              </div>
            </div>


            {/* Documentation Links */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Authentication Guide', desc: 'Leard how to use your keys', icon: Shield },
                { title: 'API Reference', desc: 'Full list of endpoints', icon: Database },
                { title: 'Best Practices', desc: 'Secure your integration', icon: Info },
              ].map((item, i) => (
                <a key={i} href="#" className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group overflow-hidden relative">
                  <div className="absolute -right-2 -bottom-2 text-white/[0.02] group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={80} />
                  </div>
                  <item.icon size={20} className="text-indigo-400 mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1">
                    {item.title}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-zinc-600">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Creation Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => !isLoading && setIsCreateModalOpen(false)} 
        title={generatedKey ? "Key Generated" : "Create New API Key"}
      >
        {!generatedKey ? (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Key Name</label>
              <input 
                type="text" 
                placeholder="e.g. Production Mobile App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Permissions</label>
              <div className="grid grid-cols-3 gap-2">
                {['read', 'write', 'admin'].map((perm) => (
                  <button
                    key={perm}
                    onClick={() => setNewKeyPermissions(perm)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      newKeyPermissions === perm 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]' 
                        : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                    }`}
                  >
                    {perm}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCreateKey}
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-xl font-black text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-xl"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>Generate API Key <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3">
              <div className="mt-0.5"><CheckCircle2 className="text-emerald-500" size={18} /></div>
              <p className="text-xs text-emerald-500/80 leading-relaxed font-medium">
                Your key has been generated successfully. For security reasons, <strong>we will only show this once.</strong> Make sure to copy it now.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs text-white break-all flex items-center justify-between gap-4 overflow-hidden">
                <span className="flex-1">{generatedKey}</span>
                <button 
                  onClick={() => handleCopy(generatedKey)}
                  className="shrink-0 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-sm border border-white/10 transition-all"
            >
              I've copied the key
            </button>
          </div>
        )}
      </Modal>

      <SuccessToast show={showCopyToast} message="Copied to clipboard" />
    </div>
  );
};

export default PremiumApiKeysPage;
