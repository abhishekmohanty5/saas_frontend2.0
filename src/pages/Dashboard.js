import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';
import { useToast } from '../components/ToastProvider';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [engineSub, setEngineSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  const handleUnauth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { handleUnauth(); return; }

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://saassubscription-production.up.railway.app/api';

      const [dashRes, engineRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/tenant-admin/engine-subscription`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (dashRes.status === 401) { handleUnauth(); return; }

      const dashJson = await dashRes.json();
      const engineJson = await engineRes.json();

      setData(dashJson.data || dashJson);
      setEngineSub(engineJson.data);
    } catch (err) {
      setError('Failed to load operations data.');
    } finally {
      setLoading(false);
    }
  }, [handleUnauth]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleUpgrade = async (targetPlanId) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://saassubscription-production.up.railway.app/api';

      const res = await fetch(`${API_BASE_URL}/tenant-admin/engine-subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetPlanId })
      }).then(r => r.json());

      if (res.status === 200) {
        toast.success('License Upgraded', `Successfully moved to ${res.data.planName}`);
        fetchDashboard();
      } else {
        toast.error('Upgrade Failed', res.message);
      }
    } catch (err) {
      toast.error('Error', 'An error occurred while upgrading.');
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(key);
      setTimeout(() => setCopiedId(''), 2000);
    });
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a' }}>
        <ConsoleSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          Loading your operations console...
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a' }}>
        <ConsoleSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4444' }}>
          {error}
        </div>
      </div>
    );
  }

  const METRIC_CARDS = data ? [
    { label: 'Total Volume', value: data.apiCallCount ?? '0', change: '+12.5%', isPositive: true },
    { label: 'Active Subscriptions', value: data.activeUserSubscriptions ?? '0', change: '+2.4%', isPositive: true },
    { label: 'Total Users', value: data.totalUserSubscriptions ?? '0', change: '-1.2%', isPositive: false },
    { label: 'Days Remaining', value: `${data.daysRemaining ?? 0}d`, change: 'Current Cycle', isPositive: true },
  ] : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#ededed', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ConsoleSidebar />

      {/* ── Main layout ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

        {/* ── TOP HEADER ── */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid #1f1f1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}>
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#f5f5f5' }}>Operations Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Tenant ID: {data?.tenantName || 'Unknown'}</span>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', border: '2px solid rgba(34, 197, 94, 0.2)' }} />
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ padding: '32px 40px', maxWidth: '1400px', width: '100%' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}>Terminal Overview</h1>
              <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Analyze your API metrics and revenue streams across active plan cycles.</p>
            </div>
            <button style={{
              background: '#ededed',
              color: '#0a0a0a',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>Export Report</button>
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
                background: '#121212',
                border: '1px solid #1f1f1f',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>{card.label}</div>
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* ── API CREDENTIALS CHART/TABLE AREA ── */}
            <div style={{
              background: '#121212',
              border: '1px solid #1f1f1f',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <span>API Access Credentials</span>
                <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 400 }}>Status: <span style={{ color: '#22c55e' }}>Secure</span></span>
              </div>

              {/* Client ID */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#71717a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client ID</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', padding: '10px 16px' }}>
                  <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', color: '#e4e4e7' }}>{data?.clientId || '—'}</code>
                  <button
                    onClick={() => copyToClipboard(data?.clientId || '', 'clientId')}
                    style={{ background: 'none', border: 'none', color: copiedId === 'clientId' ? '#22c55e' : '#71717a', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {copiedId === 'clientId' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Client Secret */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#71717a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Secret</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', padding: '10px 16px' }}>
                  <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', color: '#e4e4e7', letterSpacing: showSecret ? '0' : '2px' }}>
                    {showSecret ? (data?.clientSecret || '—') : '••••••••••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '13px', marginRight: '16px' }}
                  >
                    {showSecret ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(data?.clientSecret || '', 'clientSecret')}
                    style={{ background: 'none', border: 'none', color: copiedId === 'clientSecret' ? '#22c55e' : '#71717a', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {copiedId === 'clientSecret' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── ENGINE SUBSCRIPTION AREA ── */}
            <div style={{
              background: '#121212',
              border: '1px solid #1f1f1f',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Engine Plan</span>
                <span style={{ fontSize: '12px', color: '#22c55e' }}>{engineSub?.status || 'ACTIVE'}</span>
              </div>

              <div style={{
                background: 'linear-gradient(145deg, #1f1f1f 0%, #121212 100%)',
                border: '1px solid #27272a',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#f4f4f5', marginBottom: '4px' }}>{engineSub?.planName || (data?.currentPlan || 'Loading...')}</div>
                <div style={{ fontSize: '13px', color: '#a1a1aa' }}>Expire: {engineSub?.expireDate ? new Date(engineSub.expireDate).toLocaleDateString() : 'N/A'}</div>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 600 }}>₹{engineSub?.amount || data?.planPrice || '0'}</span>
                  <span style={{ fontSize: '12px', color: '#71717a' }}> / {engineSub?.durationInDays || 30} days</span>
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(engineSub?.id === 1 ? 2 : 3)}
                style={{
                  width: '100%',
                  background: 'rgba(162, 89, 255, 0.1)',
                  color: '#a259ff',
                  border: '1px solid rgba(162, 89, 255, 0.2)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Upgrade License
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;