import React from 'react';

const BentoFeatures = () => {
    return (
        <div id="features" style={{ padding: '100px 48px', maxWidth: '1280px', margin: '0 auto' }} className="reveal">
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                Platform Features
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
                Built for the full subscription <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>lifecycle</em>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '560px', marginTop: '20px' }}>
                Real backend architecture — JWT auth, multi-tenancy, automated scheduling, and a reference module that proves engine integration.
            </p>

            {/* Bento Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '16px',
                marginTop: '56px'
            }}>
                {/* Card 1 - JWT Auth (7 cols) */}
                <BentoCard span={7} dark>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                        🔐
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        Authentication Engine
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--white)', lineHeight: 1.3, fontWeight: 400 }}>
                        JWT-secured with HS256 signing
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '10px' }}>
                        Every request carries a Bearer token. The JWT payload includes <code style={{ fontFamily: 'var(--ff-mono)', color: 'var(--gold2)' }}>tenantId</code> — so every API call is automatically isolated to the correct startup. Tokens expire per config and return clean 401 responses.
                    </p>
                    <JWTVisual />
                </BentoCard>

                {/* Card 2 - Multi-Tenancy (5 cols) */}
                <BentoCard span={5} goldBg>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                        🏢
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        Multi-Tenant Architecture
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--white)', lineHeight: 1.3, fontWeight: 400 }}>
                        Complete data isolation per startup
                    </h3>
                    <MiniTenants />
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '12px' }}>
                        Each startup gets unique Client ID & Secret. All engine services filter by tenantId — startups can never see each other's data.
                    </p>
                </BentoCard>

                {/* Card 3 - Scheduler (4 cols) */}
                <BentoCard span={4}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(44,111,172,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                        ⏰
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        Automated Lifecycle
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--ink)', lineHeight: 1.3, fontWeight: 400 }}>
                        Auto-expire at 2 AM · Remind at 9 AM
                    </h3>
                    <SchedulerTimeline />
                </BentoCard>

                {/* Card 4 - Reference Module (4 cols) */}
                <BentoCard span={4}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(64,145,108,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                        🔄
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        Reference Module
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--ink)', lineHeight: 1.3, fontWeight: 400 }}>
                        Subscription management — proof it works
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '10px' }}>
                        A real working subscription manager is built using SubSphere APIs — add, cancel, update, filter by category, view upcoming renewals. This proves engine integration.
                    </p>
                </BentoCard>

                {/* Card 5 - API Usage (4 cols) */}
                <BentoCard span={4} dark>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        API Usage Tracking
                    </div>
                    <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '64px', color: 'var(--white)', lineHeight: 1, letterSpacing: '-2px', marginTop: '16px' }}>
                        ∞<span style={{ color: 'var(--gold)' }}>+</span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '10px' }}>
                        Every non-auth API call is counted per tenant in real-time via Spring interceptor. See your usage live in the Developer Console at <code style={{ fontFamily: 'var(--ff-mono)', color: 'var(--gold2)' }}>/api/dashboard</code>
                    </p>
                </BentoCard>

                {/* Card 6 - API Response (8 cols) */}
                <BentoCard span={8}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                        📡
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        Unified Response Format
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--ink)', lineHeight: 1.3, fontWeight: 400 }}>
                        Every endpoint speaks the same language
                    </h3>
                    <APIResponse />
                </BentoCard>

                {/* Card 7 - Access Control (4 cols) */}
                <BentoCard span={4}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(181,70,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                        🛡️
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '10px' }}>
                        Role-Based Access
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--ink)', lineHeight: 1.3, fontWeight: 400 }}>
                        USER and ADMIN roles enforced
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '10px' }}>
                        Admin endpoints (<code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px' }}>/api/admin/plan</code>) are locked to ADMIN role. Developer Console (<code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px' }}>/api/dashboard</code>) requires any authenticated user. Public plans (<code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px' }}>/api/public</code>) need no auth.
                    </p>
                </BentoCard>
            </div>
        </div>
    );
};

const BentoCard = ({ children, span, dark, goldBg }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const baseStyle = {
        gridColumn: `span ${span}`,
        background: dark ? 'var(--ink)' : goldBg ? 'linear-gradient(135deg, #3D2F0E 0%, #1A1410 100%)' : 'var(--cream)',
        border: dark ? '1px solid var(--ink2)' : goldBg ? '1px solid rgba(201,168,76,0.2)' : '1px solid var(--sand)',
        borderRadius: 'var(--r2)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
        color: dark || goldBg ? 'var(--white)' : 'var(--ink)'
    };

    const hoverStyle = isHovered ? {
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)',
        borderColor: dark ? 'var(--ink3)' : goldBg ? 'rgba(201,168,76,0.3)' : 'var(--stone)'
    } : {};

    return (
        <div
            style={{ ...baseStyle, ...hoverStyle }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </div>
    );
};

const JWTVisual = () => (
    <div style={{ marginTop: '20px', fontFamily: 'var(--ff-mono)', fontSize: '12px', background: 'var(--ink2)', borderRadius: 'var(--r)', padding: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#56B4F5', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Header · HS256</span>
        </div>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', paddingLeft: '16px', wordBreak: 'break-all' }}>
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9DE070', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Payload</span>
        </div>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px', paddingLeft: '16px' }}>
            {`{ "tenantId": 1, "sub": "founder@startup.com" }`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Signature · HS256</span>
        </div>
    </div>
);

const MiniTenants = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        <MiniTenant label="Tenant A" secret="sb_a1b2c3..." />
        <MiniTenant label="Tenant B" secret="sb_x9y8z7..." />
        <MiniTenant label="Tenant C" secret="sb_p3q2r1..." />
    </div>
);

const MiniTenant = ({ label, secret }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--r)',
        padding: '10px 14px'
    }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', color: 'var(--gold2)' }}>{secret}</span>
    </div>
);

const SchedulerTimeline = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: '16px', position: 'relative' }}>
        <div style={{
            content: '',
            position: 'absolute',
            left: '15px',
            top: '16px',
            bottom: '16px',
            width: '1px',
            background: 'var(--sand)'
        }} />
        <SchedItem time="2AM" title="Expire subscriptions" sub="STATUS → EXPIRED" bg="var(--ink)" />
        <SchedItem time="9AM" title="Send reminders" sub="3-day notice emails" bg="var(--gold)" />
    </div>
);

const SchedItem = ({ time, title, sub, bg }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '10px 0', position: 'relative' }}>
        <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: 700,
            flexShrink: 0,
            zIndex: 1,
            background: bg,
            color: bg === 'var(--gold)' ? 'var(--ink)' : 'white'
        }}>
            {time}
        </div>
        <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{sub}</div>
        </div>
    </div>
);

const APIResponse = () => (
    <div style={{ marginTop: '16px', background: 'var(--ink)', borderRadius: 'var(--r)', padding: '16px', fontFamily: 'var(--ff-mono)', fontSize: '12px', lineHeight: 1.8, overflowX: 'auto' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'// AppResponse<T>'}</span><br />
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{'{'}</span><br />
        &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"message"</span>: <span style={{ color: '#9DE070' }}>"Success"</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"data"</span>: <span style={{ color: 'rgba(255,255,255,0.5)' }}>{'{ ... }'}</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"status"</span>: <span style={{ color: '#F0B070' }}>201</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#7BAFDE' }}>"timestamp"</span>: <span style={{ color: '#9DE070' }}>"2026-02-20T09:30:00"</span><br />
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{'}'}</span>
    </div>
);

export default BentoFeatures;
