import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';
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
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    subtitle: "",
    price: "",
    billingCycle: "MONTHLY",
    features: ""
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
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8e4f3 0%, #d4e4f7 100%)",
      color: "#1e1b4b",
      fontFamily: "var(--ff-sans)"
    }}>
      <ConsoleSidebar
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        activeTab={activeTab} tenantName={dashboard?.tenantName}
        currentPlan={dashboard?.currentPlan}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>

        {/* Top Nav Bar */}
        <header style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          background: "rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 8 }}>
            <span>Console</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#1e1b4b", fontWeight: 600 }}>Overview</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }} />
              System Online
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, boxShadow: "0 4px 10px rgba(99, 102, 241, 0.2)"
            }}>
              {(dashboard?.tenantName || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

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
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 }}>
                      <span style={{ fontWeight: 600 }}>Active</span>
                      <span style={{ color: "#64748b" }}>NaN%</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(99, 102, 241, 0.1)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #10b981)", width: "0%" }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 24, padding: "16px", background: "rgba(99, 102, 241, 0.05)", borderRadius: 12 }}>
                    <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>Track how your user base is distributed across various subscription statuses.</p>
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
                  <PlanCard key={i} plan={plan} />
                )) : (
                  <div style={{ gridColumn: "1/-1", padding: 60, textAlign: "center", background: "rgba(255, 255, 255, 0.4)", borderRadius: 24 }}>
                    <p style={{ color: "#64748b" }}>No plans created yet. Start by adding your first subscription tier.</p>
                  </div>
                )}
              </div>

              {/* Create Plan Modal */}
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
                      onClick={() => setShowPlanModal(false)}
                      style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                      <Icon name="close" size={24} />
                    </button>

                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>Create New Plan</h2>
                    <p style={{ color: '#64748b', marginBottom: 32 }}>Develop a new subscription tier for your infrastructure.</p>

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
                            await api.post('/developer/tenant-plans', {
                              ...newPlan,
                              price: parseFloat(newPlan.price),
                            });
                            toast.success("Success", "Plan created successfully");
                            setShowPlanModal(false);
                            setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "" });
                            fetchData();
                          } catch (err) {
                            toast.error("Failed", "Could not create plan");
                          } finally {
                            setIsSubmittingPlan(false);
                          }
                        }}
                        style={{ background: '#1e1b4b', color: '#FFF', borderRadius: 12, border: 'none', padding: '16px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 12, transition: 'all 0.2s', opacity: isSubmittingPlan ? 0.7 : 1 }}
                      >
                        {isSubmittingPlan ? 'Creating...' : 'Launch Plan'}
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

function PlanCard({ plan }) {
  // Parse features string (assuming newline or comma separated)
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
      transition: "transform 0.3s ease"
    }}>
      <h4 style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", marginBottom: 4 }}>{plan.name}</h4>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>{plan.billingCycle.toLowerCase()} access to full infrastructure.</p>

      <div style={{ fontSize: 48, fontWeight: 900, color: "#1e1b4b", marginBottom: 12, letterSpacing: "-2px" }}>
        {plan.price === 0 ? "Free" : `₹${plan.price}`}
      </div>
      <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>{plan.description || "Level up productivity and creativity with expanded access."}</p>

      <button style={{
        background: "#020617", color: "#FFF", borderRadius: 14,
        padding: "16px", border: "none", fontWeight: 700, fontSize: 16,
        marginBottom: 32, cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
      }}>
        Upgrade to {plan.name}
      </button>

      <div style={{ display: "grid", gap: 16 }}>
        {features.map((feature, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Icon name="check" size={12} color="#4f46e5" />
            </div>
            <span style={{ fontSize: 15, color: "#475569", fontWeight: 500 }}>{feature.trim()}</span>
          </div>
        ))}
        {features.length === 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={12} color="#4f46e5" />
              </div>
              <span style={{ fontSize: 15, color: "#475569", fontWeight: 500 }}>Standard API access</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.4 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={12} color="#94a3b8" />
              </div>
              <span style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>Priority support</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
