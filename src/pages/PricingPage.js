import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/ToastProvider';
import { useTheme } from '../utils/ThemeContext';
import { publicAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlanCard from '../components/pricing/PlanCard';
import CheckoutModal from '../components/pricing/CheckoutModal';
import { BILLING_INTERVALS, DEFAULT_PLANS, normalizePlanFromBackend } from '../components/pricing/pricingData';

const PricingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const toast = useToast();
  const { theme } = useTheme();
  const isSuperAdmin = user?.role === 'ROLE_SUPER_ADMIN';

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedPlanParam = searchParams.get('plan'); // can be id or name
  const selectedPlanNameParam = searchParams.get('planName'); // name
  const billingParam = searchParams.get('billing'); // monthly | annual
const isWelcomeMode = searchParams.get('welcome') === 'true';

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribingPlanId, setSubscribingPlanId] = useState(null);
  // Checkout modal state
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [billingInterval, setBillingInterval] = useState(
    billingParam === BILLING_INTERVALS.ANNUAL ? BILLING_INTERVALS.ANNUAL : BILLING_INTERVALS.MONTHLY
  );

  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const pricingDarkTheme = isDark
    ? {
        '--bg': '#0b1220',
        '--surface': '#0f172a',
        '--surface2': 'rgba(255, 255, 255, 0.03)',
        '--border': 'rgba(255, 255, 255, 0.10)',
        '--border2': 'rgba(59, 130, 246, 0.22)',
        '--ink': '#e5e7eb',
        '--muted': '#9ca3af',
        '--accent2': '#3b82f6',
        background:
          'linear-gradient(180deg, #060b18 0%, #0b1220 20%, #0b1220 100%)',
      }
    : {};

  useEffect(() => {
    if (billingParam === BILLING_INTERVALS.ANNUAL || billingParam === BILLING_INTERVALS.MONTHLY) {
      setBillingInterval(billingParam);
    }
  }, [billingParam]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await publicAPI.getAllPlans();
        const payload = response?.data?.data;

        if (Array.isArray(payload)) {
          const normalized = payload
            .map((p) => normalizePlanFromBackend(p))
            .filter((p) => p.active !== false);

          // Respect backend truth: if all plans are inactive, show no plans instead of reviving defaults.
          setPlans(normalized);
        } else {
          setPlans(DEFAULT_PLANS);
        }
      } catch (err) {
        const isAuthError = err.response?.status === 401 || err.response?.status === 403;
        const isNetworkError = !err.response;

        if (isAuthError) {
          // Suppress public route 401 spam — backend config error
          console.warn('Backend: /api/v1/public/plans is secured (401). Using static DEFAULT_PLANS fallback.');
          setPlans(DEFAULT_PLANS);
          setError(''); // Silence the banner
        } else if (isNetworkError) {
          console.warn('Backend offline — using default plans.');
          setPlans(DEFAULT_PLANS);
          setError('');
        } else {
          console.error('Error fetching plans:', err);
          setError(err.response?.data?.message || 'Plans currently unavailable.');
          setPlans(DEFAULT_PLANS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    // Scroll to the chosen plan when coming from landing page
    if (loading || plans.length === 0) return;

    const byId = selectedPlanParam
      ? plans.find((p) => String(p.id) === String(selectedPlanParam))
      : null;
    const byName = selectedPlanNameParam
      ? plans.find((p) => String(p.name || '').toLowerCase() === String(selectedPlanNameParam).toLowerCase())
      : null;
    const byNameFallback = selectedPlanParam
      ? plans.find((p) => String(p.name || '').toLowerCase() === String(selectedPlanParam).toLowerCase())
      : null;

    const chosen = byId || byName || byNameFallback;
    if (chosen?.id) {
      const el = document.getElementById(`plan-${chosen.id}`);
      el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, plans, selectedPlanNameParam, selectedPlanParam]);

  useEffect(() => {
    if (isSuperAdmin && checkoutPlan) {
      setCheckoutPlan(null);
    }
  }, [checkoutPlan, isSuperAdmin]);

  const handleSubscribe = useCallback(async (plan) => {
    if (!plan?.id) return;

    if (user?.role === 'ROLE_SUPER_ADMIN') {
      toast.error(
        'Super admins cannot subscribe',
        'Use the Admin Dashboard to manage platform plans. Pricing is view-only for super admin accounts.'
      );
      return;
    }

    if (!user) {
      const redirect = `/pricing?plan=${encodeURIComponent(String(plan.id))}&planName=${encodeURIComponent(String(plan.name || ''))}&billing=${encodeURIComponent(billingInterval)}`;
      navigate(`/register?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    // Open the checkout modal instead of directly subscribing
    setCheckoutPlan(plan);
  }, [user, billingInterval, navigate, toast]);

  const filteredPlans = useMemo(() => {
    return plans.filter(p => Number(p.price) > 0);
  }, [plans]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--sand)',
            borderTopColor: 'var(--ink)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 500 }}>Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...pricingDarkTheme, minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.3s ease' }}>
      <Navbar />

      {/* Unified Pricing Section Header */}
      <section style={{
        padding: '80px 24px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '16px' }}>
            Subscription Plans
          </div>
          <h1 style={{
            fontFamily: 'var(--ff-h)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            color: 'var(--ink)',
            fontWeight: 800,
            maxWidth: '900px',
            marginBottom: '16px',
            transition: 'color 0.3s ease'
          }}>
            Simple, transparent <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>pricing</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto', fontWeight: 400, transition: 'color 0.3s ease' }}>
            All plans include the full API suite, multi-tenant JWT auth, and automated dev consoles.
          </p>

          {isWelcomeMode && (
            <div style={{
              marginTop: '32px',
              padding: '24px 32px',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.1))',
              border: '1px solid var(--border2)',
              borderRadius: '24px',
              maxWidth: '600px',
              animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>Welcome to Aegis, {user?.name || 'Explorer'}!</h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Your <strong>14-day Free Trial</strong> is already active. Explore the dashboard below or choose a paid plan to unlock enterprise-scale throughput immediately.
              </p>
            </div>
          )}

          {/* Toggle */}
          <div
            role="group"
            aria-label="Billing frequency toggle"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '32px', fontSize: '14px', color: 'var(--muted)', transition: 'color 0.3s ease' }}
          >
            <span style={{ fontWeight: 600 }}>Monthly</span>
            <button
              type="button"
              aria-pressed={billingInterval === BILLING_INTERVALS.ANNUAL}
              onClick={() => setBillingInterval((v) => (v === BILLING_INTERVALS.ANNUAL ? BILLING_INTERVALS.MONTHLY : BILLING_INTERVALS.ANNUAL))}
              style={{
                width: '48px',
                height: '26px',
                borderRadius: '13px',
                background: billingInterval === BILLING_INTERVALS.ANNUAL ? '#3b82f6' : '#e2e8f0',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
                border: 'none'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '3px',
                left: billingInterval === BILLING_INTERVALS.ANNUAL ? '25px' : '3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'white',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
            </button>
            <span style={{ fontWeight: 600, color: billingInterval === BILLING_INTERVALS.ANNUAL ? 'var(--ink)' : 'var(--muted)', transition: 'color 0.3s ease' }}>
              Annual <span style={{
                display: 'inline-block',
                background: 'rgba(59,130,246,0.1)',
                color: '#3b82f6',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 10px',
                borderRadius: '20px',
                marginLeft: '8px',
                border: '1px solid rgba(59,130,246,0.1)'
              }}>Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 100px',
        position: 'relative',
        padding: '0 24px'
      }}>
        {error && (
          <div
            onClick={() => {
              if (error.toLowerCase().includes('login')) {
                const currentPath = location.pathname + location.search;
                navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
              }
            }}
            style={{
              background: 'rgba(255, 59, 48, 0.08)',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#FF3B30',
              padding: '12px 20px',
              borderRadius: '12px',
              marginBottom: '40px',
              fontSize: '14px',
              fontWeight: 500,
              maxWidth: '450px',
              margin: '0 auto 40px',
              cursor: error.toLowerCase().includes('login') ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(255, 59, 48, 0.12)',
            }}
            onMouseEnter={(e) => {
              if (error.toLowerCase().includes('login')) {
                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (error.toLowerCase().includes('login')) {
                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>⚠️</span>
            {error}
          </div>
        )}

        {isSuperAdmin && (
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'var(--ink)',
              padding: '14px 20px',
              borderRadius: '14px',
              marginBottom: '28px',
              maxWidth: '560px',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.08)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Admin view only</div>
            <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
              Super admin accounts can review pricing here, but they cannot purchase or upgrade subscriptions.
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="pricing-grid">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
              subscribing={subscribingPlanId === plan.id}
              onAction={plan.price === 0 && isWelcomeMode ? () => navigate('/dashboard') : handleSubscribe}
              disabled={isSuperAdmin}
              actionLabel={
                isSuperAdmin ? 'Admin view only' : 
                (plan.price === 0 && isWelcomeMode ? 'Go to Dashboard' : undefined)
              }
            />
          ))}
        </div>
      </div>

      <Footer />

      {/* Checkout Modal */}
      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          billingInterval={billingInterval}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => {
            setCheckoutPlan(null);
            toast.success('Subscribed!', `You are now on the ${checkoutPlan.name} plan.`);
            navigate('/dashboard');
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          align-items: stretch;
          perspective: 1200px;
          padding-bottom: 40px;
        }
        @media (max-width: 1100px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          section {
            padding: 60px 20px 30px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;
