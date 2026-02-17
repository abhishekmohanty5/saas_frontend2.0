import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSubSphere = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Animate chart bars on mount
        const bars = document.querySelectorAll('.chart-bar');
        bars.forEach((bar, i) => {
            const height = bar.style.height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = height;
            }, 300 + i * 60);
        });
    }, []);

    return (
        <section style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '140px 48px 100px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Background Gradient */}
            <div style={{
                content: '',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
          radial-gradient(ellipse 55% 60% at 85% 30%, rgba(201,168,76,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 40% 50% at 15% 75%, rgba(44,111,172,0.05) 0%, transparent 60%)
        `,
                pointerEvents: 'none',
                zIndex: -1
            }} />

            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Pill Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid var(--sand)',
                    borderRadius: '100px',
                    padding: '6px 14px 6px 8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--muted)',
                    width: 'fit-content',
                    marginBottom: '32px',
                    background: 'var(--white)',
                    animation: 'fadeSlideUp 0.6s ease both'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--emerald2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: 'white',
                            borderRadius: '50%'
                        }} />
                    </div>
                    Spring Boot backend · Production ready
                    <strong style={{ marginLeft: '2px', color: 'var(--ink)', fontWeight: 600 }}>v1.0</strong>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: 'clamp(42px, 5.5vw, 68px)',
                    lineHeight: 1.08,
                    letterSpacing: '-1px',
                    color: 'var(--ink)',
                    fontWeight: 400,
                    animation: 'fadeSlideUp 0.7s 0.1s ease both'
                }}>
                    Subscription<br />billing that <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>just<br />works.</em>
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '17px',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                    marginTop: '24px',
                    maxWidth: '480px',
                    fontWeight: 400,
                    animation: 'fadeSlideUp 0.7s 0.2s ease both'
                }}>
                    SubSphere handles the entire subscription lifecycle — from signup to expiry, renewal reminders, plan upgrades, and access control — powered by a battle-tested Spring Boot backend.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '40px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    animation: 'fadeSlideUp 0.7s 0.3s ease both'
                }}>
                    <button
                        onClick={() => navigate('/pricing')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'var(--ink)',
                            color: 'var(--white)',
                            fontSize: '15px',
                            fontWeight: 600,
                            fontFamily: 'var(--ff-sans)',
                            padding: '14px 28px',
                            borderRadius: 'var(--r2)',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--ink2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--ink)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)';
                        }}
                    >
                        Start your free trial
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                        }}>→</div>
                    </button>

                    <button
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'none',
                            color: 'var(--muted)',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--ff-sans)',
                            padding: '14px 0',
                            transition: 'color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
                        </svg>
                        See how it works
                    </button>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--stone)', marginTop: '16px' }}>
                    No credit card required. <strong style={{ color: 'var(--muted)' }}>14-day free trial.</strong>
                </div>

                {/* Trusted By Logos */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginTop: '48px',
                    paddingTop: '36px',
                    borderTop: '1px solid var(--sand)',
                    flexWrap: 'wrap',
                    animation: 'fadeSlideUp 0.7s 0.4s ease both'
                }}>
                    <span style={{ fontSize: '12px', color: 'var(--stone)', fontWeight: 500, marginRight: '4px', whiteSpace: 'nowrap' }}>
                        Trusted by teams at
                    </span>
                    <LogoChip name="Buildworks" />
                    <LogoChip name="Pineloop" />
                    <LogoChip name="Triarc" />
                </div>
            </div>

            {/* Right Column - Dashboard Mockup */}
            <DashboardMockup />
        </section>
    );
};

// Logo Chip Component
const LogoChip = ({ name }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--muted)',
        background: 'var(--cream)',
        border: '1px solid var(--sand)',
        padding: '5px 12px',
        borderRadius: '6px'
    }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect width="6" height="6" rx="1.5" fill="#1A1714" />
            <rect x="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".4" />
            <rect y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".4" />
            <rect x="8" y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".7" />
        </svg>
        {name}
    </div>
);

// Dashboard Mockup Component
const DashboardMockup = () => (
    <div style={{
        position: 'relative',
        animation: 'fadeSlideUp 0.9s 0.15s ease both',
        padding: '28px 28px 28px 0'
    }}>
        <div style={{
            background: 'var(--white)',
            border: '1px solid var(--sand)',
            borderRadius: 'var(--r3)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                background: 'var(--cream)',
                borderBottom: '1px solid var(--sand)',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28ca41' }} />
                <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--ff-mono)' }}>
                    subsphere — admin dashboard
                </span>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--sand)' }}>
                <Tab active>Overview</Tab>
                <Tab>Subscriptions</Tab>
                <Tab>Plans</Tab>
                <Tab>Settings</Tab>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <MetricBox label="MRR" value="$8,402" delta="↑ 12.4%" positive />
                    <MetricBox label="Active" value="342" delta="↑ 8 today" positive />
                    <MetricBox label="Churn" value="2.1%" delta="↓ 0.3%" negative />
                </div>

                {/* Mini Chart */}
                <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '5px', marginBottom: '20px' }}>
                    <ChartBar height="35%" />
                    <ChartBar height="50%" />
                    <ChartBar height="42%" />
                    <ChartBar height="60%" />
                    <ChartBar height="55%" highlight />
                    <ChartBar height="70%" />
                    <ChartBar height="88%" gold />
                    <ChartBar height="75%" />
                    <ChartBar height="92%" />
                    <ChartBar height="100%" highlight />
                    <ChartBar height="82%" />
                    <ChartBar height="78%" />
                </div>

                {/* Subscription List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <SubItem name="Arjun Kumar" plan="Pro · expires Mar 17" amount="$29.99" status="Active" gradient="linear-gradient(135deg,#7c6cf4,#38bdf8)" />
                    <SubItem name="Priya Rao" plan="Basic · expires Feb 28" amount="$9.99" status="Trial" gradient="linear-gradient(135deg,#f59e0b,#ef4444)" />
                    <SubItem name="Manish Shah" plan="Enterprise · expires Apr 1" amount="$79.00" status="Active" gradient="linear-gradient(135deg,#2D6A4F,#40916C)" />
                </div>
            </div>
        </div>

        {/* Floating Card 1 */}
        <FloatingCard1 />
        {/* Floating Card 2 */}
        <FloatingCard2 />
    </div>
);

const Tab = ({ children, active }) => (
    <div style={{
        padding: '12px 20px',
        fontSize: '13px',
        fontWeight: 500,
        color: active ? 'var(--ink)' : 'var(--muted)',
        borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
        transition: 'all 0.15s',
        cursor: 'pointer'
    }}>
        {children}
    </div>
);

const MetricBox = ({ label, value, delta, positive, negative }) => (
    <div style={{
        background: 'var(--cream)',
        borderRadius: 'var(--r)',
        padding: '14px 16px'
    }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
        </div>
        <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '24px', color: 'var(--ink)', marginTop: '4px' }}>
            {value}
        </div>
        <div style={{ fontSize: '11px', color: positive ? 'var(--emerald2)' : negative ? 'var(--rose)' : 'var(--muted)', fontWeight: 600, marginTop: '2px' }}>
            {delta}
        </div>
    </div>
);

const ChartBar = ({ height, highlight, gold }) => (
    <div className="chart-bar" style={{
        flex: 1,
        borderRadius: '5px 5px 0 0',
        background: gold ? 'var(--gold)' : highlight ? 'var(--ink)' : 'var(--sand)',
        height,
        transition: 'height 0.8s cubic-bezier(.25,1,.5,1)'
    }} />
);

const SubItem = ({ name, plan, amount, status, gradient }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: 'var(--r)',
        background: 'var(--white)',
        border: '1px solid var(--sand)'
    }}>
        <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: 'white',
            background: gradient
        }}>
            {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{plan}</div>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--ff-mono)' }}>
            {amount}
        </div>
        <div style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '20px',
            background: status === 'Active' ? 'rgba(64,145,108,0.1)' : 'rgba(201,168,76,0.12)',
            color: status === 'Active' ? 'var(--emerald2)' : 'var(--gold)'
        }}>
            {status}
        </div>
    </div>
);

const FloatingCard1 = () => (
    <div style={{
        position: 'absolute',
        top: '-28px',
        right: '-28px',
        background: 'var(--white)',
        border: '1px solid var(--sand)',
        borderRadius: 'var(--r2)',
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minWidth: '180px',
        animation: 'float1 4s ease-in-out infinite'
    }}>
        <div style={{ fontSize: '11px', color: 'var(--stone)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Monthly Revenue
        </div>
        <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', color: 'var(--ink)', marginTop: '2px' }}>
            $8,402
        </div>
        <div style={{ fontSize: '12px', color: 'var(--emerald2)', fontWeight: 600, marginTop: '2px' }}>
            ↑ 12.4% vs last month
        </div>
        <div style={{ height: '4px', background: 'var(--sand)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '2px', background: 'var(--gold)', width: '74%' }} />
        </div>
    </div>
);

const FloatingCard2 = () => (
    <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '-32px',
        background: 'var(--white)',
        border: '1px solid var(--sand)',
        borderRadius: 'var(--r2)',
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minWidth: '180px',
        animation: 'float2 4.5s ease-in-out infinite'
    }}>
        <div style={{ fontSize: '11px', color: 'var(--stone)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Renewal Reminder
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.5 }}>
            📧 <strong style={{ color: 'var(--ink)' }}>14 users</strong> notified<br />expiring in 3 days
        </div>
        <div style={{
            marginTop: '8px',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'rgba(64,145,108,0.1)',
            color: 'var(--emerald2)',
            display: 'inline-block',
            fontWeight: 600
        }}>
            Sent at 9:00 AM
        </div>
    </div>
);

export default HeroSubSphere;
