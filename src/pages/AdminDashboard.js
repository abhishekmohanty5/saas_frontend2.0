import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Zap, 
  Trash2, 
  Plus, 
  LayoutDashboard, 
  Globe, 
  ChevronRight, 
  LogOut, 
  X, 
  Loader2,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  BarChart3,
  Activity,
  ShieldCheck,
  Command,
  Database,
  Cpu,
  Layers,
  MoreVertical
} from 'lucide-react';
import { adminAPI, subscriptionAPI, aiAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/ToastProvider';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [metrics, setMetrics] = useState({ usersTotal: 0, plansTotal: 0, tenantsTotal: 0, activeSubs: 0, revenue: 0 });

  const [pages, setPages] = useState({ users: 0, plans: 0, tenants: 0 });
  const [totalPages, setTotalPages] = useState({ users: 0, plans: 0, tenants: 0 });

  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiSuggestedResult, setAiSuggestedResult] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '', features: '' });

  const fetchData = React.useCallback(async () => {
    try {
      const [usersRes, plansRes, tenantsRes, analyticsRes] = await Promise.all([
        adminAPI.getAllUsers(pages.users, 10),
        subscriptionAPI.getAllPlans(pages.plans, 10),
        adminAPI.getTenants(pages.tenants, 12),
        aiAPI.getAnalytics().catch(() => ({ data: { data: null } }))
      ]);

      const uData = usersRes.data?.data || {};
      const pData = plansRes.data?.data || {};
      const tData = tenantsRes.data?.data || {};

      setUsers(uData.content || []);
      setPlans(pData.content || []);
      setTenants(tData.content || []);
      setAnalytics(analyticsRes.data?.data);

      setTotalPages({
        users: uData.totalPages || 0,
        plans: pData.totalPages || 0,
        tenants: tData.totalPages || 0
      });

      setMetrics({
        usersTotal: uData.totalElements || 0,
        plansTotal: pData.totalElements || 0,
        tenantsTotal: tData.totalElements || 0,
        activeSubs: (uData.content || []).filter(u => u.status === 'ACTIVE').length,
        revenue: (pData.content || []).reduce((acc, p) => acc + (p.price || 0), 0) * 12
      });

    } catch (err) {
      toast.error('Sync Error', 'Failed to synchronize dashboard data.');
    } finally {
      setTimeout(() => setLoading(false), 800); 
    }
  }, [pages, toast]);

  useEffect(() => {
    if (!user || user.role !== 'ROLE_SUPER_ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPlan({
        name: newPlan.name,
        price: parseFloat(newPlan.price),
        duration: parseInt(newPlan.duration),
        features: newPlan.features
      });
      toast.success('Plan Created', 'New pricing plan has been deployed successfully.');
      setShowCreatePlan(false);
      setNewPlan({ name: '', price: '', duration: '', features: '' });
      fetchData();
    } catch (err) {
      toast.error('Creation Failed', 'Please verify the plan parameters.');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this pricing plan?')) return;    
    try {
      await adminAPI.deletePlan(planId);
      toast.success('Plan Deleted', 'Pricing plan removed successfully.');    
      fetchData();
    } catch (err) {
      toast.error('Delete Failed', 'Failed to remove the pricing plan.');
    }
  };

