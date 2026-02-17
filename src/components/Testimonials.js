import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            stars: 5,
            quote: "The scheduler is a game-changer. Subscriptions expire and renew automatically — we stopped writing cron jobs entirely.",
            name: "Arjun Kumar",
            role: "Lead Engineer · Buildworks",
            avatar: "AK",
            gradient: "linear-gradient(135deg,#7c6cf4,#38bdf8)"
        },
        {
            stars: 5,
            quote: "AppResponse wraps every endpoint consistently. Our frontend team stopped guessing what shape data would arrive in.",
            name: "Sneha Rao",
            role: "Frontend Dev · Pineloop",
            avatar: "SR",
            gradient: "linear-gradient(135deg,#2D6A4F,#40916C)"
        },
        {
            stars: 5,
            quote: "Role-based access just worked from day one. Wired up our admin panel in an afternoon. The JWT setup is clean and predictable.",
            name: "Manish Shah",
            role: "CTO · Triarc",
            avatar: "MS",
            gradient: "linear-gradient(135deg,#C9A84C,#E2BE6A)"
        }
    ];

    return (
        <div style={{
            background: 'var(--ink)',
            padding: '100px 48px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background gradients */}
            <div style={{
                content: '',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
          radial-gradient(ellipse 40% 60% at 10% 50%, rgba(201,168,76,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 30% 50% at 90% 30%, rgba(44,111,172,0.06) 0%, transparent 60%)
        `,
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }} className="reveal">
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                    Testimonials
                </div>
                <h2 style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.5px',
                    color: 'var(--white)',
                    fontWeight: 400,
                    maxWidth: '100%'
                }}>
                    Trusted by developers<br />shipping real products
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '56px' }}>
                    {testimonials.map((testimonial, i) => (
                        <TestimonialCard key={i} {...testimonial} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TestimonialCard = ({ stars, quote, name, role, avatar, gradient }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 'var(--r2)',
                padding: '28px',
                transition: 'background 0.2s, border-color 0.2s'
            }}
        >
            <div style={{ color: 'var(--gold)', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px' }}>
                {'★'.repeat(stars)}
            </div>
            <div style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.65,
                fontStyle: 'italic'
            }}>
                "{quote}"
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'white',
                    background: gradient
                }}>
                    {avatar}
                </div>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{role}</div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
