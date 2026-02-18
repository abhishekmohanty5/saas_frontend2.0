import React, { useMemo, useState } from 'react';
import { BILLING_INTERVALS } from './pricingData';

const roundPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
};

// Annual toggle behavior:
// - UI shows the equivalent discounted monthly price (20% off) when annual is selected.
// - Keeps the same layout (₹ + big number + "/30 days") like landing section.
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
  if (plan?.featured) return 'Start 14-day free trial';
  return 'Get started';
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
        background: featured ? 'linear-gradient(145deg, #1A1714 0%, #2D2620 100%)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: featured ? 'none' : 'blur(20px)',
        WebkitBackdropFilter: featured ? 'none' : 'blur(20px)',
        border: featured ? '1px solid rgba(201, 168, 76, 0.3)' : '1px solid rgba(232, 226, 214, 0.6)',
        borderRadius: '24px',
        padding: '40px 32px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        transform: featured ? (isHovered ? 'translateY(-12px)' : 'translateY(-8px)') : (isHovered ? 'translateY(-6px)' : 'translateY(0)'),
        boxShadow: featured
          ? (isHovered ? '0 20px 40px -10px rgba(201, 168, 76, 0.2)' : '0 10px 30px -10px rgba(0, 0, 0, 0.3)')
          : (isHovered ? '0 15px 30px -5px rgba(0, 0, 0, 0.05)' : '0 2px 10px rgba(0, 0, 0, 0.02)'),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: plan?.active === false ? 0.6 : 1,
      }}
    >
      {/* Most Popular Badge */}
      {featured && showMostPopularBadge && (
        <div
          style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, #D4AF37 0%, #C5A028 100%)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          Most Popular
        </div>
      )}

      {/* Plan Name */}
      <div
        style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: '28px',
          fontWeight: 400,
          color: featured ? '#fff' : 'var(--ink)',
          letterSpacing: '-0.5px',
          marginBottom: '8px',
        }}
      >
        {plan?.name}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '15px',
          color: featured ? 'rgba(255,255,255,0.6)' : 'var(--muted)',
          lineHeight: 1.5,
          marginBottom: '24px',
          fontFamily: 'var(--ff-sans)',
        }}
      >
        {plan?.description || '30 days of full access to all features.'}
      </p>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
        {isFree ? (
          <span
            style={{
              fontFamily: 'var(--ff-serif)',
              fontSize: '56px',
              color: featured ? 'var(--gold)' : 'var(--ink)',
              lineHeight: 0.9,
              letterSpacing: '-2px',
            }}
          >
            Free
          </span>
        ) : (
          <>
            <span
              style={{
                fontSize: '24px',
                color: featured ? 'rgba(255,255,255,0.8)' : 'var(--muted)',
                fontWeight: 400,
                fontFamily: 'var(--ff-sans)',
              }}
            >
              ₹
            </span>
            <span
              style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '56px',
                color: featured ? 'var(--gold)' : 'var(--ink)',
                lineHeight: 0.9,
                letterSpacing: '-2px',
              }}
            >
              {displayPrice}
            </span>
            <span style={{ fontSize: '15px', color: featured ? 'rgba(255,255,255,0.4)' : 'var(--muted)' }}>
              /{plan?.durationInDays || 30} days
            </span>
          </>
        )}
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: featured
            ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)'
            : 'rgba(0,0,0,0.06)',
          marginBottom: '32px',
        }}
      />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
        {(plan?.features || []).map((feature, i) => {
          const featureText = typeof feature === 'string' ? feature : feature.text;
          const included = typeof feature === 'string' ? true : feature.included;

          return (
            <div
              key={`${featureText}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '15px',
                color: featured ? 'rgba(255,255,255,0.8)' : 'var(--ink2)',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  marginTop: '2px',
                  background: included
                    ? (featured ? 'rgba(201, 168, 76, 0.2)' : 'rgba(45, 106, 79, 0.1)')
                    : featured
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                  color: included ? (featured ? 'var(--gold)' : 'var(--emerald)') : 'var(--stone)',
                  border: included ? `1px solid ${featured ? 'rgba(201, 168, 76, 0.3)' : 'rgba(45, 106, 79, 0.15)'}` : 'none',
                }}
              >
                {included ? '✓' : '–'}
              </div>
              <span style={{ opacity: included ? 1 : 0.6 }}>{featureText}</span>
            </div>
          );
        })}
      </div>

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
          transition: 'all 0.3s',
          marginTop: 'auto',
          opacity: isDisabled ? 0.5 : 1,
          background: subscribing
            ? '#999'
            : featured
              ? 'linear-gradient(135deg, #C9A84C 0%, #F5D77F 100%)'
              : (isHovered ? 'var(--ink)' : 'rgba(0,0,0,0.03)'),
          color: subscribing ? '#fff' : featured ? '#1A1714' : isHovered ? '#fff' : 'var(--ink)',
          boxShadow: featured && !subscribing
            ? (isHovered ? '0 4px 15px rgba(201, 168, 76, 0.4)' : '0 2px 10px rgba(201, 168, 76, 0.2)')
            : 'none',
        }}
      >
        {subscribing ? 'Processing...' : buttonText}
      </button>

      {billingInterval === BILLING_INTERVALS.ANNUAL && !isFree && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: featured ? 'rgba(255,255,255,0.5)' : 'var(--muted2)' }}>
          Billed annually (20% off)
        </div>
      )}
    </div>
  );
}

