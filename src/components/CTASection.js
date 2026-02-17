import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto' }} className="reveal">
            <div style={{
                background: 'linear-gradient(135deg, var(--ink) 0%, #2A241C 100%)',
                borderRadius: '24px',
                padding: '80px 80px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '60px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decorations */}
                <div style={{
                    content: '',
                    position: 'absolute',
                    top: '-60px',
                    right: '200px',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)'
                }} />
                <div style={{
                    content: '',
                    position: 'absolute',
                    bottom: '-40px',
                    right: '-40px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(44,111,172,0.06) 0%, transparent 70%)'
                }} />

                {/* Left Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
                        Get started today
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--ff-serif)',
                        fontSize: '44px',
                        color: 'white',
                        lineHeight: 1.1,
                        letterSpacing: '-0.5px',
                        fontWeight: 400
                    }}>
                        Ready to ship your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>subscription</em> product?
                    </h2>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginTop: '16px', maxWidth: '460px' }}>
                        Connect your frontend to the SubSphere backend in minutes. JWT auth, plan management, automated renewals — all ready to go.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
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
                                padding: '16px 32px',
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
                            Start free 14-day trial
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
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '14px',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'var(--ff-sans)',
                                padding: '16px 0',
                                transition: 'color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                        >
                            View documentation
                        </button>
                    </div>
                </div>

                {/* Right - Trust Badges */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
                        <TrustItem icon="🔐" text="JWT-secured endpoints" />
                        <TrustItem icon="⚡" text="No credit card required" />
                        <TrustItem icon="🔄" text="Automated lifecycle" />
                        <TrustItem icon="📊" text="Admin dashboard included" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrustItem = ({ icon, text }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--r)',
        padding: '12px 16px'
    }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{text}</span>
    </div>
);

export default CTASection;
