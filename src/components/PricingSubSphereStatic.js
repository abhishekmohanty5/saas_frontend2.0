import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingSubSphereStatic = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const navigate = useNavigate();

    // Static pricing data - hardcoded for landing page
    const staticPlans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 499,
            durationInDays: 30,
            description: '30 days of full access to all features.',
            features: [
                { text: 'JWT authentication', included: true },
                { text: 'Automated renewals', included: true },
                { text: 'Email reminders', included: true },
                { text: 'Admin dashboard', included: false },
                { text: 'Priority support', included: false }
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 999,
            durationInDays: 30,
            description: '30 days of full access to all features.',
            features: [
                { text: 'JWT authentication', included: true },
                { text: 'Automated renewals', included: true },
                { text: 'Email reminders', included: true },
                { text: 'Admin dashboard', included: true },
                { text: 'Priority support', included: false }
            ],
            featured: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 2499,
            durationInDays: 30,
            description: '30 days of full access to all features.',
            features: [
                { text: 'JWT authentication', included: true },
                { text: 'Automated renewals', included: true },
                { text: 'Email reminders', included: true },
                { text: 'Admin dashboard', included: true },
                { text: 'Priority support', included: true }
            ]
        }
    ];

    const handleGetStarted = (planName) => {
        // Navigate to pricing page for actual subscription
        navigate('/pricing');
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
                {staticPlans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        name={plan.name}
                        price={plan.price}
                        period={`/${plan.durationInDays} days`}
                        description={plan.description}
                        features={plan.features}
                        featured={plan.featured}
                        onSelect={() => handleGetStarted(plan.name)}
                    />
                ))}
            </div>
        </div>
    );
};

const PlanCard = ({ name, price, period, description, features, featured, onSelect }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
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
                height: '100%'
            }}
        >
            {featured && (
                <div style={{
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
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    Most Popular
                </div>
            )}

            <div style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '28px',
                fontWeight: 400,
                color: featured ? '#fff' : 'var(--ink)',
                letterSpacing: '-0.5px',
                marginBottom: '8px'
            }}>
                {name}
            </div>

            <p style={{
                fontSize: '15px',
                color: featured ? 'rgba(255,255,255,0.6)' : 'var(--muted)',
                lineHeight: 1.5,
                marginBottom: '24px',
                fontFamily: 'var(--ff-sans)'
            }}>
                {description}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                <span style={{
                    fontSize: '24px',
                    color: featured ? 'rgba(255,255,255,0.8)' : 'var(--muted)',
                    fontWeight: 400,
                    fontFamily: 'var(--ff-sans)'
                }}>₹</span>
                <span style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: '56px',
                    color: featured ? 'var(--gold)' : 'var(--ink)',
                    lineHeight: 0.9,
                    letterSpacing: '-2px'
                }}>
                    {price}
                </span>
                <span style={{ fontSize: '15px', color: featured ? 'rgba(255,255,255,0.4)' : 'var(--muted)' }}>{period}</span>
            </div>

            <div style={{
                height: '1px',
                background: featured ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)' : 'rgba(0,0,0,0.06)',
                marginBottom: '32px'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
                {features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: featured ? 'rgba(255,255,255,0.8)' : 'var(--ink2)' }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            marginTop: '2px',
                            background: feature.included
                                ? (featured ? 'rgba(201, 168, 76, 0.2)' : 'rgba(45, 106, 79, 0.1)')
                                : (featured ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                            color: feature.included
                                ? (featured ? 'var(--gold)' : 'var(--emerald)')
                                : 'var(--stone)',
                            border: feature.included ? `1px solid ${featured ? 'rgba(201, 168, 76, 0.3)' : 'rgba(45, 106, 79, 0.15)'}` : 'none'
                        }}>
                            {feature.included ? '✓' : '–'}
                        </div>
                        <span style={{ opacity: feature.included ? 1 : 0.6 }}>{feature.text}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onSelect}
                style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    fontFamily: 'var(--ff-sans)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    marginTop: 'auto',
                    background: featured
                        ? 'linear-gradient(135deg, #C9A84C 0%, #F5D77F 100%)'
                        : (isHovered ? 'var(--ink)' : 'rgba(0,0,0,0.03)'),
                    color: featured
                        ? '#1A1714'
                        : (isHovered ? '#fff' : 'var(--ink)'),
                    boxShadow: featured
                        ? (isHovered ? '0 4px 15px rgba(201, 168, 76, 0.4)' : '0 2px 10px rgba(201, 168, 76, 0.2)')
                        : 'none'
                }}
            >
                {featured ? 'Start 14-day free trial' : name === 'Enterprise' ? 'Contact sales' : 'Get started'}
            </button>
        </div>
    );
};

export default PricingSubSphereStatic;
