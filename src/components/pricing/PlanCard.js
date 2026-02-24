import React, { useMemo, useState } from 'react';
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

export default function PlanCard({
  plan,
  billingInterval = BILLING_INTERVALS.MONTHLY,
  onAction,
  actionLabel,
  disabled,
  subscribing,
  showMostPopularBadge = true,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const featured = !!plan?.featured;
  const isFree = roundPrice(plan?.price) === 0;

  const displayPrice = useMemo(() => {
    if (isFree) return 0;
    return getDisplayPrice({ price: plan?.price, billingInterval });
  }, [billingInterval, isFree, plan?.price]);

  const buttonText = actionLabel || defaultButtonLabel(plan);
  const isDisabled = !!disabled || !!subscribing || plan?.active === false;

  return (
    <div
      id={plan?.id ? `plan-${plan.id}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '24px',
        padding: '32px 32px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 32px 64px -16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)'
          : '0 4px 12px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: plan?.active === false ? 0.6 : 1,
      }}
    >
      {/* Header Row: Title & Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div
          style={{
            fontFamily: 'var(--ff-sans)',
            fontSize: '28px',
            fontWeight: 600,
            background: featured ? 'linear-gradient(90deg, var(--gold) 0%, var(--gold2) 100%)' : 'var(--ink)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: featured ? 'transparent' : 'initial',
            letterSpacing: '-0.5px',
          }}
        >
          {plan?.name || 'Plus'}
        </div>

        {featured && showMostPopularBadge && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(37, 99, 235, 0.05)',
              color: 'var(--gold)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(37,99,235,0.1)',
            }}
          >
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
          fontSize: '15px',
          color: '#667085',
          marginBottom: '24px',
          fontFamily: 'var(--ff-sans)',
        }}
      >
        {plan?.description || 'personal productivity'}
      </p>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
        {isFree ? (
          <span
            style={{
              fontFamily: 'var(--ff-sans)',
              fontSize: '48px',
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
                fontSize: '48px',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1,
                letterSpacing: '-2.5px',
              }}
            >
              ₹{displayPrice}
            </span>
            <span style={{ fontSize: '15px', color: 'var(--stone)', fontWeight: 500, marginLeft: '4px' }}>
              /mo
            </span>
          </>
        )}
      </div>

      {/* Value prop text */}
      <p style={{ fontSize: '14px', color: '#475467', lineHeight: 1.5, marginBottom: '24px' }}>
        Level up productivity and creativity with expanded access
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onAction?.(plan)}
        disabled={isDisabled}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: 'var(--ff-sans)',
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginBottom: '32px',
          background: subscribing ? 'var(--stone)' : 'var(--ink)',
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
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
    </div>
  );
}
