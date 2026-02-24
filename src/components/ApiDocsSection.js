import React, { useState, useEffect } from 'react';

/**
 * API DOCS SECTION
 * Optimized style with interactive cards and live JSON editor
 */

const ApiDocsSection = () => {
    const [selectedEndpoint, setSelectedEndpoint] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const endpoints = [
        {
            method: 'POST',
            path: '/api/auth/reg',
            desc: 'Register a new startup — returns JWT token + client credentials',
            badge: 'PUBLIC',
            response: `{
  "message": "Success",
  "data": {
    "email": "startup@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "clientId": "client_abc123",
    "clientSecret": "sec_xyz789"
  },
  "status": 201
}`
        },
        {
            method: 'POST',
            path: '/api/auth/log',
            desc: 'Login with email & password — returns JWT Bearer token',
            badge: 'PUBLIC',
            response: `{
  "message": "Authenticated",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "expiresIn": 3600,
    "role": "ADMIN"
  },
  "status": 200
}`
        },
        {
            method: 'GET',
            path: '/api/public/plans',
            desc: 'Get all available subscription plans — no auth required',
            badge: 'PUBLIC',
            response: `{
  "message": "Plans retrieved",
  "data": [
    { "id": 1, "name": "FREE", "price": 0 },
    { "id": 2, "name": "PRO", "price": 29.99 }
  ],
  "status": 200
}`
        },
        {
            method: 'GET',
            path: '/api/dashboard',
            desc: 'Get full developer console data — plan, keys, usage',
            badge: 'AUTH',
            response: `{
  "message": "Dashboard data",
  "data": {
    "usage": 4821,
    "limit": 20000,
    "activeKeys": 2
  },
  "status": 200
}`
        },
        {
            method: 'POST',
            path: '/api/subscribe/{id}',
            desc: 'Subscribe to a plan — subscription goes ACTIVE immediately',
            badge: 'AUTH',
            response: `{
  "message": "Subscription activated",
  "data": {
    "subscriptionId": "sub_88291",
    "status": "ACTIVE",
    "expiry": "2026-03-23"
  },
  "status": 201
}`
        }
    ];

    // Mouse tilt effect logic
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 10, y: y * -10 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    // Live Typing Logic
    useEffect(() => {
        let currentText = "";
        const targetText = endpoints[selectedEndpoint].response;
        setDisplayText("");

        let i = 0;
        const interval = setInterval(() => {
            if (i < targetText.length) {
                currentText += targetText.charAt(i);
                setDisplayText(currentText);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 8); // Fast typing speed

        return () => clearInterval(interval);
    }, [selectedEndpoint]);

    return (
        <section id="api-reference" style={{
            background: 'var(--white)',
            padding: '120px 48px',
            fontFamily: 'var(--ff-sans)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), transparent)'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '64px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                        API REFERENCE
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(40px, 5vw, 56px)',
                        fontFamily: 'var(--ff-serif)',
                        color: 'var(--ink)',
                        lineHeight: 1.1,
                        letterSpacing: '-2px',
                        fontWeight: 400
                    }}>
                        Every endpoint, <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>documented.</em>
                    </h2>
                    <p style={{
                        fontSize: '18px', color: 'var(--muted)', marginTop: '20px', maxWidth: '600px', lineHeight: 1.6
                    }}>
                        All endpoints return the same <code style={{ background: 'rgba(37,99,235,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ink)', fontSize: '14px' }}>AppResponse&lt;T&gt;</code> shape.
                        Register once, integrate anywhere.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr', gap: '60px', alignItems: 'start' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {endpoints.map((ep, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedEndpoint(i)}
                                style={{
                                    padding: '20px 24px',
                                    borderRadius: '16px',
                                    background: selectedEndpoint === i ? 'var(--white)' : 'transparent',
                                    border: '1px solid',
                                    borderColor: selectedEndpoint === i ? 'rgba(37,99,235,0.3)' : 'rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    boxShadow: selectedEndpoint === i ? '0 10px 30px -5px rgba(37,99,235,0.15)' : 'none',
                                    transform: selectedEndpoint === i ? 'translateX(10px)' : 'translateX(0)',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    fontSize: '10px', fontWeight: 900, color: ep.method === 'POST' ? '#3B82F6' : '#10B981',
                                    padding: '4px 8px', borderRadius: '6px', background: ep.method === 'POST' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                                    minWidth: '45px', textAlign: 'center'
                                }}>
                                    {ep.method}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' }}>{ep.path}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--stone)', marginTop: '4px', opacity: 0.8 }}>{ep.desc}</div>
                                </div>
                                <div style={{
                                    fontSize: '9px', fontWeight: 800, color: ep.badge === 'PUBLIC' ? '#10B981' : '#F59E0B',
                                    letterSpacing: '1px', padding: '4px 10px', borderRadius: '100px',
                                    background: ep.badge === 'PUBLIC' ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)',
                                    border: `1px solid ${ep.badge === 'PUBLIC' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                                }}>
                                    {ep.badge}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            perspective: '1000px',
                            position: 'sticky',
                            top: '100px'
                        }}
                    >
                        <div style={{
                            background: '#0D0D0D',
                            borderRadius: '24px',
                            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.08)',
                            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                            transition: 'transform 0.1s ease-out',
                            transformStyle: 'preserve-3d'
                        }}>
                            <div style={{
                                padding: '16px 24px',
                                background: 'rgba(255,255,255,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid rgba(255,255,255,0.06)'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }} />
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--ff-mono)', letterSpacing: '1px', fontWeight: 600 }}>
                                    LIVE_RESPONSE.JSON
                                </div>
                            </div>

                            <div style={{
                                padding: '32px',
                                minHeight: '400px',
                                position: 'relative',
                                transform: 'translateZ(30px)'
                            }}>
                                <pre style={{
                                    margin: 0,
                                    fontFamily: 'var(--ff-mono)',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                    color: '#E2E8F0',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {formatJson(displayText)}
                                </pre>
                            </div>

                            <div style={{
                                padding: '12px 32px',
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderTop: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{
                                    width: '6px', height: '6px', background: '#10B981', borderRadius: '50%',
                                    boxShadow: '0 0 8px #10B981'
                                }} />
                                <span style={{ fontSize: '11px', color: '#10B981', fontFamily: 'var(--ff-mono)', letterSpacing: '1.5px', fontWeight: 700 }}>
                                    AEGIS_STREAMING: ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const formatJson = (json) => {
    return json.split('\n').map((line, i) => {
        const parts = line.split(':');
        if (parts.length > 1) {
            const key = parts[0];
            const val = parts.slice(1).join(':');
            return (
                <div key={i} style={{ display: 'flex' }}>
                    <span style={{ width: '32px', color: 'rgba(255,255,255,0.1)', userSelect: 'none', textAlign: 'right', paddingRight: '12px' }}>{i + 1}</span>
                    <span style={{ color: '#94A3B8' }}>{key}:</span>
                    <span style={{ color: val.includes('"') ? '#A78BFA' : '#F59E0B' }}>{val}</span>
                </div>
            );
        }
        return (
            <div key={i} style={{ display: 'flex' }}>
                <span style={{ width: '32px', color: 'rgba(255,255,255,0.1)', userSelect: 'none', textAlign: 'right', paddingRight: '12px' }}>{i + 1}</span>
                <span style={{ color: '#94A3B8' }}>{line}</span>
            </div>
        );
    });
};

export default ApiDocsSection;
