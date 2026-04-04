import React, { useState } from 'react';

const TickerBar = () => {
    const [isHovered, setIsHovered] = useState(false);

    const features = [
        { text: 'JWT Security Architecture with', highlight: 'HS256 Protocol' },
        { text: 'Multi-Tenant Isolation for', highlight: 'Data Confidentiality' },
        { text: 'Automated Lifecycle with', highlight: 'Zero-Cron Backend' },
        { text: 'High-Throughput Node-Cluster for', highlight: 'Infinite Scaling' },
        { text: 'Billion-Dollar API Infrastructure', highlight: 'Spring Boot v3.2' },
        { text: 'Identity Handshake featuring', highlight: 'BCrypt Salting' },
        { text: 'Predictive Retainment Logic via', highlight: 'AI Gemini Pro' },
        { text: 'Global Regional Clusters with', highlight: '99.99% Uptime SLA' },
    ];

    return (
        <div
            style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                padding: '28px 0',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                boxShadow: 'var(--glass-shadow-inner), 0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                borderTop: '1px solid var(--theme-border)',
                borderBottom: '1px solid var(--theme-border)',
                zIndex: 10,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ambient Responsive Glow */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(circle at 50% 130%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)`,
                pointerEvents: 'none'
            }} />

            {/* Cinematic Masks */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: '250px',
                background: 'linear-gradient(to right, var(--bg), transparent)',
                zIndex: 2, pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', top: 0, bottom: 0, right: 0, width: '250px',
                background: 'linear-gradient(to left, var(--bg), transparent)',
                zIndex: 2, pointerEvents: 'none'
            }} />

            <div
                style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    animation: 'scrollTicker 50s linear infinite',
                    animationPlayState: isHovered ? 'paused' : 'running',
                    width: 'max-content'
                }}
            >
                <div style={{ display: 'flex' }}>
                    {features.map((feature, i) => (
                        <TickerItem key={`azure-1-${i}`} {...feature} />
                    ))}
                </div>
                <div style={{ display: 'flex' }}>
                    {features.map((feature, i) => (
                        <TickerItem key={`azure-2-${i}`} {...feature} />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scrollTicker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes pulseAzure {
                    0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 10px rgba(37, 99, 235, 0.5); }
                    50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 15px rgba(37, 99, 235, 0.8); }
                }
            `}</style>
        </div>
    );
};

const TickerItem = ({ text, highlight }) => {
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '11px',
                color: 'var(--muted)',
                fontWeight: 600,
                padding: '0 65px',
                cursor: 'default',
                fontFamily: 'var(--ff-sans)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
            }}
        >
            {/* Azure Pulsing Core */}
            <div style={{
                width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor',
                animation: 'pulseAzure 2s infinite ease-in-out'
            }} />

            <span>{text}</span>

            <strong style={{
                color: 'var(--accent2)', // Light Azure
                background: 'var(--gold-dim)',
                padding: '6px 14px',
                borderRadius: '4px',
                fontWeight: 800,
                border: '1px solid var(--theme-border)',
                letterSpacing: '1px'
            }}>
                {highlight}
            </strong>
        </div>
    );
};

export default TickerBar;
