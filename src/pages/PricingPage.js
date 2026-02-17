import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { publicAPI, subscriptionAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribingPlanId, setSubscribingPlanId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await publicAPI.getAllPlans();

      if (response.data && response.data.data) {
        const backendPlans = response.data.data.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: parseFloat(plan.price),
          durationInDays: plan.durationInDays,
          active: plan.active,
          features: plan.features || []
        }));
        setPlans(backendPlans);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err.response?.data?.message || 'Failed to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId, planName) => {
    if (!user) {
      setError('Please login first to subscribe to a plan. Click here to login.');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSubscribingPlanId(planId);
      setError('');

      const response = await subscriptionAPI.subscribe(planId);
      alert(response.data?.message || `Successfully subscribed to ${planName} plan!`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Subscription error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setSubscribingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8E8E8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #ddd',
            borderTopColor: '#666',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '16px', color: '#666', fontWeight: 500 }}>Loading plans...</div>
        </div>
      </div>
    );
  }

  // Define feature icons mapping
  const featureIcons = {
    'Advanced reporting': '📊',
    'Call recording': '🎙️',
    'Business phone services': '📞',
    'Video meeting': '📹',
    'Screen share & file share': '💬',
    'Advanced data privacy': '🛡️',
    'Download across multiple devices': '📱'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#E8E8E8' }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{ padding: '140px 48px 60px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: 'clamp(36px, 5vw, 56px)',
          lineHeight: 1.1,
          letterSpacing: '-1px',
          color: '#1a1a1a',
          fontWeight: 400,
          marginBottom: '20px'
        }}>
          Which plan is better?
        </h1>

        {error && (
          <div
            onClick={() => {
              if (error.includes('login')) {
                navigate('/login');
              }
            }}
            style={{
              background: '#FFEBEE',
              border: '1px solid #F44336',
              color: '#C62828',
              padding: '14px 20px',
              borderRadius: '12px',
              marginTop: '24px',
              fontSize: '14px',
              fontWeight: 500,
              maxWidth: '560px',
              margin: '24px auto 0',
              cursor: error.includes('login') ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (error.includes('login')) {
                e.currentTarget.style.background = '#FFCDD2';
              }
            }}
            onMouseLeave={(e) => {
              if (error.includes('login')) {
                e.currentTarget.style.background = '#FFEBEE';
              }
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div style={{ padding: '0 48px 100px', maxWidth: '1280px', margin: '0 auto' }}>
        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            No plans available at the moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {plans.map((plan) => {
              const isPopular = plan.name === 'PREMIUM';
              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isPopular={isPopular}
                  onSubscribe={handleSubscribe}
                  subscribing={subscribingPlanId === plan.id}
                  featureIcons={featureIcons}
                />
              );
            })}
          </div>
        )}
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

// Plan Card Component - Matching Reference Design
const PlanCard = ({ plan, isPopular, onSubscribe, subscribing, featureIcons }) => {
  const isFree = plan.price === 0;

  // Default features if none provided
  const defaultFeatures = [
    'Advanced reporting',
    'Call recording',
    'Business phone services',
    'Video meeting',
    'Screen share & file share',
    'Advanced data privacy',
    'Download across multiple devices'
  ];

  const displayFeatures = plan.features.length > 0 ? plan.features : defaultFeatures;

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '32px 28px',
      position: 'relative',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#E8E8FF',
          color: '#5B5BD6',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          padding: '6px 12px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          ⭐ Popular
        </div>
      )}

      {/* Plan Name */}
      <div style={{
        fontSize: '20px',
        fontWeight: 600,
        color: isPopular ? '#8B5CF6' : '#666',
        marginBottom: '4px'
      }}>
        {plan.name}
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: '13px',
        color: '#999',
        marginBottom: '20px'
      }}>
        personal productivity
      </div>

      {/* Price */}
      <div style={{ marginBottom: '20px' }}>
        {isFree ? (
          <div style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1
          }}>
            Free
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '48px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>
              ${plan.price}
            </span>
            <span style={{ fontSize: '16px', color: '#999' }}>Per Month</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: '14px',
        color: '#666',
        lineHeight: 1.6,
        marginBottom: '24px'
      }}>
        Level up productivity and creativity with expanded access
      </p>

      {/* CTA Button */}
      <button
        onClick={() => onSubscribe(plan.id, plan.name)}
        disabled={!plan.active || subscribing}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: subscribing ? '#999' : '#000',
          color: 'white',
          fontSize: '15px',
          fontWeight: 600,
          cursor: plan.active && !subscribing ? 'pointer' : 'not-allowed',
          marginBottom: '28px',
          opacity: !plan.active || subscribing ? 0.5 : 1,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (plan.active && !subscribing) {
            e.target.style.background = '#333';
          }
        }}
        onMouseLeave={(e) => {
          if (plan.active && !subscribing) {
            e.target.style.background = '#000';
          }
        }}
      >
        {subscribing ? 'Processing...' : isFree ? 'Get Started Free' : `Upgrade to ${plan.name}`}
      </button>

      {/* Features List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayFeatures.map((feature, index) => {
          const icon = featureIcons[feature] || '✓';
          return (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '14px'
              }}>
                {icon}
              </div>
              <span>{feature}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;