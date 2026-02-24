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
        padding: '36px',
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
        }
        .pricing-card-3d:hover {
          transform: translateY(-24px) rotateX(8deg) rotateY(-6deg) translateZ(30px);
          background: #000000;
          box-shadow: 
            0 55px 110px -25px rgba(0, 0, 0, 0.5), 
            0 35px 70px -30px rgba(0, 0, 0, 0.6),
            inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .pricing-card-3d:hover .pop-up {
           transform: translateZ(50px);
        }
        .pricing-card-3d:hover .pop-up-far {
           transform: translateZ(80px);
        }
        
        .glassy-cta {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .glassy-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.7s;
        }
        
        .glassy-cta:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(14, 165, 233, 0.5);
          box-shadow: 0 12px 40px 0 rgba(14, 165, 233, 0.25);
          transform: translateY(-2px) scale(1.02);
        }
        
        .glassy-cta:hover::before {
          left: 150%;
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
            fontSize: '24px',
            fontWeight: 900,
            background: featured ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#ffffff',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.8px',
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
      <div className="pop-up" style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px', transition: 'transform 0.5s ease' }}>
        {isFree ? (
          <span
            style={{
              fontFamily: 'var(--ff-sans)',
              fontSize: '38px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-1.5px',
            }}
          >
            Free
          </span>
        ) : (
          <>
            <span
              style={{
                fontFamily: 'var(--ff-sans)',
                fontSize: '38px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-2.5px',
              }}
            >
              ₹{displayPrice}
            </span>
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500, marginLeft: '4px' }}>
              /mo
            </span>
          </>
        )}
      </div>

      {/* Value prop text */}
      <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '20px' }}>
        Level up productivity and creativity with expanded access
      </p>

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

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {(plan?.features || [
          'Advanced reporting',
          'Call recording',
          'Business phone services',
          'Video meeting',
          'Screen share & file share',
          'Advanced data privacy'
        ]).map((feature, i) => {
          const featureText = typeof feature === 'string' ? feature : feature.text;
          const included = typeof feature === 'string' ? true : feature.included;

          return (
            <div
              key={`${featureText}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: '#344054',
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: featured ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style={{ fontSize: '13px', color: '#e2e8f0', opacity: included ? 1 : 0.5 }}>{featureText}</span> {/* Adjusted opacity for included/excluded features */}
            </div>
          );
        })}
      </div>
    </article>
  );
});

export default PlanCard;
