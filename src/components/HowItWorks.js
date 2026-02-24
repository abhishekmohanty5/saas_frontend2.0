import React, { useState, useEffect } from 'react';

const HowItWorks = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 4);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            number: "1",
            title: "Register your startup",
            content: (
                <>
                    POST <code style={codeStyle}>/api/auth/reg</code> with <code style={codeStyle}>tenantName, email...</code> → Gets JWT token + client credentials.
                </>
            )
        },
        {
            number: "2",
            title: "Open Developer Console",
            content: (
                <>
                    GET <code style={codeStyle}>/api/dashboard</code> → See your plan, API keys, usage stats, and enabled services in one place.
                </>
            )
        },
        {
            number: "3",
            title: "Use the APIs",
            content: (
                <>
                    Integrate SubSphere auth & subscription APIs into your product using your <code style={codeStyle}>clientId</code> as identifier.
                </>
            )
        },
        {
            number: "4",
            title: "Engine handles the rest",
            content: "Expiry auto-runs at 2 AM, reminders at 9 AM, usage is counted per call. Zero cron jobs needed."
        }
    ];

    return (
        <div id="how-it-works" style={{
            background: 'var(--cream)',
            padding: '140px 48px',
            position: 'relative',
            overflow: 'hidden',
            perspective: '1500px' // Global perspective for the entire section
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute', top: '-100px', right: '-100px',
                width: '600px', height: '600px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(40px)'
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
                <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px', textAlign: 'center' }}>
                    THE ENGINE LIFECYCLE
                </div>
                <h2 style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    lineHeight: 1.05,
                    letterSpacing: '-1.5px',
                    color: 'var(--ink)',
                    fontWeight: 400,
                    textAlign: 'center',
                    marginBottom: '100px'
                }}>
                    Spatial Integration <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Storyboarding</em>
                </h2>

                {/* Steps Container with 3D context */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '40px',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                }}>
                    {/* Progress Track - Elevated in 3D */}
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        left: '12.5%',
                        right: '12.5%',
                        height: '1px',
                        background: 'rgba(0,0,0,0.08)',
                        zIndex: 0,
                        transform: 'translateZ(-10px)'
                    }}>
                        {/* 3D Animated Data Packet */}
                        <div style={{
                            position: 'absolute',
                            top: -8,
                            left: `${(activeIndex / 3) * 100}%`,
                            width: '16px',
                            height: '16px',
                            background: 'white',
                            border: '2px solid var(--gold)',
                            borderRadius: '4px',
                            boxShadow: '0 0 25px rgba(37,99,235,0.4), 0 0 5px white',
                            transition: 'left 1s cubic-bezier(0.65, 0, 0.35, 1)',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(45deg) translateZ(20px)',
                            fontSize: '8px',
                            fontWeight: 900,
                            color: 'var(--gold)'
                        }}>
                            <span style={{ transform: 'rotate(-45deg)' }}>⚡</span>
                        </div>

                        {/* Progress Light Fill */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${(activeIndex / 3) * 100}%`,
                            height: '100%',
                            background: 'var(--gold)',
                            opacity: 0.4,
                            transition: 'width 1s cubic-bezier(0.65, 0, 0.35, 1)'
                        }} />
                    </div>

                    {steps.map((step, idx) => (
                        <StepCard
                            key={idx}
                            number={step.number}
                            title={step.title}
                            active={activeIndex === idx}
                            delay={idx * 0.1}
                        >
                            {step.content}
                        </StepCard>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse3D {
                    0% { transform: scale(1) translateZ(60px) rotateY(-10deg); box-shadow: 0 40px 100px -20px rgba(0,0,0,0.2), 0 0 0 0 rgba(37,99,235,0.4); }
                    50% { transform: scale(1.05) translateZ(75px) rotateY(-8deg); box-shadow: 0 60px 120px -30px rgba(0,0,0,0.25), 0 0 0 20px rgba(37,99,235,0); }
                    100% { transform: scale(1) translateZ(60px) rotateY(-10deg); box-shadow: 0 40px 100px -20px rgba(0,0,0,0.2), 0 0 0 0 rgba(37,99,235,0); }
                }
                @keyframes subtleEntry {
                    from { opacity: 0; transform: translateY(20px) translateZ(-50px); }
                    to { opacity: 1; transform: translateY(0) translateZ(0); }
                }
            `}</style>
        </div>
    );
};

const StepCard = ({ number, title, children, active }) => (
    <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: active ? 10 : 1,
        transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
        transform: active
            ? 'translateZ(60px) rotateY(-10deg)'
            : 'translateZ(0) rotateY(0)',
        opacity: active ? 1 : 0.4,
        animation: active ? 'pulse3D 3s infinite ease-in-out' : 'subtleEntry 0.6s ease both'
    }}>
        {/* Number Badge with 3D Layers */}
        <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: active ? 'var(--ink)' : 'var(--white)',
            border: active ? '3px solid var(--gold)' : '1px solid var(--sand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--ff-serif)',
            fontSize: '32px',
            color: active ? 'var(--white)' : 'var(--ink)',
            margin: '0 auto 32px',
            boxShadow: active ? '0 20px 40px -10px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.05)',
            transform: 'translateZ(20px)',
            position: 'relative'
        }}>
            {number}
            {/* Depth Edge */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: -4,
                background: 'rgba(0,0,0,0.1)',
                borderRadius: 'inherit',
                zIndex: -1,
                transform: 'translateZ(-1px)'
            }} />
        </div>

        {/* Text Context with perspective */}
        <div style={{
            fontSize: '18px',
            fontWeight: 800,
            color: active ? 'var(--ink)' : 'var(--stone)',
            marginBottom: '16px',
            transition: 'color 0.4s',
            transform: 'translateZ(10px)'
        }}>
            {title}
        </div>
        <div style={{
            fontSize: '14px',
            color: 'var(--muted)',
            lineHeight: 1.7,
            maxWidth: '240px',
            margin: '0 auto',
            transform: 'translateZ(5px)',
            background: active ? 'rgba(255,255,255,0.4)' : 'transparent',
            padding: active ? '12px' : '0',
            borderRadius: '12px',
            border: active ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent'
        }}>
            {children}
        </div>
    </div>
);

const codeStyle = {
    fontFamily: 'var(--ff-mono)',
    fontSize: '11px',
    background: 'rgba(37,99,235,0.1)',
    padding: '2px 4px',
    borderRadius: '4px',
    color: 'var(--ink)',
    fontWeight: 600
};

export default HowItWorks;
