import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastProvider';
import api from '../services/api';

// ─── ICONS (SVG inline) ───────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "#64748b" }) => {
  const icons = {
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    chart: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// Simple Sparkline Mockup
const Sparkline = ({ color }) => (
  <svg width="80" height="30" viewBox="0 0 80 30" style={{ opacity: 0.8 }}>
    <path
      d="M0 25 L10 20 L20 23 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || "overview");

  useEffect(() => {
    if (queryTab) setActiveTab(queryTab);
  }, [queryTab]);

  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, cancelled: 0, pending: 0 });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    subtitle: "",
    price: "",
    billingCycle: "MONTHLY",
    features: "",
    active: true
  });

  const handleUnauth = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { handleUnauth(); return; }

      const [dashRes, statsRes, plansRes] = await Promise.allSettled([
        api.get('/dashboard'),
        api.get('/developer/tenant-stats'),
        api.get('/developer/tenant-plans')
      ]);

      const getVal = (res, fallback = null) => res.status === 'fulfilled' ? res.value.data.data : fallback;

      setDashboard(getVal(dashRes));
      setStats(getVal(statsRes, { total: 0, active: 0, cancelled: 0, pending: 0 }));
      setPlans(getVal(plansRes, []));

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [handleUnauth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#ffffff" }}>
      <div style={{ width: 40, height: 40, border: "3px solid #f1f5f9", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8e4f3 0%, #d4e4f7 100%)",
      color: "#1e1b4b",
      fontFamily: "var(--ff-sans)",
      paddingTop: "68px"
    }}>
      <Navbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>
        <ConsoleSidebar
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          activeTab={activeTab} tenantName={dashboard?.tenantName}
          currentPlan={dashboard?.currentPlan}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 68px)", overflowY: "auto" }}>

          {/* Secondary Breadcrumb Bar */}
          <div style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            background: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            position: "sticky",
            top: 0,
            zIndex: 9
          }}>
            <div style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 8 }}>
              <span>Console</span>
              <span style={{ color: "#cbd5e1" }}>/</span>
              <span style={{ color: "#1e1b4b", fontWeight: 600 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }} />
                LIVE STATUS
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700
              }}>
                {(dashboard?.tenantName || 'A')[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ padding: "40px 32px" }}>

            {activeTab === 'overview' && (
              <>
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-1px", fontFamily: "var(--ff-h)" }}>Dashboard Overview</h1>
                  <p style={{ color: "#64748b", marginTop: 4, fontSize: 16 }}>Monitor your tenant infrastructure and user base activity.</p>
                </div>

                {/* Stats Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 24,
                  marginBottom: 40
                }}>
                  {/* Total End Users */}
                  <StatCard
                    label="Total End Users"
                    value={stats.total}
                    icon="users"
                    iconBg="rgba(59, 130, 246, 0.1)"
                    iconColor="#3b82f6"
                    sparklineColor="#3b82f6"
                  />
                  {/* Active Subscriptions */}
                  <StatCard
                    label="Active Subscriptions"
                    value={stats.active}
                    icon="zap"
                    iconBg="rgba(16, 185, 129, 0.1)"
                    iconColor="#10b981"
                    sparklineColor="#10b981"
                  />
                  {/* API Usage */}
                  <StatCard
                    label="API Usage"
                    value={dashboard?.apiCallCount || 0}
                    icon="chart"
                    iconBg="rgba(139, 92, 246, 0.1)"
                    iconColor="#8b5cf6"
                    sparklineColor="#8b5cf6"
                  />
                  {/* Plan Days Left */}
                  <StatCard
                    label="Plan Days Left"
                    value={dashboard?.daysRemaining || 0}
                    icon="clock"
                    iconBg="rgba(245, 158, 11, 0.1)"
                    iconColor="#f59e0b"
                    sparklineColor="#f59e0b"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                  {/* Recent Activity */}
                  <section style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)", padding: 32, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b" }}>Recent Activity</h3>
                      <button style={{ background: "rgba(99, 102, 241, 0.1)", border: "none", color: "#4f46e5", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}>View all</button>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ textAlign: "left", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          <th style={{ paddingBottom: 20 }}>User</th>
                          <th style={{ paddingBottom: 20 }}>Plan</th>
                          <th style={{ paddingBottom: 20 }}>Amount</th>
                          <th style={{ paddingBottom: 20 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ fontSize: 14 }}>
                          <td colSpan="4" style={{ padding: "60px 0", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>No recent activity to show in your infrastructure.</td>
                        </tr>
                      </tbody>
                    </table>
                  </section>

                  {/* User Status Mix */}
                  <section style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)", padding: 32, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", marginBottom: 24 }}>User Status Mix</h3>

                    {[
                      { label: 'Active', value: stats.active, color: '#10b981' },
                      { label: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
                      { label: 'Pending', value: stats.pending, color: '#f59e0b' }
                    ].map((item, idx) => {
                      const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
                      return (
                        <div key={idx} style={{ marginTop: idx === 0 ? 0 : 20 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                            <span style={{ fontWeight: 600, color: '#475569' }}>{item.label}</span>
                            <span style={{ color: "#64748b", fontWeight: 700 }}>{percentage}%</span>
                          </div>
                          <div style={{ height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: item.color, width: `${percentage}%`, transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
                          </div>
                        </div>
                      );
                    })}

                    <div style={{ marginTop: 32, padding: "16px", background: "rgba(99, 102, 241, 0.05)", borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        Total Population: <strong style={{ color: '#1e1b4b' }}>{stats.total}</strong> active nodes across your infrastructure mesh.
                      </p>
                    </div>
                  </section>
                </div>
              </>
            )}

            {activeTab === 'credentials' && (
              <div style={{ maxWidth: 800 }}>
                <div style={{ marginBottom: 32 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", fontFamily: "var(--ff-h)" }}>Infrastructure Credentials</h1>
                  <p style={{ color: "#64748b", marginTop: 4 }}>Secure keys to authenticate your application with Aegis Infra infrastructure.</p>
                </div>

                <div style={{ display: "grid", gap: 20 }}>
                  {[
                    { label: "Client ID", value: dashboard?.clientId, type: "public" },
                    { label: "Client Secret", value: dashboard?.clientSecret, type: "secret" },
                    { label: "Tenant ID", value: dashboard?.tenantId, type: "public" }
                  ].map((cred, i) => (
                    <div key={i} style={{
                      background: "rgba(255, 255, 255, 0.65)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 20,
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      padding: 24,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.05)"
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>{cred.label}</div>
                        <div style={{ fontFamily: "var(--ff-mono)", fontSize: 15, color: "#1e1b4b", background: "rgba(0,0,0,0.03)", padding: "4px 8px", borderRadius: 6 }}>
                          {cred.type === 'secret' && !showSecret ? '••••••••••••••••' : cred.value || 'N/A'}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        {cred.type === 'secret' && (
                          <button onClick={() => setShowSecret(!showSecret)} style={{ background: "rgba(99, 102, 241, 0.1)", border: "none", padding: "8px 12px", borderRadius: 8, color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}>
                            {showSecret ? 'Hide' : 'Reveal'}
                          </button>
                        )}
                        <button
                          onClick={() => { navigator.clipboard.writeText(cred.value); toast.success("Copied", `${cred.label} copied to clipboard`); }}
                          style={{ background: "#6366f1", border: "none", padding: "8px 16px", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600 }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'plans' && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", fontFamily: "var(--ff-h)" }}>Subscription Plans</h1>
                    <p style={{ color: "#64748b", marginTop: 4 }}>Define and manage plans available for your end-users.</p>
                  </div>
                  <button
                    onClick={() => setShowPlanModal(true)}
                    style={{ background: "#6366f1", color: "#FFF", borderRadius: 10, border: "none", padding: "12px 24px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
                  >
                    + Create New Plan
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
                  {plans.length > 0 ? plans.map((plan, i) => (
                    <PlanCard
                      key={i}
                      plan={plan}
                      onEdit={(p) => {
                        setEditingPlanId(p.id);
                        setNewPlan({
                          name: p.name,
                          description: p.description || "",
                          price: p.price.toString(),
                          billingCycle: p.billingCycle,
                          features: p.features || "",
                          active: p.active
                        });
                        setShowPlanModal(true);
                      }}
                      onDelete={async (id) => {
                        if (window.confirm("Are you sure you want to decommission this plan?")) {
                          try {
                            await api.delete(`/developer/tenant-plans/${id}`);
                            toast.success("Decommissioned", "Plan has been removed from infrastructure");
                            fetchData();
                          } catch (err) {
                            toast.error("Failure", "Could not remove plan");
                          }
                        }
                      }}
                    />
                  )) : (
                    <div style={{ gridColumn: "1/-1", padding: 60, textAlign: "center", background: "rgba(255, 255, 255, 0.4)", borderRadius: 24 }}>
                      <p style={{ color: "#64748b" }}>No plans created yet. Start by adding your first subscription tier.</p>
                    </div>
                  )}
                </div>

                {/* Create/Edit Plan Modal */}
                {showPlanModal && (
                  <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{
                      width: '100%', maxWidth: '500px', background: '#FFFFFF',
                      borderRadius: 32, padding: 40, position: 'relative',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                      <button
                        onClick={() => {
                          setShowPlanModal(false);
                          setEditingPlanId(null);
                          setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
                        }}
                        style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                      >
                        <Icon name="close" size={24} />
                      </button>

                      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>{editingPlanId ? 'Update Infrastructure Node' : 'Create New Plan'}</h2>
                      <p style={{ color: '#64748b', marginBottom: 32 }}>{editingPlanId ? 'Modify configuration for this subscription tier.' : 'Develop a new subscription tier for your infrastructure.'}</p>

                      <div style={{ display: 'grid', gap: 20 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Name</label>
                          <input
                            type="text" placeholder="e.g. Pro, Enterprise, Free"
                            value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 15 }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price (INR)</label>
                            <input
                              type="number" placeholder="0"
                              value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 15 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cycle</label>
                            <select
                              value={newPlan.billingCycle} onChange={(e) => setNewPlan({ ...newPlan, billingCycle: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 15, background: 'white' }}
                            >
                              <option value="MONTHLY">Monthly</option>
                              <option value="YEARLY">Yearly</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                          <textarea
                            placeholder="Brief summary of the plan..."
                            value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 15, height: 80, resize: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features (One per line)</label>
                          <textarea
                            placeholder="JWT Authentication&#10;Cloud Storage&#10;24/7 Support"
                            value={newPlan.features} onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 15, height: 100, resize: 'none' }}
                          />
                        </div>

                        <button
                          disabled={isSubmittingPlan}
                          onClick={async () => {
                            if (!newPlan.name || !newPlan.price) {
                              toast.error("Invalid Input", "Please fill required fields");
                              return;
                            }
                            setIsSubmittingPlan(true);
                            try {
                              if (editingPlanId) {
                                await api.put(`/developer/tenant-plans/${editingPlanId}`, {
                                  ...newPlan,
                                  price: parseFloat(newPlan.price),
                                });
                                toast.success("Updated", "Infrastructure node reconfigured");
                              } else {
                                await api.post('/developer/tenant-plans', {
                                  ...newPlan,
                                  price: parseFloat(newPlan.price),
                                });
                                toast.success("Success", "Plan created successfully");
                              }
                              setShowPlanModal(false);
                              setEditingPlanId(null);
                              setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
                              fetchData();
                            } catch (err) {
                              toast.error("Failed", editingPlanId ? "Could not update plan" : "Could not create plan");
                            } finally {
                              setIsSubmittingPlan(false);
                            }
                          }}
                          style={{ background: '#1e1b4b', color: '#FFF', borderRadius: 12, border: 'none', padding: '16px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 12, transition: 'all 0.2s', opacity: isSubmittingPlan ? 0.7 : 1 }}
                        >
                          {isSubmittingPlan ? (editingPlanId ? 'Updating...' : 'Creating...') : (editingPlanId ? 'Update Node' : 'Launch Plan')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(!['overview', 'credentials', 'plans'].includes(activeTab)) && (
              <div style={{ padding: 60, textAlign: "center", background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b" }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                <p style={{ color: "#64748b", marginTop: 12 }}>This enterprise feature is currently being provisioned for your tenant.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, iconBg, iconColor, sparklineColor }) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(10px)",
      borderRadius: 24,
      border: "1px solid rgba(255, 255, 255, 0.5)",
      padding: 28,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)",
      transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    }}>
      <style>{`
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.1);
                }
            `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${iconColor}22`
        }}>
          <Icon name={icon} color={iconColor} />
        </div>
        <Sparkline color={sparklineColor} />
      </div>

      <div style={{ fontSize: 36, fontWeight: 800, color: "#1e1b4b", marginBottom: 6, letterSpacing: "-1px" }}>{value}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#64748b" }}>{label}</div>
    </div>
  );
}

function PlanCard({ plan, onDelete, onEdit }) {
  const features = plan.features ? plan.features.split(/[,\n]/).filter(f => f.trim()) : [];

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(12px)",
      borderRadius: 32,
      border: "1px solid rgba(255, 255, 255, 0.6)",
      padding: 40,
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04)",
      transition: "all 0.3s ease",
      position: 'relative',
      overflow: 'hidden'
    }} className="management-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h4 style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b" }}>{plan.name}</h4>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: plan.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            color: plan.active ? '#10b981' : '#f43f5e',
            padding: '4px 8px',
            borderRadius: 6
          }}>
            {plan.active ? 'Active Node' : 'Inactive'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEdit?.(plan)}
            style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none', padding: '8px', borderRadius: 10, cursor: 'pointer', color: '#4f46e5' }}
            title="Edit Plan"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(plan.id)}
            style={{ background: 'rgba(244, 63, 94, 0.1)', border: 'none', padding: '8px', borderRadius: 10, cursor: 'pointer', color: '#f43f5e' }}
            title="Delete Plan"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", marginBottom: 8, letterSpacing: "-2px" }}>
        {plan.price === 0 ? "Free" : `₹${plan.price}`}
        <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600, letterSpacing: 0 }}>/{plan.billingCycle.toLowerCase()}</span>
      </div>

      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.6, minHeight: 44 }}>
        {plan.description || "Infrastructure tier for standard SaaS operations."}
      </p>

      <div style={{ display: "grid", gap: 14, marginTop: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Node Capabilities</div>
        {features.length > 0 ? features.map((feature, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "rgba(99, 102, 241, 0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Icon name="check" size={10} color="#4f46e5" />
            </div>
            <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{feature.trim()}</span>
          </div>
        )) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={10} color="#94a3b8" />
            </div>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Base system protocols</span>
          </div>
        )}
      </div>
    </div>
  );
}
