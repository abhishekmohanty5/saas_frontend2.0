import React from 'react';

const HowItWorks = () => {
    return (
        <div id="how-it-works" style={{ background: 'var(--cream)', padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
            {/* Background decoration */}
            <div style={{
                content: '',
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }} className="reveal">
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                    How it works
                </div>
                <h2 style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.5px',
                    color: 'var(--ink)',
                    fontWeight: 400
                }}>
                    Integrated in <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>minutes,</em> not months
                </h2>

                {/* Steps Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '24px',
                    marginTop: '60px',
                    position: 'relative'
                }}>
                    {/* Connecting Line */}
                    <div style={{
                        content: '',
                        position: 'absolute',
                        top: '28px',
                        left: '10%',
                        right: '10%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, var(--stone), var(--stone), transparent)',
                        zIndex: 0
                    }} />

                    <StepCard number="1" title="Register your startup" active>
                        POST <code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', background: 'var(--sand)', padding: '1px 5px', borderRadius: '3px' }}>/api/auth/reg</code> with <code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', background: 'var(--sand)', padding: '1px 5px', borderRadius: '3px' }}>tenantName, userName, email, password</code> → Gets JWT token + auto-generated clientId & clientSecret.
                    </StepCard>

                    <StepCard number="2" title="Open Developer Console">
                        GET <code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', background: 'var(--sand)', padding: '1px 5px', borderRadius: '3px' }}>/api/dashboard</code> → See your plan, API keys, usage stats, and enabled services all in one place.
                    </StepCard>

                    <StepCard number="3" title="Use the APIs">
                        Integrate SubSphere auth & subscription APIs into your own product using your <code style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', background: 'var(--sand)', padding: '1px 5px', borderRadius: '3px' }}>clientId</code> as tenant identifier.
                    </StepCard>

                    <StepCard number="4" title="Engine handles the rest">
                        Expiry auto-runs at 2 AM, reminders go out at 9 AM, usage is counted live per call via Spring interceptor. Zero cron jobs needed.
                    </StepCard>
                </div>
            </div>
        </div>
    );
};

const StepCard = ({ number, title, children, active }) => (
    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: active ? 'var(--ink)' : 'var(--white)',
            border: `1px solid ${active ? 'var(--ink)' : 'var(--sand)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--ff-serif)',
            fontSize: '22px',
            color: active ? 'var(--white)' : 'var(--ink)',
            margin: '0 auto 20px',
            boxShadow: active ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.06)'
        }}>
            {number}
        </div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
            {title}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
            {children}
        </p>
    </div>
);

export default HowItWorks;
