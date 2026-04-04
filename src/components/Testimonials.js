import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            stars: 5,
            quote: "The automated billing cycles and multi-tenant isolation were ready within hours. It's rare to find a Spring Boot engine this polished and developer-friendly.",
            name: "Biswaranjan",
            role: "Software Architect · TechNova",
            avatar: "B",
            gradient: "linear-gradient(135deg,#7c6cf4,#38bdf8)"
        },
        {
            stars: 5,
            quote: "SubSphere handled our 50k requests/sec effortlessly. The AI churn prediction is scarily accurate—we reduced customer churn by 18% in the first month.",
            name: "Sasi Kumar",
            role: "CTO · CloudScale",
            avatar: "S",
            gradient: "linear-gradient(135deg,#2D6A4F,#40916C)"
        },
        {
            stars: 5,
            quote: "Integration was seamless. The predictable AppResponse wrapper and the JWT handshake saved us weeks of security audit preparations. Billion-dollar infra indeed.",
            name: "Gaurav Kumar",
            role: "Engineering Manager · FinFlow",
            avatar: "G",
            gradient: "linear-gradient(135deg,#C9A84C,#E2BE6A)"
        }
    ];

    return (
        <div style={{
            background: 'var(--bg)', // Unified background that flips properly
            padding: '120px 48px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid var(--theme-border)'
        }}>
            {/* Subtle background texture */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--theme-border), transparent)'
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }} className="reveal">
                <div style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--gold2)',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    TESTIMONIALS
                </div>
                <h2 style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    lineHeight: 1.1,
                    letterSpacing: '-1.5px',
                    color: 'var(--theme-text)',
                    fontWeight: 400,
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    Trusted by engineers <br />
                    <em style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>scaling the future.</em>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', marginTop: '72px' }}>
                    {testimonials.map((testimonial, i) => (
                        <TestimonialCard key={i} {...testimonial} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TestimonialCard = ({ stars, quote, name, role, avatar, gradient }) => {
    return (
        <div
            style={{
                background: 'var(--testimonial-bg)',
                border: '1px solid var(--theme-border)',
                borderRadius: '24px',
                padding: '40px',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.05)'
            }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = 'var(--gold2)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px -4px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = 'var(--theme-border)';
            }}
        >
            <div style={{ color: 'var(--gold2)', fontSize: '13px', letterSpacing: '2px', marginBottom: '24px' }}>
                {'★'.repeat(stars)}
            </div>

            <div style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '18px',
                color: 'var(--theme-text)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '32px'
            }}>
                "{quote}"
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingTop: '32px',
                borderTop: '1px solid var(--theme-border)'
            }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: gradient,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {avatar}
                </div>
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--theme-text)' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>{role}</div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
