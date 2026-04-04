import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, subscriptionAPI, aiAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/ToastProvider';
import Footer from '../components/Footer';

// Simple Icon component for Admin Dashboard
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiSuggestedResult, setAiSuggestedResult] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    duration: '',
    features: ''
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://saassubscription-production.up.railway.app/api';

      const [usersRes, plansRes, tenantsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        subscriptionAPI.getAllPlans(),
        fetch(`${API_BASE_URL} /admin/tenants`, {
          headers: { Authorization: `Bearer ${token} ` }
        }).then(r => r.json())
      ]);

      setUsers(usersRes.data);
      setPlans(plansRes.data);
      setTenants(tenantsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      toast.success('Plan created', 'The pricing plan was successfully added.');
      setShowCreatePlan(false);
      setNewPlan({ name: '', price: '', duration: '', features: '' });
      fetchData();
    } catch (err) {
      if (err.response?.status === 409 ||
        (err.response?.status === 500 && err.message?.includes('Duplicate'))) {
        toast.error('Creation failed', 'A plan with this name already exists.');
      } else {
        toast.error('Creation failed', err.response?.data?.message || 'Unknown error occurred.');
      }
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }
    try {
      await adminAPI.deletePlan(planId);
      toast.success('Plan deleted', 'The pricing plan has been permanently removed.');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed', 'Could not delete the selected plan.');
    }
  };

  const METRIC_CARDS = [
    { label: 'Total Users', value: users.length.toString(), change: '+4.5%', isPositive: true },
    { label: 'Total Plans', value: plans.length.toString(), change: 'Stable', isPositive: true },
    { label: 'Platform Revenue', value: '₹' + plans.reduce((acc, p) => acc + (p.price || 0), 0) * 10, change: '+12.5%', isPositive: true },
    { label: 'Active Subscriptions', value: users.filter(u => u.status === 'ACTIVE').length.toString(), change: '+2.4%', isPositive: true },
  ];

  if (loading) {
    return <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading secure admin gateway...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Main layout ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

        {/* ── TOP HEADER ── */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}>
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#f5f5f5', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>&larr; Exit Admin</button>
            Super Admin Control Panel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>SYSTEM ADMIN / {user.email}</span>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15)' }} />
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ padding: '32px 40px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}>Platform Metrics</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>Global overview of users, active tenants, and revenue models.</p>
            </div>
          </div>

          {/* ── METRIC CARDS OVERVIEW ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {METRIC_CARDS.map((card, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>{card.label}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-1px' }}>{card.value}</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: card.isPositive ? '#22c55e' : '#ef4444',
                    background: card.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginBottom: '4px'
                  }}>
                    {card.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Plans Section */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Pricing Plans</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { setAiSuggestedResult(null); setAiDescription(""); setShowAiModal(true); }}
                    style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Icon name="zap" size={14} /> AI Insights
                  </button>
                  <button
                    onClick={() => setShowCreatePlan(!showCreatePlan)}
                    style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + New Plan
                  </button>
                </div>
              </div>

              {showCreatePlan && (
                <form onSubmit={handleCreatePlan} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <input type="text" placeholder="Plan Name" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--surface)', padding: '10px 12px', borderRadius: '6px', outline: 'none' }} required />
                    <input type="number" placeholder="Price (₹)" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} style={{ width: '100px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--surface)', padding: '10px 12px', borderRadius: '6px', outline: 'none' }} required />
                    <input type="number" placeholder="Days" value={newPlan.duration} onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })} style={{ width: '80px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--surface)', padding: '10px 12px', borderRadius: '6px', outline: 'none' }} required />
                  </div>
                  <input type="text" placeholder="Features (comma separated)" value={newPlan.features} onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })} style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--surface)', padding: '10px 12px', borderRadius: '6px', outline: 'none', marginBottom: '12px' }} required />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowCreatePlan(false)} style={{ background: 'transparent', color: 'var(--muted)', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                    <button type="submit" style={{ background: '#3b82f6', color: 'var(--surface)', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Create</button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {plans.map(plan => (
                  <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600 }}>{plan.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted)' }}>₹{plan.price} / {plan.durationInDays} days</div>
                    </div>
                    <button onClick={() => handleDeletePlan(plan.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Delete</button>
                  </div>
                ))}
                {plans.length === 0 && <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No plans available.</div>}
              </div>
            </div>

            {/* Users Section */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>User Directory</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  <span>ID</span>
                  <span>Identity</span>
                  <span>Role</span>
                </div>
                {users.map(u => (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--muted)', fontFamily: 'monospace' }}>#{u.id}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500 }}>{u.username || 'N/A'}</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{u.email}</span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '20px',
                      width: 'fit-content',
                      background: u.role === 'ROLE_SUPER_ADMIN' || u.role === 'ROLE_TENANT_ADMIN' ? 'rgba(162, 89, 255, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: u.role === 'ROLE_SUPER_ADMIN' || u.role === 'ROLE_TENANT_ADMIN' ? '#a259ff' : '#22c55e'
                    }}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tenants Section */}
          <div style={{ marginTop: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Platform Tenants</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {tenants.map(t => (
                <div key={t.id} style={{ padding: '20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--surface)' }}>{t.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>ID: {t.id}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    Email: <span style={{ color: 'var(--ink)' }}>{t.email}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                    Created: <span style={{ color: 'var(--ink)' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {tenants.length === 0 && <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No active tenants found.</div>}
            </div>
          </div>

        </div>

        {/* --- AI STRATEGY MODAL --- */}
        {showAiModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '100%', maxWidth: '500px', background: 'var(--surface)',
              borderRadius: '24px', padding: '40px', position: 'relative',
              border: '1px solid var(--border)', boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15)'
            }}>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
              >
                <Icon name="close" size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="zap" size={28} color="#3b82f6" />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>AI Market Intelligence</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Generate optimal pricing strategies for tenants.</p>
                </div>
              </div>

              {!aiSuggestedResult && !aiLoading && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Describe the Business Domain</label>
                  <textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="e.g. A global fintech platform needing high-security infrastructure..."
                    style={{
                      width: '100%', height: '140px', padding: '16px', borderRadius: '16px', background: 'var(--bg)', border: '1px solid var(--border)',
                      fontSize: '14px', color: 'var(--surface)', outline: 'none', resize: 'none', marginBottom: '24px', lineHeight: '1.6'
                    }}
                  />
                  <button
                    onClick={async () => {
                      if (!aiDescription.trim()) { toast.error("Missing Info", "Please describe the domain first"); return; }
                      setAiLoading(true);
                      try {
                        const res = await aiAPI.generatePlans(aiDescription);
                        setAiSuggestedResult(res.data.data);
                      } catch (e) {
                        const errorMsg = e.response?.data?.message || "Failed to generate strategies. Please try again.";
                        toast.error("AI Error", errorMsg);
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                    style={{
                      width: '100%', background: '#3b82f6', color: 'var(--surface)', borderRadius: '10px', border: 'none',
                      padding: '16px', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                      boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15)', transition: 'all 0.2s'
                    }}
                  >
                    Analyze & Generate Models
                  </button>
                </div>
              )}

              {aiLoading && (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', border: "3px solid var(--border)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spinAi 1s linear infinite", margin: '0 auto 20px' }} />
                  <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Computing market-aligned subscription models...</p>
                  <style>{`@keyframes spinAi { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {aiSuggestedResult && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>ALGORITHMIC RECOMMENDATIONS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {aiSuggestedResult.map((p, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setNewPlan({
                            ...newPlan,
                            name: p.name,
                            price: p.price.toString(),
                            duration: p.billingCycle === 'YEARLY' ? '365' : '30',
                            features: p.features
                          });
                          setShowAiModal(false);
                          setShowCreatePlan(true);
                        }}
                        style={{
                          padding: '16px 20px', borderRadius: '16px', background: 'var(--bg)', border: '1px solid var(--border)',
                          cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = 'var(--surface)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--surface)' }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.description}</div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#3b82f6' }}>₹{p.price}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setAiSuggestedResult(null)}
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '10px', padding: '12px', marginTop: '24px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    &larr; Refine Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
