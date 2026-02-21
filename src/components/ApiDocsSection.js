import React, { useState } from 'react';

const ENDPOINTS = [
    { method: 'POST', path: '/api/auth/reg', badge: 'PUBLIC', desc: 'Register a new startup — returns JWT token + clientId & clientSecret' },
    { method: 'POST', path: '/api/auth/log', badge: 'PUBLIC', desc: 'Login with email & password — returns JWT Bearer token' },
    { method: 'GET', path: '/api/public', badge: 'PUBLIC', desc: 'Get all available subscription plans — no auth required' },
    { method: 'GET', path: '/api/dashboard', badge: 'AUTH', desc: 'Get full developer console data — plan, keys, usage, services' },
    { method: 'POST', path: '/api/subscriptions/subscribe/{planId}', badge: 'AUTH', desc: 'Subscribe to a plan by planId — subscription goes ACTIVE immediately' },
    { method: 'PUT', path: '/api/subscriptions/cancel', badge: 'AUTH', desc: 'Cancel current plan subscription' },
    { method: 'GET', path: '/api/user-Subscriptions/stats', badge: 'AUTH', desc: 'Get reference module subscription statistics' },
    { method: 'GET', path: '/api/user-Subscriptions/upcoming', badge: 'AUTH', desc: 'Get upcoming renewals within configurable days window' },
    { method: 'POST', path: '/api/admin/plan', badge: 'ADMIN', desc: 'Create a new subscription plan — ADMIN role required' },
];

const BADGE_COLORS = {
    PUBLIC: { bg: 'rgba(64,145,108,0.12)', color: '#40916C', border: 'rgba(64,145,108,0.2)' },
    AUTH: { bg: 'rgba(87,135,255,0.12)', color: '#5887FF', border: 'rgba(87,135,255,0.2)' },
    ADMIN: { bg: 'rgba(181,70,58,0.12)', color: '#B5463A', border: 'rgba(181,70,58,0.2)' },
};

const METHOD_COLORS = {
    GET: '#40916C',
    POST: '#5887FF',
    PUT: '#C9A84C',
    DELETE: '#B5463A',
};

const ApiDocsSection = () => {
    const [activeEndpoint, setActiveEndpoint] = useState(0);

    return (
        <div id="api-docs" style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto' }} className="reveal">
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                API Reference
            </div>
            <h2 style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                color: 'var(--ink)',
                fontWeight: 400,
                maxWidth: '680px'
            }}>
                Every endpoint, <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>documented</em>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '560px', marginTop: '20px' }}>
                All endpoints return the same <code style={{ fontFamily: 'var(--ff-mono)', fontSize: '14px', background: 'var(--cream)', padding: '2px 6px', borderRadius: '4px' }}>AppResponse&lt;T&gt;</code> shape. Register once, integrate anywhere.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '56px' }}>
                {/* Endpoint List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ENDPOINTS.map((ep, i) => {
                        const badge = BADGE_COLORS[ep.badge];
                        const isActive = activeEndpoint === i;
                        return (
                            <div
                                key={i}
                                onClick={() => setActiveEndpoint(i)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: `1px solid ${isActive ? 'var(--stone)' : 'var(--sand)'}`,
                                    background: isActive ? 'var(--cream)' : 'var(--white)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <span style={{
                                    fontFamily: 'var(--ff-mono)',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: METHOD_COLORS[ep.method] || 'var(--ink)',
                                    minWidth: '36px',
                                    marginTop: '1px'
                                }}>
                                    {ep.method}
                                </span>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{
                                        fontFamily: 'var(--ff-mono)',
                                        fontSize: '12px',
                                        color: 'var(--ink)',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {ep.path}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '3px' }}>
                                        {ep.desc}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    borderRadius: '20px',
                                    background: badge.bg,
                                    color: badge.color,
                                    border: `1px solid ${badge.border}`,
                                    flexShrink: 0,
                                    marginTop: '1px'
                                }}>
                                    {ep.badge}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Code Preview */}
                <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
                    <div style={{
                        background: 'var(--ink)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                    }}>
                        {/* Code header */}
                        <div style={{
                            background: 'var(--ink2)',
                            padding: '14px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)'
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28ca41' }} />
                            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--ff-mono)' }}>
                                POST /api/auth/reg → 200 OK
                            </span>
                        </div>
                        {/* Code body */}
                        <div style={{ padding: '24px', fontFamily: 'var(--ff-mono)', fontSize: '13px', lineHeight: 1.9 }}>
                            <div style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{'// Register Response — AppResponse<AuthDto>'}</div>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{'{'}</span><br />
                            &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"message"</span>: <span style={{ color: '#9DE070' }}>"Success"</span>,<br />
                            &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"data"</span>: {'{'}<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"email"</span>: <span style={{ color: '#9DE070' }}>"founder@startup.com"</span>,<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"token"</span>: <span style={{ color: '#9DE070' }}>"eyJhbGci..."</span><br />
                            &nbsp;&nbsp;{'}'},<br />
                            &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"status"</span>: <span style={{ color: '#F0B070' }}>200</span>,<br />
                            &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"timestamp"</span>: <span style={{ color: '#9DE070' }}>"2026-02-20T09:30:00"</span><br />
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{'}'}</span>
                        </div>

                        {/* Badge legend */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}>
                            {Object.entries(BADGE_COLORS).map(([key, val]) => (
                                <span key={key} style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    background: val.bg,
                                    color: val.color,
                                    border: `1px solid ${val.border}`
                                }}>
                                    {key}
                                </span>
                            ))}
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
                                — access level
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocsSection;
