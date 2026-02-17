import React from 'react';

const TickerBar = () => {
    const features = [
        { icon: '⚡', text: 'JWT Auth', highlight: 'with 30-min expiry' },
        { icon: '🔄', text: 'Auto', highlight: 'renewal reminders', extra: 'at 9 AM daily' },
        { icon: '📋', text: '', highlight: '3 flexible plans', extra: '— Basic, Pro, Enterprise' },
        { icon: '🛡️', text: '', highlight: 'Role-based access', extra: '— USER & ADMIN' },
        { icon: '🕐', text: 'Subscriptions', highlight: 'auto-expire', extra: 'at 2 AM' },
        { icon: '📊', text: '', highlight: 'Admin dashboard', extra: 'with live stats' },
        { icon: '🗄️', text: '', highlight: 'MySQL', extra: '+ Spring JPA backend' },
        { icon: '✉️', text: '', highlight: 'Email notifications', extra: 'built in' }
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
