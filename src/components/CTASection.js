import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <div id="cta-section" className="cta-container-shell" style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto', background: 'var(--bg)' }}>
            <div className="cta-content-inner" style={{
                background: 'var(--testimonial-bg)',
                borderRadius: '24px',
                padding: '80px 80px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '60px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--theme-border)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
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
                    background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)'
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
                    <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold2)', marginBottom: '16px' }}>
                        Get started today
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--ff-serif)',
                        fontSize: '44px',
                        color: 'var(--theme-text)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.5px',
                        fontWeight: 400
                    }}>
                        Ready to ship your <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>subscription</em> product?
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.65, marginTop: '16px', maxWidth: '460px' }}>
                        Connect your frontend to the SubSphere backend in minutes. JWT auth, plan management, automated renewals — all ready to go.
                    </p>

                    <div className="cta-buttons" style={{ display: 'flex', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/pricing')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--theme-text)',
                                color: 'var(--bg)',
                                fontSize: '15px',
                                fontWeight: 600,
                                fontFamily: 'var(--ff-sans)',
                                padding: '16px 32px',
                                borderRadius: 'var(--r2)',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)';
                            }}
                        >
                            Start free 14-day trial
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'rgba(128,128,128,0.2)',
                                color: 'var(--bg)',
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
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'var(--ff-sans)',
                                padding: '16px 12px',
                                transition: 'color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                        >
                            View documentation
                        </button>
                    </div>
                </div>

                {/* Right - Trust Badges */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
                        <TrustItem text="JWT-secured endpoints" />
                        <TrustItem text="No credit card required" />
                        <TrustItem text="Automated lifecycle" />
                        <TrustItem text="Admin dashboard included" />
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 860px) {
                    .cta-container-shell { padding: 60px 20px !important; }
                    .cta-content-inner {
                        grid-template-columns: 1fr !important;
                        padding: 60px 32px !important;
                        text-align: center;
                    }
                    .cta-content-inner p { margin: 16px auto !important; }
                    .cta-content-inner > div { align-items: center !important; }
                    .cta-content-inner .cta-buttons { justify-content: center !important; }
                    .cta-content-inner > div:last-child { 
                        width: 100% !important; 
                        margin-top: 20px; 
                    }
                    .cta-content-inner > div:last-child > div {
                        min-width: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

const TrustItem = ({ text }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(128,128,128,0.03)',
        border: '1px solid var(--theme-border)',
        borderRadius: 'var(--r)',
        padding: '16px 20px',
        transition: 'all 0.3s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold2)' }} />
        <span style={{ fontSize: '14px', color: 'var(--theme-text)', fontWeight: 600, letterSpacing: '0.2px' }}>{text}</span>
    </div>
);

export default CTASection;
