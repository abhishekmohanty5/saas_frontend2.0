import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';

/* ─────────────────────────────────────────────────────────
   DEVELOPER CONSOLE  –  /dashboard
   GET /api/dashboard  →  tenant engine status & API keys
───────────────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  const handleUnauth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { handleUnauth(); return; }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://saassubscription-production.up.railway.app/api';
        const res = await fetch(`${API_BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { handleUnauth(); return; }
        const json = await res.json();
        setData(json.data || json);
      } catch (err) {
        setError('Failed to load dashboard. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [handleUnauth]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(key);
      setTimeout(() => setCopiedId(''), 2000);
    });
  };

  /* ── helpers ── */
  const planColor = (plan) => {
    const p = (plan || '').toLowerCase();
    if (p.includes('enterprise')) return '#A259FF';
    if (p.includes('pro')) return 'var(--gold)';
    return 'var(--emerald2)';
  };

  const daysColor = (days) => {
    if (days <= 2) return 'var(--rose)';
    if (days <= 6) return '#E89A3C';
    return 'var(--emerald2)';
  };

  const METRIC_CARDS = data ? [
    { label: 'Total API Calls', value: data.apiCallCount ?? 0, icon: '⚡', color: 'var(--gold)' },
    { label: 'Days Remaining', value: `${data.daysRemaining ?? 0}d`, icon: '📅', color: daysColor(data.daysRemaining ?? 0) },
    { label: 'Total Subscriptions', value: data.totalUserSubscriptions ?? 0, icon: '📋', color: 'var(--sky)' },
    { label: 'Active Subscriptions', value: data.activeUserSubscriptions ?? 0, icon: '✅', color: 'var(--emerald2)' },
  ] : [];

  /* Plan progress */
  const totalDays = data?.planDuration ?? 30;
  const daysUsed = totalDays - (data?.daysRemaining ?? totalDays);
  const progressPct = Math.min(100, Math.round((daysUsed / totalDays) * 100));

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--cream)', fontFamily: 'var(--ff-sans)' }}>
        <ConsoleSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={spinnerStyle} />
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '16px' }}>Loading your console…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--cream)', fontFamily: 'var(--ff-sans)' }}>
        <ConsoleSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '380px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: '8px' }}>Connection Error</p>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
            <button onClick={() => window.location.reload()} style={outlineBtn}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--ff-sans)' }}>
      <ConsoleSidebar />

      {/* ── Main layout ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--cream)', overflow: 'auto' }}>

        {/* ── TOP HEADER ── */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={styles.headerTitle}>Developer Console</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              {data?.tenantName || 'My Startup'}
            </span>
            <span style={{
              ...styles.planBadge,
              background: planColor(data?.currentPlan),
              color: '#fff',
            }}>
              {data?.currentPlan || 'Free Trial'}
            </span>
            <div style={styles.statusDot} title="Active" />
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div style={styles.content}>

          {/* Greeting */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={styles.greeting}>
              Good day, <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{data?.tenantName || 'Founder'}</em> 👋
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
              Here's your engine status and API credentials.
            </p>
          </div>

          {/* ── SECTION A: Metric Cards ── */}
          <div style={styles.grid4}>
            {METRIC_CARDS.map((card) => (
              <div key={card.label} style={styles.metricCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '22px' }}>{card.icon}</span>
                  <span style={{ ...styles.valueChip, color: card.color }}>{card.value}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* ── BOTTOM GRID: Plan Info + API Credentials ── */}
          <div style={styles.grid2}>

            {/* ── SECTION B: Plan Information ── */}
            <div style={styles.section}>
              <SectionTitle icon="📋" title="Plan Information" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <InfoRow label="Current Plan" value={<PlanPill plan={data?.currentPlan} />} />
                <InfoRow label="Plan Price" value={data?.planPrice != null ? `₹${data.planPrice}` : '₹0'} />
                <InfoRow label="Member Since" value={formatDate(data?.memberSince)} />
                <InfoRow label="Plan Expires" value={formatDate(data?.planExpiry)} />
                <InfoRow label="Status" value={
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: 'rgba(45,106,79,0.1)',
                    color: 'var(--emerald)',
                  }}>
                    {data?.status || 'ACTIVE'}
                  </span>
                } />
                <InfoRow label="Days Left" value={
                  <span style={{ fontWeight: 700, color: daysColor(data?.daysRemaining ?? 0), fontFamily: 'var(--ff-serif)', fontSize: '16px' }}>
                    {data?.daysRemaining ?? 0} days
                  </span>
                } />
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                  <span>Plan usage</span>
                  <span>{progressPct}% used</span>
                </div>
                <div style={{ height: '6px', background: 'var(--sand)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: progressPct > 80 ? 'var(--rose)' : 'var(--gold)',
                    borderRadius: '3px',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* ── SECTION C: API Credentials ── */}
            <div id="credentials" style={styles.section}>
              <SectionTitle icon="🔑" title="API Credentials" />
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                Use these credentials to identify your tenant when making API calls to SubSphere engine.
              </p>

              {/* Client ID */}
              <div style={styles.credGroup}>
                <label style={styles.credLabel}>Client ID</label>
                <div style={styles.credRow}>
                  <code style={styles.credValue}>{data?.clientId || '—'}</code>
                  <CopyBtn
                    text={data?.clientId || ''}
                    id="clientId"
                    copied={copiedId === 'clientId'}
                    onCopy={() => copyToClipboard(data?.clientId || '', 'clientId')}
                  />
                </div>
              </div>

              {/* Client Secret */}
              <div style={styles.credGroup}>
                <label style={styles.credLabel}>Client Secret</label>
                <div style={styles.credRow}>
                  <code style={{ ...styles.credValue, letterSpacing: showSecret ? '0' : '2px' }}>
                    {showSecret ? (data?.clientSecret || '—') : '••••••••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowSecret((v) => !v)}
                    style={styles.iconBtn}
                    title={showSecret ? 'Hide' : 'Show'}
                  >
                    {showSecret ? '🙈' : '👁️'}
                  </button>
                  <CopyBtn
                    text={data?.clientSecret || ''}
                    id="clientSecret"
                    copied={copiedId === 'clientSecret'}
                    onCopy={() => copyToClipboard(data?.clientSecret || '', 'clientSecret')}
                  />
                </div>
              </div>

              {/* ── SECTION D: Enabled Services ── */}
              <div style={{ marginTop: '24px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Enabled Services
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    '✅ Auth Service',
                    '✅ Subscription Service',
                    '✅ Email Notifications',
                    '✅ Automated Scheduler',
                  ].map((s) => (
                    <div key={s} style={styles.serviceBadge}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION E: Quick Actions ── */}
          <div style={styles.section}>
            <SectionTitle icon="🚀" title="Quick Actions" />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <ActionBtn
                label="Manage My Subscriptions →"
                onClick={() => navigate('/subscriptions')}
                primary
              />
              <ActionBtn
                label="View Upcoming Renewals →"
                onClick={() => navigate('/subscriptions?tab=upcoming')}
              />
              <ActionBtn
                label="View Spending Stats →"
                onClick={() => navigate('/subscriptions?tab=stats')}
              />
            </div>
          </div>

        </div>{/* /content */}
      </div>{/* /main */}

      {/* Spinner keyframe */}
      <style>{`
        @keyframes dashSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

/* ── Helper components ── */
const SectionTitle = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
    <span style={{ fontSize: '16px' }}>{icon}</span>
    <span style={{ fontFamily: 'var(--ff-sans)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)', letterSpacing: '-0.2px' }}>{title}</span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{label}</span>
    <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>{value}</span>
  </div>
);

const PlanPill = ({ plan }) => {
  const p = (plan || '').toLowerCase();
  const bg = p.includes('enterprise') ? 'rgba(162,89,255,0.1)' : p.includes('pro') ? 'rgba(201,168,76,0.1)' : 'rgba(45,106,79,0.1)';
  const color = p.includes('enterprise') ? '#A259FF' : p.includes('pro') ? 'var(--gold)' : 'var(--emerald)';
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: bg, color }}>
      {plan || 'Free Trial'}
    </span>
  );
};

const CopyBtn = ({ text, id, copied, onCopy }) => (
  <button
    onClick={onCopy}
    style={{
      ...styles.iconBtn,
      color: copied ? 'var(--emerald2)' : 'var(--muted)',
      transition: 'color 0.2s',
    }}
    title="Copy"
  >
    {copied ? '✅' : '📋'}
  </button>
);

const ActionBtn = ({ label, onClick, primary }) => (
  <button
    onClick={onClick}
    style={{
      padding: '11px 20px',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: 600,
      fontFamily: 'var(--ff-sans)',
      cursor: 'pointer',
      border: primary ? 'none' : '1px solid var(--sand)',
      background: primary ? 'var(--ink)' : 'transparent',
      color: primary ? 'var(--white)' : 'var(--ink)',
      transition: 'all 0.15s',
    }}
    onMouseEnter={(e) => {
      if (primary) e.currentTarget.style.background = 'var(--ink2)';
      else e.currentTarget.style.background = 'var(--sand)';
    }}
    onMouseLeave={(e) => {
      if (primary) e.currentTarget.style.background = 'var(--ink)';
      else e.currentTarget.style.background = 'transparent';
    }}
  >
    {label}
  </button>
);

/* ── Utilities ── */
const formatDate = (str) => {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return str; }
};

/* ── Styles ── */
const spinnerStyle = {
  width: '36px',
  height: '36px',
  border: '3px solid var(--sand)',
  borderTopColor: 'var(--gold)',
  borderRadius: '50%',
  margin: '0 auto',
  animation: 'dashSpin 0.8s linear infinite',
};

const outlineBtn = {
  padding: '10px 24px',
  borderRadius: '10px',
  border: '1px solid var(--sand)',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'var(--ff-sans)',
  color: 'var(--ink)',
};

const styles = {
  header: {
    height: '56px',
    background: 'var(--ink)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: 'var(--ff-sans)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '-0.2px',
  },
  planBadge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '20px',
    letterSpacing: '0.3px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--emerald2)',
    boxShadow: '0 0 0 2px rgba(64,145,108,0.25)',
  },
  content: {
    padding: '32px',
    flex: 1,
    maxWidth: '1100px',
  },
  greeting: {
    fontFamily: 'var(--ff-serif)',
    fontSize: '26px',
    fontWeight: 400,
    color: 'var(--ink)',
    letterSpacing: '-0.5px',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  metricCard: {
    background: 'var(--white)',
    border: '1px solid var(--sand)',
    borderRadius: '14px',
    padding: '20px',
  },
  valueChip: {
    fontFamily: 'var(--ff-serif)',
    fontSize: '24px',
    fontWeight: 400,
    letterSpacing: '-0.5px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  section: {
    background: 'var(--white)',
    border: '1px solid var(--sand)',
    borderRadius: '16px',
    padding: '24px',
  },
  credGroup: {
    marginBottom: '20px',
  },
  credLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--muted)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  credRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--cream)',
    border: '1px solid var(--sand)',
    borderRadius: '10px',
    padding: '10px 14px',
  },
  credValue: {
    flex: 1,
    fontFamily: 'var(--ff-mono)',
    fontSize: '12px',
    color: 'var(--ink)',
    wordBreak: 'break-all',
    letterSpacing: '0.5px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '2px 4px',
    flexShrink: 0,
    opacity: 0.7,
  },
  serviceBadge: {
    padding: '8px 10px',
    background: 'rgba(45,106,79,0.06)',
    border: '1px solid rgba(45,106,79,0.15)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--emerald)',
  },
};

export default Dashboard;