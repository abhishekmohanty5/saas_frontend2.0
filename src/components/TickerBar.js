import React from 'react';

const TickerBar = () => {
    const features = [
        { icon: '⚡', text: 'JWT Auth with', highlight: 'HS256 signing' },
        { icon: '🔑', text: 'Auto-generated', highlight: 'Client ID & Secret', extra: 'on registration' },
        { icon: '🕐', text: 'Subscriptions', highlight: 'auto-expire', extra: 'at 2:00 AM daily' },
        { icon: '📧', text: 'Renewal emails sent at', highlight: '9:00 AM', extra: '— 3 days before expiry' },
        { icon: '🏢', text: 'Multi-tenant —', highlight: 'complete data isolation', extra: 'per startup' },
        { icon: '📊', text: 'Developer Console with', highlight: 'live API usage', extra: 'counter' },
        { icon: '🗄️', text: '', highlight: 'MySQL + Spring JPA', extra: 'backend' },
        { icon: '🔄', text: 'Cancel, Renew, Upgrade —', highlight: 'one API call', extra: 'each' },
    ];

    return (
        <div style={{
            background: 'var(--ink)',
            padding: '18px 0',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                gap: 0,
                whiteSpace: 'nowrap',
                animation: 'ticker 30s linear infinite'
            }}>
                {/* First set */}
                {features.map((feature, i) => (
                    <TickerItem key={i} {...feature} />
                ))}
                {/* Duplicate for infinite scroll */}
                {features.map((feature, i) => (
                    <TickerItem key={`dup-${i}`} {...feature} />
                ))}
            </div>
        </div>
    );
};

const TickerItem = ({ icon, text, highlight, extra }) => (
    <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        color: 'var(--stone)',
        fontWeight: 500,
        padding: '0 40px',
        borderRight: '1px solid rgba(255,255,255,0.08)'
    }}>
        <span style={{ color: 'var(--gold)', fontSize: '16px' }}>{icon}</span>
        {text && <span>{text}</span>}
        <strong style={{ color: 'var(--white)' }}>{highlight}</strong>
        {extra && <span>{extra}</span>}
    </div>
);

export default TickerBar;
