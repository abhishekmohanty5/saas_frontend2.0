import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { publicAPI, subscriptionAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlanCard from '../components/pricing/PlanCard';
import { BILLING_INTERVALS, DEFAULT_PLANS, normalizePlanFromBackend } from '../components/pricing/pricingData';

const PricingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedPlanParam = searchParams.get('plan'); // can be id or name
  const selectedPlanNameParam = searchParams.get('planName'); // name
  const billingParam = searchParams.get('billing'); // monthly | annual

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribingPlanId, setSubscribingPlanId] = useState(null);
  const [billingInterval, setBillingInterval] = useState(
    billingParam === BILLING_INTERVALS.ANNUAL ? BILLING_INTERVALS.ANNUAL : BILLING_INTERVALS.MONTHLY
  );

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

        if (response.data && response.data.data) {
          const normalized = response.data.data.map((p) => normalizePlanFromBackend(p));
          setPlans(normalized.length > 0 ? normalized : DEFAULT_PLANS);
        } else {
          setPlans(DEFAULT_PLANS);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.response?.data?.message || 'Failed to load plans. Please try again.');
        setPlans(DEFAULT_PLANS);
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

  const handleSubscribe = async (plan) => {
    if (!plan?.id) return;

    if (!user) {
      // Send user to login and return back to this pricing page with their selection.
      const redirect = `/pricing?plan=${encodeURIComponent(String(plan.id))}&planName=${encodeURIComponent(String(plan.name || ''))}&billing=${encodeURIComponent(billingInterval)}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    try {
      setSubscribingPlanId(plan.id);
      setError('');
      const response = await subscriptionAPI.subscribe(plan.id);
      // alert(response.data?.message || `Successfully subscribed to ${plan.name} plan!`);
      navigate('/dashboard', { state: { successMessage: response.data?.message || `Successfully subscribed to ${plan.name} plan!` } });
    } catch (err) {
      console.error('Subscription error:', err);

      let errorMessage = err.response?.data?.message || 'Failed to subscribe.';
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        errorMessage = 'Your session has expired. Please login again to subscribe.';
      } else if (status === 500) {
        // Often a 500 indicates a backend issue with the user context
        errorMessage = 'Subscription failed. Please try logging in again to refresh your session.';
      } else if (!errorMessage || errorMessage === 'Failed to subscribe.') {
        errorMessage = 'Failed to subscribe. Please try logging in again or contact support.';
      }

      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubscribingPlanId(null);
    }
  };

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
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ padding: '140px 48px 60px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
          Pricing
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: 'clamp(32px, 4vw, 52px)',
          lineHeight: 1.1,
          letterSpacing: '-0.5px',
          color: 'var(--ink)',
          fontWeight: 400,
          maxWidth: '680px',
          marginBottom: '20px'
        }}>
          Simple, transparent <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>pricing</em>
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '560px', marginTop: '20px' }}>
          All plans include the full API, JWT auth, automated scheduler, and admin dashboard.
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', fontSize: '14px', color: 'var(--muted)' }}>
          <span>Monthly</span>
          <button
            type="button"
            onClick={() => setBillingInterval((v) => (v === BILLING_INTERVALS.ANNUAL ? BILLING_INTERVALS.MONTHLY : BILLING_INTERVALS.ANNUAL))}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              background: billingInterval === BILLING_INTERVALS.ANNUAL ? 'var(--ink)' : 'var(--sand)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
              border: 'none'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '3px',
              left: billingInterval === BILLING_INTERVALS.ANNUAL ? '23px' : '3px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </button>
          <span>Annual <span style={{
            display: 'inline-block',
            background: 'rgba(64,145,108,0.1)',
            color: 'var(--emerald2)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '20px'
          }}>Save 20%</span></span>
        </div>

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
              padding: '16px 24px',
              borderRadius: '16px',
              marginTop: '32px',
              fontSize: '15px',
              fontWeight: 500,
              maxWidth: '500px',
              margin: '32px auto 0',
              cursor: error.toLowerCase().includes('login') ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 32px rgba(255, 59, 48, 0.12)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
      </div>

      {/* Cards */}
      <div style={{ padding: '0 48px 100px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '48px', alignItems: 'start' }}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
              subscribing={subscribingPlanId === plan.id}
              onAction={handleSubscribe}
            />
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;