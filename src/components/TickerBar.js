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
                background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)', // Midnight Slate
                padding: '28px 0',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                borderTop: '1px solid rgba(37, 99, 235, 0.2)', // Subtle Azure Edge
                borderBottom: '1px solid rgba(37, 99, 235, 0.2)',
                zIndex: 10,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ambient Azure Glow */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(circle at 50% 130%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)`,
                pointerEvents: 'none'
            }} />

            {/* Cinematic Masks */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: '250px',
                background: 'linear-gradient(to right, #0F172A, transparent)',
                zIndex: 2, pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', top: 0, bottom: 0, right: 0, width: '250px',
                background: 'linear-gradient(to left, #0F172A, transparent)',
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
                color: 'rgba(255, 255, 255, 0.5)',
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
                width: '5px', height: '5px', borderRadius: '50%', background: '#3B82F6',
                animation: 'pulseAzure 2s infinite ease-in-out'
            }} />

            <span>{text}</span>

            <strong style={{
                color: '#60A5FA', // Light Azure
                background: 'rgba(37, 99, 235, 0.1)',
                padding: '6px 14px',
                borderRadius: '4px',
                fontWeight: 800,
                border: '1px solid rgba(37, 99, 235, 0.3)',
                letterSpacing: '1px'
            }}>
                {highlight}
            </strong>
        </div>
    );
};

export default TickerBar;