const runAiAnalysis = async () => {
    if (!aiDescription) return;
    setAiLoading(true);
    try {
      // Simulate real AI analysis api latency
      await new Promise(r => setTimeout(r, 2000));
      setAiSuggestedResult({
        tierName: 'Enterprise Plan',
        price: '4999',
        duration: '365',
        features: 'SSO, Priority Support, Custom SLA, Audit Logs',
        rationale: 'Optimized feature set based on typical enterprise requirements.'
      });
    } catch(err) {} finally { setAiLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-slate-200">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="absolute -inset-4 rounded-full border-t-2 border-indigo-500/30 animate-spin transition-all duration-1000" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300">Loading Dashboard...</h2>
            <p className="text-[11px] font-medium text-slate-500">
              Authenticating {user.email}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="admin-layout selection:bg-indigo-500/30">
      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutDashboard size={18} fill="currentColor" />
          </div>
          <span className="text-[15px] font-bold tracking-wide text-white nav-text ml-1">Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="nav-section-label">Main</div>
          <button onClick={() => setActiveTab('overview')} className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}>
            <LayoutDashboard size={16} /> <span className="nav-text">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('tenants')} className={`nav-item ${activeTab === 'tenants' ? 'active' : ''}`}>
            <Globe size={16} /> <span className="nav-text">Tenants</span>
          </button>
          <button onClick={() => setActiveTab('plans')} className={`nav-item ${activeTab === 'plans' ? 'active' : ''}`}>
             <Zap size={16} /> <span className="nav-text">Plans</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}>
            <Users size={16} /> <span className="nav-text">Subscribers</span>
          </button>


        </nav>
      </aside>

      {/* ── MAIN BRIDGE ── */}
      <main className="admin-main">
        <div className="admin-content relative flex flex-col flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full" />
            )}
            {activeTab === 'tenants' && (
              <motion.div key="tenants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full" />
            )}
            {activeTab === 'plans' && (
              <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full" />
            )}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full" />
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </main>

      {/* ── AI COCKPIT MODAL ── */}
      <AnimatePresence>
         {showAiModal && (
            <div className="cockpit-modal-overlay">
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="cockpit-modal">
                  <div className="p-10 space-y-10">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(109,74,255,0.4)]">
                              <Zap size={28} fill="white" className="text-white" />
                           </div>
                           <div>
                              <h2 className="text-2xl font-black tracking-tight text-white uppercase">Market Oracle v3</h2>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Autonomous Strategy Synthesis</p>
                           </div>
                        </div>
                        <button onClick={() => setShowAiModal(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                           <X size={20} className="text-slate-500" />
                        </button>
                     </div>

                     {!aiSuggestedResult && !aiLoading && (
                        <div className="space-y-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Describe Infrastructure Mission Domain</label>
                              <textarea
                                 value={aiDescription} onChange={(e) => setAiDescription(e.target.value)}
                                 placeholder="e.g. Next-Generation Cybersecurity Cluster for Decentralized Clinical Data Nodes..."
                                 className="w-full min-h-[160px] bg-black border border-white/5 rounded-2xl p-5 text-white placeholder:text-slate-800 font-mono text-sm leading-relaxed focus:outline-none focus:border-indigo-600 transition-all"
                              />
                           </div>
                           <button onClick={runAiAnalysis} className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-[#ddd] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                              EXECUTE MARKET SYNTHESIS
                           </button>
                        </div>
                     )}

                     {aiLoading && (
                        <div className="py-24 flex flex-col items-center gap-8">
                           <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                           <p className="text-xs font-black text-slate-500 animate-pulse uppercase tracking-[0.4em]">Aggregating Global Market Vectors...</p>
                        </div>
                     )}

                     {aiSuggestedResult && (
                        <div className="space-y-6">
                           <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] text-center">Engineered Tier Recommendations</p>
                           </div>
                           <div className="space-y-3">
                              {aiSuggestedResult.map((p, i) => (
                                 <div
                                    key={i}
                                    onClick={() => {
                                       setNewPlan({ ...newPlan, name: p.name, price: p.price.toString(), duration: p.billingCycle === 'YEARLY' ? '365' : '30', features: p.features });
                                       setShowAiModal(false); setShowCreatePlan(true);
                                    }}
                                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500 hover:bg-indigo-500/5 cursor-pointer transition-all group"
                                 >
                                    <div>
                                       <div className="font-black text-white group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{p.name}</div>
                                       <p className="text-[10px] text-slate-500 mt-1 font-medium italic">{p.description}</p>
                                    </div>
                                    <div className="text-2xl font-black text-indigo-500">₹{p.price}</div>
                                 </div>
                              ))}
                           </div>
                           <button onClick={() => setAiSuggestedResult(null)} className="w-full py-4 text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Adjust Synthesis Variables</button>
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default AdminDashboard;
