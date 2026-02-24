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
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleUnauth = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { handleUnauth(); return; }

      const [dashRes, statsRes] = await Promise.allSettled([
        api.get('/dashboard'),
        api.get('/developer/tenant-stats')
      ]);

      const getVal = (res, fallback = null) => res.status === 'fulfilled' ? res.value.data.data : fallback;

      setDashboard(getVal(dashRes));
      setStats(getVal(statsRes, { total: 0, active: 0, cancelled: 0, pending: 0 }));

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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "var(--ff-sans)" }}>
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
          background: "#ffffff",
          borderBottom: "1px solid #f1f5f9"
        }}>
          <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", gap: 8 }}>
            <span>Console</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>Overview</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }} />
              System Online
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#eef2ff", color: "#4f46e5",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, border: "1px solid #e0e7ff"
            }}>
              {(dashboard?.tenantName || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div style={{ padding: "40px 32px" }}>

          {activeTab === 'overview' && (
            <>
              <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", fontFamily: "var(--ff-h)" }}>Dashboard Overview</h1>
                <p style={{ color: "#64748b", marginTop: 4, fontSize: 15 }}>Monitor your tenant infrastructure and user base activity.</p>
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
                  iconBg="#eff6ff"
                  iconColor="#3b82f6"
                  sparklineColor="#3b82f6"
                />
                {/* Active Subscriptions */}
                <StatCard
                  label="Active Subscriptions"
                  value={stats.active}
                  icon="zap"
                  iconBg="#ecfdf5"
                  iconColor="#10b981"
                  sparklineColor="#10b981"
                />
                {/* API Usage */}
                <StatCard
                  label="API Usage"
                  value={dashboard?.apiCallCount || 0}
                  icon="chart"
                  iconBg="#f5f3ff"
                  iconColor="#8b5cf6"
                  sparklineColor="#8b5cf6"
                />
                {/* Plan Days Left */}
                <StatCard
                  label="Plan Days Left"
                  value={dashboard?.daysRemaining || 0}
                  icon="clock"
                  iconBg="#fff7ed"
                  iconColor="#f59e0b"
                  sparklineColor="#f59e0b"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                {/* Recent Activity */}
                <section style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #f1f5f9", padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
                    <button style={{ background: "none", border: "none", color: "#4f46e5", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View all</button>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <th style={{ paddingBottom: 16 }}>User</th>
                        <th style={{ paddingBottom: 16 }}>Plan</th>
                        <th style={{ paddingBottom: 16 }}>Amount</th>
                        <th style={{ paddingBottom: 16 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ fontSize: 14 }}>
                        <td colSpan="4" style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>No recent activity to show.</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                {/* User Status Mix */}
                <section style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #f1f5f9", padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>User Status Mix</h3>
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>Active</span>
                      <span style={{ color: "#94a3b8" }}>NaN%</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#10b981", width: "0%" }} />
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div style={{ padding: 40, textAlign: "center", background: "#ffffff", borderRadius: 16, border: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h2>
              <p style={{ color: "#64748b", marginTop: 8 }}>This section is currently being architected.</p>
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
      background: "#ffffff",
      borderRadius: 16,
      border: "1px solid #f1f5f9",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon name={icon} color={iconColor} />
        </div>
        <Sparkline color={sparklineColor} />
      </div>

      <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>{label}</div>
    </div>
  );
}
