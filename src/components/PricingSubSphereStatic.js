import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanCard from './pricing/PlanCard';
import { BILLING_INTERVALS, DEFAULT_PLANS } from './pricing/pricingData';

const PricingSubSphereStatic = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const navigate = useNavigate();

    const billingInterval = isAnnual ? BILLING_INTERVALS.ANNUAL : BILLING_INTERVALS.MONTHLY;

    const handleGetStarted = (plan) => {
        // Landing page is a preview; real subscribe happens in /pricing.
        // Pass plan + billing in query to reduce confusion.
        const params = new URLSearchParams();
        if (plan?.id) params.set('plan', String(plan.id));
        if (plan?.name) params.set('planName', String(plan.name));
        params.set('billing', billingInterval);
        navigate(`/pricing?${params.toString()}`);
    };

    return (
        <div style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto' }} className="pricing-section">
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                Pricing
            </div>
            <h2 style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                color: 'var(--ink)',
                fontWeight: 400,
                maxWidth: '680px'
            }}>
                Simple, transparent <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>pricing</em>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '560px', marginTop: '20px' }}>
                All plans include the full API, JWT auth, automated scheduler, and admin dashboard.
            </p>

            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', fontSize: '14px', color: 'var(--muted)' }}>
                <span>Monthly</span>
                <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        background: isAnnual ? 'var(--ink)' : 'var(--sand)',
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
                        left: isAnnual ? '23px' : '3px',
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

            {/* Plans Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '48px', alignItems: 'start' }}>
                {DEFAULT_PLANS.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        billingInterval={billingInterval}
                        onAction={handleGetStarted}
                    />
                ))}
            </div>
        </div>
    );
};

export default PricingSubSphereStatic;
