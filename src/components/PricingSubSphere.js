import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { publicAPI, subscriptionAPI } from '../services/api';

const PricingSubSphere = () => {
    const [isAnnual, setIsAnnual] = useState(false);
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
            setError('Please login first to subscribe to a plan.');
            // Scroll to pricing section to show error
            document.querySelector('.pricing-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
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
            <div style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }} className="reveal">
                <div style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 500 }}>Loading pricing plans...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto' }} className="reveal pricing-section">
            {error && (
                <div
                    onClick={() => {
                        if (error.includes('login')) {
                            navigate('/login?redirect=/');
                        }
                    }}
                    style={{
                        background: '#FFEBEE',
                        border: '1px solid #F44336',
                        color: '#C62828',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: error.includes('login') ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        textAlign: 'center'
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
                    {error} {error.includes('login') && '(Click here to login)'}
                </div>
            )}
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
                {plans.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', gridColumn: '1 / -1' }}>
                        No pricing plans available at the moment.
                    </div>
                ) : (
                    plans.map((plan, index) => {
                        const isPopular = plan.name.toUpperCase() === 'PREMIUM' || plan.name.toUpperCase() === 'PRO';

                        // Default features if none provided
                        const defaultFeatures = [
                            { text: 'JWT authentication', included: true },
                            { text: 'Automated renewals', included: true },
                            { text: 'Email reminders', included: true },
                            { text: 'Admin dashboard', included: index > 0 },
                            { text: 'Priority support', included: index > 1 }
                        ];

                        const displayFeatures = plan.features.length > 0
                            ? plan.features.map(f => ({ text: f, included: true }))
                            : defaultFeatures;

                        return (
                            <PlanCard
                                key={plan.id}
                                name={plan.name}
                                price={plan.price}
                                period={`/${plan.durationInDays} days`}
                                description={`${plan.durationInDays} days of full access to all features.`}
                                features={displayFeatures}
                                featured={isPopular}
                                onSelect={() => handleSubscribe(plan.id, plan.name)}
                                subscribing={subscribingPlanId === plan.id}
                                active={plan.active}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

const PlanCard = ({ name, price, period, description, features, featured, onSelect, subscribing, active = true }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: featured ? 'var(--ink)' : 'var(--white)',
                border: `1px solid ${featured ? 'var(--ink)' : 'var(--sand)'}`,
                borderRadius: 'var(--r2)',
                padding: '32px',
                transition: 'all 0.2s',
                position: 'relative',
                transform: featured ? 'translateY(-8px)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 8px 40px rgba(0,0,0,0.08)' : 'none',
                borderColor: isHovered ? (featured ? 'var(--ink)' : 'var(--stone)') : (featured ? 'var(--ink)' : 'var(--sand)'),
                opacity: !active ? 0.6 : 1
            }}
        >
            {featured && (
                <div style={{
                    display: 'inline-block',
                    background: 'var(--gold)',
                    color: 'var(--ink)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    marginBottom: '20px'
                }}>
                    Most Popular
                </div>
            )}

            <div style={{
                fontFamily: 'var(--ff-sans)',
                fontSize: '15px',
                fontWeight: 700,
                color: featured ? 'rgba(255,255,255,0.6)' : 'var(--ink)',
                letterSpacing: '-0.2px'
            }}>
                {name}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '16px 0 8px' }}>
                <span style={{ fontSize: '20px', color: featured ? 'rgba(255,255,255,0.4)' : 'var(--muted)', fontWeight: 500 }}>$</span>
                <span style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: '52px',
                    color: featured ? 'var(--white)' : 'var(--ink)',
                    lineHeight: 1,
                    letterSpacing: '-2px'
                }}>
                    {price}
                </span>
                <span style={{ fontSize: '14px', color: featured ? 'rgba(255,255,255,0.4)' : 'var(--muted)' }}>{period}</span>
            </div>

            <p style={{ fontSize: '14px', color: featured ? 'rgba(255,255,255,0.5)' : 'var(--muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                {description}
            </p>

            <div style={{ height: '1px', background: featured ? 'rgba(255,255,255,0.08)' : 'var(--sand)', marginBottom: '24px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: featured ? 'rgba(255,255,255,0.6)' : 'var(--muted)' }}>
                        <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            marginTop: '1px',
                            background: feature.included ? (featured ? 'rgba(198,241,53,0.1)' : 'rgba(64,145,108,0.12)') : (featured ? 'rgba(255,255,255,0.05)' : 'var(--cream)'),
                            color: feature.included ? (featured ? '#9fe870' : 'var(--emerald2)') : 'var(--stone)'
                        }}>
                            {feature.included ? '✓' : '–'}
                        </div>
                        {feature.text}
                    </div>
                ))}
            </div>

            <button
                onClick={onSelect}
                disabled={!active || subscribing}
                style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: 'var(--r)',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--ff-sans)',
                    border: featured ? 'none' : '1px solid var(--sand)',
                    cursor: (active && !subscribing) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    background: subscribing ? 'var(--stone)' : (featured ? 'var(--gold)' : 'none'),
                    color: featured ? 'var(--ink)' : 'var(--ink)',
                    opacity: (!active || subscribing) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                    if (active && !subscribing) {
                        if (featured) {
                            e.target.style.background = 'var(--gold2)';
                            e.target.style.boxShadow = '0 4px 20px rgba(201,168,76,0.3)';
                        } else {
                            e.target.style.borderColor = 'var(--stone)';
                            e.target.style.background = 'var(--cream)';
                        }
                    }
                }}
                onMouseLeave={(e) => {
                    if (active && !subscribing) {
                        if (featured) {
                            e.target.style.background = 'var(--gold)';
                            e.target.style.boxShadow = 'none';
                        } else {
                            e.target.style.borderColor = 'var(--sand)';
                            e.target.style.background = 'none';
                        }
                    }
                }}
            >
                {subscribing ? 'Processing...' : (featured ? 'Start free trial' : name === 'Enterprise' ? 'Contact sales' : 'Get started')}
            </button>
        </div>
    );
};

export default PricingSubSphere;
