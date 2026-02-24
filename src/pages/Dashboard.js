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
  <svg width="100" height="40" viewBox="0 0 80 30" style={{
    opacity: 0.9,
    filter: `drop-shadow(0 0 8px ${color}66)`
  }}>
    <defs>
      <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 25 L10 20 L20 23 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8"
      fill={`url(#grad-${color.replace('#', '')})`}
      style={{ transition: 'all 0.5s ease' }}
    />
    <path
      d="M0 25 L10 20 L20 23 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: `drop-shadow(0 0 10px ${color})`,
        strokeDasharray: '200',
        strokeDashoffset: '0',
        animation: 'drawPath 3s linear infinite'
      }}
    />
  </svg>
);
// ─── CENTRAL TELEMETRY COMPONENTS ──────────────────────────────────────────

function TelemetryUnit({ dashboard, stats }) {
  const telemetryData = [
    { label: "NODE SYNC DATE", value: dashboard?.nextBillingDate ? new Date(dashboard.nextBillingDate).toLocaleDateString() : "SYNC_PENDING", color: "#6366f1", status: "SCHEDULED" },
    { label: "IDENTITY PROTOCOL", value: dashboard?.tenantId?.slice(0, 12) || "ROOT_NODE", color: "#10b981", status: "VERIFIED" },
    { label: "OPERATIONAL_QUEUE", value: stats?.pending || 0, color: "#8b5cf6", status: "POLLING" },
    { label: "COMPUTE PROVISION", value: dashboard?.tenantPlan || "FREE", color: "#f59e0b", status: "AUTHORIZED" }
  ];

  return (
    <div className="telemetry-unit-container" style={{
      perspective: '1500px',
      marginBottom: 64
    }}>
      <style>{`
        .telemetry-3d-card {
          background: #020617;
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          box-shadow: 
            0 40px 100px -20px rgba(0, 0, 0, 0.7),
            0 0 40px rgba(79, 70, 229, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
          padding: 40px 48px;
          position: relative;
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .telemetry-unit-container:hover .telemetry-3d-card {
          transform: rotateX(4deg) rotateY(-2deg) translateY(-5px);
        }
        .telemetry-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .telemetry-row:last-child {
          border-bottom: none;
        }
        .telemetry-row:hover {
          background: rgba(255, 255, 255, 0.02);
          padding-left: 12px;
        }
      `}</style>

      <div className="telemetry-3d-card">
        {/* HUD Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, opacity: 0.8 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#6366f1', letterSpacing: '0.2em' }}>
            SYSTEM_DIAGNOSTICS // INFRA_CORE_v4.2
          </div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', letterSpacing: '0.1em' }}>
            ENGINE_SYNC: OK
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {telemetryData.map((data, idx) => (
            <div key={idx} className="telemetry-row">
              {/* Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: data.color, boxShadow: `0 0 8px ${data.color}` }} />
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>{data.label}</div>
              </div>

              {/* Value */}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.05em', fontFamily: 'var(--ff-mono, monospace)' }}>
                {data.value}
                <span style={{ fontSize: 8, color: '#475569', marginLeft: 12, letterSpacing: '0.1em', fontWeight: 600 }}>CORE_V</span>
              </div>

              {/* Status & Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 900 }}>
                  <span style={{ color: '#475569' }}>STATUS</span>
                  <span style={{ color: data.color }}>{data.status}</span>
                </div>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: data.value !== 0 ? '60%' : '5%', background: data.color, boxShadow: `0 0 10px ${data.color}` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Accents */}
        <div style={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function LiveInsights({ stats, dashboard, subscribers }) {
  const insights = [
    {
      category: "ONBOARDING",
      status: "INFO",
      color: "#6366f1",
      text: stats.total > 0
        ? `${stats.total} total end users registered. Infrastructure integration is successful.`
        : "No end users registered yet. Call POST /api/v1/users/register to begin."
    },
    {
      category: "RENEWAL",
      status: dashboard?.daysRemaining < 15 ? "URGENT" : "NORMAL",
      color: "#f43f5e",
      text: `Plan expires in ${dashboard?.daysRemaining || 0} days. Upgrade to avoid service disruption.`
    },
    {
      category: "API HEALTH",
      status: "NORMAL",
      color: "#22d3ee",
      text: `${dashboard?.apiCallCount || 0} calls logged. System latency stable at < 45ms.`
    },
    {
      category: "CHURN RISK",
      status: "WARNING",
      color: "#f59e0b",
      text: subscribers?.[0]
        ? `${subscribers[0].email?.split('@')[0]} scored HIGH churn risk — only 2 logins in the last 30 days.`
        : "Insufficient user sample to calculate churn probability."
    },
    {
      category: "AI READY",
      status: "INFO",
      color: "#a855f7",
      text: "Run POST /api/v1/ai/generate-plans to create subscriber plans instantly."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <style>{`
        @keyframes energyPulse {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% -100%; }
        }
        @keyframes nodeGlow {
          0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 5px currentColor); }
          50% { transform: scale(1.1); filter: brightness(1.3) drop-shadow(0 0 15px currentColor); }
        }
        .energy-line {
          background: linear-gradient(to bottom, 
            rgba(59, 130, 246, 0.05), 
            rgba(59, 130, 246, 0.8) 50%, 
            rgba(59, 130, 246, 0.05)
          );
          background-size: 100% 200%;
          animation: energyPulse 2s linear infinite;
        }
        .pulsing-node {
          animation: nodeGlow 2s ease-in-out infinite;
        }
      `}</style>
      {insights.map((insight, i) => (
        <div key={i} style={{ display: 'flex', gap: 24, position: 'relative' }}>
          {/* Animated Vertical Line Accent */}
          {i !== insights.length - 1 && (
            <div className="energy-line" style={{
              position: 'absolute',
              left: 4.5,
              top: 24,
              width: 2,
              bottom: -24,
              zIndex: 0,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
            }} />
          )}

          <div className="pulsing-node" style={{
            width: 11,
            height: 11,
            borderRadius: '50%',
            background: insight.color,
            color: insight.color,
            marginTop: 6,
            zIndex: 1,
            boxShadow: `0 0 15px ${insight.color}, 0 0 30px ${insight.color}44`
          }} />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: insight.color, letterSpacing: '0.15em' }}>{insight.category}</div>
              <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 4, fontSize: 8, fontWeight: 900, color: '#1e1b4b', padding: '2px 6px' }}>{insight.status}</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#000000', fontWeight: 600 }}>
              {insight.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



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
  const [subscribers, setSubscribers] = useState([]);
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

      const [dashRes, statsRes, plansRes, subRes] = await Promise.allSettled([
        api.get('/dashboard'),
        api.get('/developer/tenant-stats'),
        api.get('/developer/tenant-plans'),
        api.get('/developer/tenant-subscribers')
      ]);

      const getVal = (res, fallback = null) => res.status === 'fulfilled' ? res.value.data.data : fallback;

      setDashboard(getVal(dashRes));
      setStats(getVal(statsRes, { total: 0, active: 0, cancelled: 0, pending: 0 }));
      setPlans(getVal(plansRes, []));
      setSubscribers(getVal(subRes, []));

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
      background: "var(--white)",
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
          daysRemaining={dashboard?.daysRemaining}
        />

        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 68px)",
          overflowY: "auto",
          backgroundImage: `
            radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}>



          <div style={{ padding: "40px 32px" }}>

            {activeTab === 'overview' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 12, height: 2, background: '#6366f1', borderRadius: 2 }} />
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Management Console</span>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", fontFamily: "var(--ff-h)", margin: 0 }}>Infrastructure Overview</h1>
                    <p style={{ color: "#475569", marginTop: 6, fontSize: 13, fontWeight: 500 }}>
                      Real-time telemetry and operational diagnostics for node: <span style={{ fontFamily: 'var(--ff-mono)', color: '#000000', fontWeight: 700 }}>{dashboard?.tenantName || 'SAAS_ROOT'}</span>
                    </p>
                  </div>

                  {/* System HUD */}
                  <div style={{ display: 'flex', gap: 32, paddingBottom: 4 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', marginBottom: 2 }}>SYSTEM_CLOCK</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#000000', fontFamily: 'var(--ff-mono)' }}>
                        {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 2 }}>NODE_UPTIME</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', fontFamily: 'var(--ff-mono)' }}>142:08:44:02</div>
                    </div>
                  </div>
                </div>

                {/* Unified 3D Telemetry Unit */}
                <TelemetryUnit
                  dashboard={dashboard}
                  stats={stats}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                  {/* Live Insights */}
                  <section style={{ padding: "0 8px" }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.2em', marginBottom: 40, textTransform: 'uppercase' }}>
                      LIVE INSIGHTS // ANALYTICAL_ENGINE
                    </div>
                    <LiveInsights stats={stats} dashboard={dashboard} subscribers={subscribers} />
                  </section>

                  {/* Developer Protocol Memo */}
                  <section style={{ padding: "0 8px", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 40 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.2em', marginBottom: 24, textTransform: 'uppercase' }}>
                      DEVELOPER_PROTOCOL // ADVISORY
                    </div>
                    <div style={{ width: '100%' }}>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "#000000", fontWeight: 500, margin: 0 }}>
                        Your infrastructure node is currently broadcasting on the <span style={{ color: '#1e1b4b', fontWeight: 700 }}>Aegis Mesh Network</span>.
                        As a developer tenant, you can interface with your provisioned services using the <span style={{ fontFamily: 'var(--ff-mono)', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>X-API-KEY</span> header for all external requests.
                      </p>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "#000000", fontWeight: 500, marginTop: 16 }}>
                        All subscriber lifecycle events—including activations and decommissioning—are automatically synchronized across your tenant environment. For deep-level integration, refer to the <span style={{ textDecoration: 'underline', color: '#6366f1', cursor: 'pointer' }}>Infrastructure Documentation</span> or monitor the Live Insights feed above for real-time propagation status.
                      </p>
                    </div>
                  </section>
                </div>
              </>
            )}

            {activeTab === 'credentials' && (
              <div style={{ maxWidth: 800 }}>
                <div style={{ marginBottom: 32 }}>
                  <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Infrastructure Credentials</h1>
                  <p style={{ color: "#475569", marginTop: 4, fontWeight: 500 }}>Secure keys to authenticate your application with Aegis Infra infrastructure.</p>
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
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#1e1b4b", textTransform: "uppercase", marginBottom: 8, opacity: 0.8 }}>{cred.label}</div>
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
                    <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Subscription Plans</h1>
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

            {activeTab === 'subscribers' && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                  <div>
                    <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Infrastructure Subscribers</h1>
                    <p style={{ color: "#64748b", marginTop: 4 }}>Monitor and manage users currently connected to your tenant infrastructure.</p>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      style={{
                        padding: '12px 12px 12px 40px',
                        borderRadius: 14,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.7)',
                        outline: 'none',
                        width: 280,
                        fontSize: 14,
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid #6366f1'}
                      onBlur={(e) => e.target.style.border = '1px solid rgba(0,0,0,0.08)'}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)", overflow: "hidden", boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.4)" }}>
                        <th style={{ padding: "20px 32px" }}>Subscriber</th>
                        <th style={{ padding: "20px 32px" }}>Current Plan</th>
                        <th style={{ padding: "20px 32px" }}>Status</th>
                        <th style={{ padding: "20px 32px" }}>Joined Date</th>
                        <th style={{ padding: "20px 32px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.length > 0 ? subscribers.map((sub, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", fontSize: 14 }}>
                          <td style={{ padding: "20px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>
                                {(sub.userName || sub.email || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#1e1b4b" }}>{sub.userName || 'Unknown User'}</div>
                                <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "20px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
                              <span style={{ fontWeight: 600, color: "#475569" }}>{sub.planName || 'Standard'}</span>
                            </div>
                          </td>
                          <td style={{ padding: "20px 32px" }}>
                            <span style={{
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              background: sub.status === 'ACTIVE' ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
                              color: sub.status === 'ACTIVE' ? "#10b981" : "#f43f5e"
                            }}>
                              {sub.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: "20px 32px", color: "#64748b" }}>
                            {sub.joinedAt ? new Date(sub.joinedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                          </td>
                          <td style={{ padding: "20px 32px" }}>
                            <button style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>View Profile</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" style={{ padding: "80px 0", textAlign: "center" }}>
                            <div style={{ opacity: 0.5, marginBottom: 16 }}>
                              <Icon name="users" size={48} color="#94a3b8" />
                            </div>
                            <p style={{ color: "#64748b", fontWeight: 500 }}>No subscribers found in your infrastructure.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'license' && (
              <div style={{ maxWidth: 900 }}>
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Infrastructure License</h1>
                  <p style={{ color: "#64748b", marginTop: 4 }}>Manage your Aegis Infra partnership and infrastructure tier.</p>
                </div>

                <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", borderRadius: 32, padding: 48, color: "white", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(30, 27, 75, 0.2)" }}>
                  <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7 }}>Current Tier</span>
                        <h2 style={{ fontSize: 42, fontWeight: 900, marginTop: 4 }}>{dashboard?.tenantPlan || 'FREE'} NODE</h2>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.15)", padding: "12px 24px", borderRadius: 16, backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Active License</span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Next Billing</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{dashboard?.nextBillingDate ? new Date(dashboard.nextBillingDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>API Limit</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Unlimited Calls</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Compute Capacity</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>High Efficiency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>System Services</h1>
                  <p style={{ color: "#475569", marginTop: 4, fontWeight: 500 }}>Operational status and configuration of your infrastructure core modules.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                  {[
                    { name: 'Identity Engine', status: 'Healthy', version: 'v2.4.1', stats: '99.9% Uptime' },
                    { name: 'Subscription Mesh', status: 'Healthy', version: 'v1.1.0', stats: 'Active' },
                    { name: 'API Gateway', status: 'Healthy', version: 'v3.0.5', stats: '20ms Latency' },
                    { name: 'Edge Analytics', status: 'Provisioning', version: 'BETA', stats: 'Coming Soon' },
                  ].map((service, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 24, padding: 28, border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: service.status === 'Healthy' ? '#10b981' : '#6366f1', boxShadow: service.status === 'Healthy' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none' }} />
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>{service.version}</span>
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", marginBottom: 4 }}>{service.name}</h3>
                      <p style={{ fontSize: 13, color: "#000000", marginBottom: 20, fontWeight: 500 }}>{service.stats}</p>
                      <div style={{ fontSize: 12, fontWeight: 700, color: service.status === 'Healthy' ? '#10b981' : '#6366f1' }}>{service.status.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!['overview', 'credentials', 'plans', 'subscribers', 'license', 'services'].includes(activeTab)) && (
              <div style={{ padding: 60, textAlign: "center", background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b" }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                <p style={{ color: "#64748b", marginTop: 12 }}>This enterprise feature is currently being provisioned for your tenant.</p>
              </div>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      marginTop: "auto",
      padding: "32px",
      borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      background: "rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>
            AEGIS <span style={{ color: "#6366f1" }}>INFRA</span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Docs</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Support</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Security</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>System Region</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>ASIA-SOUTH-1</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Build Version</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>v4.2.0-stable</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px dashed rgba(0, 0, 0, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
          © 2026 Aegis Global Infrastructure. All protocols reserved.
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", letterSpacing: "0.5px" }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}


function StatCard({ label, value, icon, iconBg, iconColor, sparklineColor }) {
  return (
    <div className="stat-card" style={{
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(20px) saturate(160%)",
      borderRadius: 24,
      border: "1px solid rgba(255, 255, 255, 0.8)",
      padding: 28,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      boxShadow: `
        0 10px 30px -10px rgba(0, 0, 0, 0.05),
        inset 0 1px 1px rgba(255, 255, 255, 0.8),
        inset 0 -1px 20px rgba(99, 102, 241, 0.02)
      `,
      transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
      cursor: "pointer",
      perspective: '1000px'
    }}>
      <style>{`
        .stat-card {
            background-image: radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
        }
        .stat-card:hover {
            transform: translateY(-8px) rotateX(4deg) rotateY(-2deg);
            box-shadow: 
                0 30px 60px -12px rgba(99, 102, 241, 0.15),
                0 18px 36px -18px rgba(0, 0, 0, 0.2),
                inset 0 1px 1px rgba(255, 255, 255, 1);
            border-color: rgba(99, 102, 241, 0.3);
        }
        .stat-card:hover .spark-container {
            transform: translateZ(20px) scale(1.05);
        }
        @keyframes drawPath {
            0% { stroke-dashoffset: 200; opacity: 0.8; }
            50% { stroke-dashoffset: 0; opacity: 1; }
            100% { stroke-dashoffset: -200; opacity: 0.8; }
        }
      `}</style>

      {/* Engineering Corner Accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderLeft: '1px solid rgba(99, 102, 241, 0.1)', borderTop: '1px solid rgba(99, 102, 241, 0.1)', borderTopLeftRadius: 24 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, zIndex: 2 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${iconColor}22`,
          boxShadow: `0 8px 16px ${iconColor}15`
        }}>
          <Icon name={icon} color={iconColor} />
        </div>
        <div className="spark-container" style={{ transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)' }}>
          <Sparkline color={sparklineColor} />
        </div>
      </div>

      <div style={{ zIndex: 2 }}>
        <div style={{
          fontSize: 42,
          fontWeight: 900,
          color: "#1e1b4b",
          marginBottom: 4,
          letterSpacing: "-1.5px",
          fontFamily: 'var(--ff-sans)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 8
        }}>
          {value}
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#64748b",
            letterSpacing: '0.1em',
            fontFamily: 'var(--ff-mono)'
          }}>[OPERATIONAL]</span>
        </div>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#475569",
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: iconColor }} />
          {label}
        </div>
      </div>

      {/* Technical HUD glow */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${iconColor}08 0%, transparent 70%)`,
        zIndex: 1
      }} />
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
