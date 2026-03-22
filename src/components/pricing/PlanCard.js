import React, { useMemo, memo } from 'react';
import { BILLING_INTERVALS } from './pricingData';

const roundPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
};

const getDisplayPrice = ({ price, billingInterval }) => {
  const base = roundPrice(price);
  if (billingInterval === BILLING_INTERVALS.ANNUAL) {
    return roundPrice(base * 0.8);
  }
  return base;
};

const defaultButtonLabel = (plan) => {
  const name = String(plan?.name || '').toLowerCase();
  if (name === 'enterprise') return 'Contact sales';
  return `Upgrade to ${plan?.name || 'Plus'}`;
};

const PlanCard = memo(({
  plan,
  billingInterval = BILLING_INTERVALS.MONTHLY,
  onAction,
  actionLabel,
  disabled,
  subscribing,
  showMostPopularBadge = true,
}) => {
  const featured = !!plan?.featured;
  const isFree = roundPrice(plan?.price) === 0;

  const displayPrice = useMemo(() => {
    if (isFree) return 0;
    return getDisplayPrice({ price: plan?.price, billingInterval });
  }, [billingInterval, isFree, plan?.price]);

  const buttonText = actionLabel || defaultButtonLabel(plan);
  const isDisabled = !!disabled || !!subscribing || plan?.active === false;

  return (
    <article
      id={plan?.id ? `plan-${plan.id}` : undefined}
      className={`pricing-card-3d ${featured ? 'featured' : ''}`}
      aria-label={`${plan?.name} pricing plan`}
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '32px',
        padding: '24px',
        transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
        position: 'relative',
        transformStyle: 'preserve-3d',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: plan?.active === false ? 0.6 : 1,
        willChange: 'transform, box-shadow'
      }}
    >
      <style>{`
        .pricing-card-3d {
          box-shadow: 
            0 10px 40px -10px rgba(0, 0, 0, 0.4), 
            inset 0 0 0 1px rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }
        .pricing-card-3d::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(800px circle at var(--x, 0px) var(--y, 0px), rgba(255,255,255,0.06), transparent 40%);
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .pricing-card-3d:hover::after {
          opacity: 1;
        }
        .pricing-card-3d:hover {
          transform: translateY(-8px) rotateX(3deg) rotateY(-2deg);
          background: radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 300px), #030303 !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 
            0 35px 70px -15px rgba(0, 0, 0, 0.6), 
            inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .pricing-card-3d:hover .pop-up {
            transform: translateZ(30px);
        }
        .pricing-card-3d:hover .pop-up-far {
            transform: translateZ(45px);
        }
        
        .glassy-cta {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .glassy-cta:hover {
          background: #ffffff;
          color: #000000 !important;
          border-color: #ffffff;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .glassy-cta:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* Header Row: Title & Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', transformStyle: 'preserve-3d' }}>
        <div
          className="pop-up"
          style={{
            fontFamily: 'var(--ff-sans)',
            fontSize: '28px',
            fontWeight: 800,
            background: plan?.name?.toLowerCase() === 'pro' 
              ? 'linear-gradient(135deg, #38bdf8, #6366f1)' 
              : plan?.name?.toLowerCase() === 'enterprise'
                ? 'linear-gradient(135deg, #a78bfa, #c084fc)'
                : '#ffffff',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1.2px',
            display: 'inline-block',
            transition: 'transform 0.5s ease',
          }}
        >
          {plan?.name || 'Plus'}
        </div>

        {featured && showMostPopularBadge && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
              animation: 'popularPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          >
            <style>{`
              @keyframes popularPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4); }
                50% { transform: scale(1.05); box-shadow: 0 4px 25px rgba(14, 165, 233, 0.6); }
              }
            `}</style>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Popular
          </div>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '16px',
          fontFamily: 'var(--ff-sans)',
        }}
      >
        {plan?.description || 'personal productivity'}
      </p>

      {/* Price */}
      <div className="pop-up" style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px', transition: 'transform 0.5s ease' }}>
        {isFree ? (
          <span
            style={{
              fontFamily: 'var(--ff-sans)',
              fontSize: '44px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}
          >
            Free
          </span>
        ) : (
          <>
            <span style={{ fontSize: '24px', color: '#8289a0', fontWeight: 600, marginRight: '2px' }}>₹</span>
            <span
              style={{
                fontFamily: 'var(--ff-sans)',
                fontSize: '44px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-3px',
              }}
            >
              {displayPrice}
            </span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginLeft: '4px' }}>
              /mo
            </span>
          </>
        )}
      </div>

      {/* Premium Metric Badge */}
      <div style={{ marginBottom: '24px' }}>
         <div style={{
           display: 'inline-flex',
           alignItems: 'center',
           gap: '6px',
           background: featured ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.04)',
           color: featured ? '#38bdf8' : '#e2e8f0',
           padding: '8px 14px',
           borderRadius: '12px',
           fontSize: '12.5px',
           fontWeight: 600,
           fontFamily: 'var(--ff-mono, monospace)',
           border: featured ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
           boxShadow: featured ? '0 0 12px rgba(56, 189, 248, 0.1)' : 'none'
         }}>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
           </svg>
           {plan?.name?.toLowerCase() === 'starter' && '5,000 API calls'}
           {plan?.name?.toLowerCase() === 'pro' && '20,000 API calls'}
           {plan?.name?.toLowerCase() === 'enterprise' && '100,000 API calls'}
           {plan?.name?.toLowerCase() === 'free' && '100 API calls'}
         </div>
      </div>

      {/* Value prop text removed for minimalism */}

      {/* CTA */}
      <button
        type="button"
        onClick={() => onAction?.(plan)}
        disabled={isDisabled}
        className="pop-up-far glassy-cta"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: 800,
          fontFamily: 'var(--ff-sans)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          marginBottom: '28px',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {subscribing ? (
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'ctaSpin 0.8s linear infinite'
          }}>
            <style>{`@keyframes ctaSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {buttonText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </>
        )}
      </button>

      {/* Features list removed for minimalism */}
    </article>
  );
});

export default PlanCard;
