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
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(200%)',
        WebkitBackdropFilter: 'blur(20px) saturate(200%)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
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
            0 10px 30px -10px rgba(0, 0, 0, 0.08), 
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }
        .pricing-card-3d:hover {
          transform: translateY(-24px) rotateX(8deg) rotateY(-6deg) translateZ(20px);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 
            0 45px 100px -20px rgba(0, 0, 0, 0.2), 
            0 25px 50px -25px rgba(0, 0, 0, 0.25),
            inset 0 0 0 2px rgba(255, 255, 255, 0.9);
        }
        .pricing-card-3d:hover .pop-up {
           transform: translateZ(40px);
        }
        .pricing-card-3d:hover .pop-up-far {
           transform: translateZ(60px);
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
            background: featured ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#1e1b4b',
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
          color: '#667085',
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
              color: '#1A1714',
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
                color: 'var(--ink)',
                lineHeight: 1,
                letterSpacing: '-2.5px',
              }}
            >
              ₹{displayPrice}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--stone)', fontWeight: 500, marginLeft: '4px' }}>
              /mo
            </span>
          </>
        )}
      </div>

      {/* Value prop text */}
      <p style={{ fontSize: '13px', color: '#475467', lineHeight: 1.4, marginBottom: '20px' }}>
        Level up productivity and creativity with expanded access
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onAction?.(plan)}
        disabled={isDisabled}
        className="pop-up-far"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'var(--ff-sans)',
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
          marginBottom: '24px',
          background: subscribing ? 'var(--stone)' : 'var(--ink)',
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !subscribing) e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          if (!disabled && !subscribing) e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {subscribing ? 'Processing...' : buttonText}
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
                  width: '20px',
                  height: '20px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: included ? 'var(--gold)' : 'var(--sand)',
                }}
              >
                {/* Standard check icon mimicking the reference image style */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span style={{ opacity: included ? 1 : 0.5 }}>{featureText}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
});

export default PlanCard;
