import React from 'react';

/**
 * INFRA TRUST SECTION
 * Replaces the pricing section with a high-fidelity "Engineering Trust" showcase.
 * Focuses on security, scale, and global infrastructure.
 */

const InfraTrustSection = () => {
    return (
        <section id="trust-infra" style={{
            background: 'var(--white)',
            padding: '140px 48px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Background Elements */}
            <div style={{
                position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px',
                background: 'rgba(37,99,235,0.03)', filter: 'blur(100px)', borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px',
                background: 'rgba(96,165,250,0.02)', filter: 'blur(120px)', borderRadius: '50%'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Header Area */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 16px', borderRadius: '100px', background: 'var(--gold-dim)',
                        border: '1px solid rgba(37,99,235,0.2)', marginBottom: '24px'
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gold)', letterSpacing: '1px' }}>CERTIFIED INFRASTRUCTURE</span>
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(36px, 5vw, 52px)', fontFamily: 'var(--ff-serif)', color: 'var(--ink)',
                        lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: '800px', margin: '0 auto 24px'
                    }}>
                        Enterprise Trust, built for <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Limitless Growth.</em>
                    </h2>

                    <p style={{ fontSize: '17px', color: 'var(--stone)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        SubSphere isn't just a dashboard—it's a military-grade backend engine engineered for data integrity and global availability.
                    </p>
                </div>

                {/* Trust Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

                    {/* Security Pillar */}
                    <TrustCard
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>}
                        title="Zero-Trust Security"
                        desc="End-to-End AES-256 encryption for every subscription payload and tenant data block."
                        accent="#2DD4BF"
                        specs={['SOC2 Type II Ready', 'GDPR Compliant', 'E2E Encryption']}
                    />

                    {/* Scale Pillar */}
                    <TrustCard
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>}
                        title="Hyper-Scale Core"
                        desc="Stateless node-cluster architecture capable of handling 50,000+ API requests per second."
                        accent="#2563EB"
                        specs={['99.99% Uptime SLA', 'Auto-Scaling Pods', 'Multi-Region Support']}
                    />

                    {/* Resilience Pillar */}
                    <TrustCard
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
                        title="Self-Healing Logic"
                        desc="Automated CRON recovery and failed-transaction auditing ensure no revenue is ever lost."
                        accent="#A78BFA"
                        specs={['Cron Failure Recovery', 'Audit Logging', 'Webhook Retries']}
                    />

                </div>

                {/* Footer Certs */}
                <div style={{
                    marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px', opacity: 0.5
                }}>
                    {['PCI COMPLIANT', 'ISO 27001', 'SSL SECURED', 'SLA BACKED'].map((cert, i) => (
                        <div key={i} style={{ fontSize: '10px', fontWeight: 900, color: 'var(--stone)', letterSpacing: '2.5px' }}>{cert}</div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
        </section>
    );
};

const TrustCard = ({ icon, title, desc, accent, specs }) => {
    return (
        <div style={{
            background: '#0D0D12',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(0,0,0,0.05)',
            position: 'relative',
            transition: '0.4s cubic-bezier(0.23, 1, 0.32, 1)',
            backdropFilter: 'blur(20px)'
        }}
            onMouseOver={e => e.currentTarget.style.borderColor = `${accent}44`}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
        >
            <div style={{
                width: '50px', height: '50px', borderRadius: '12px', background: `${accent}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
                marginBottom: '24px'
            }}>
                {icon}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F1F5F9', marginBottom: '16px' }}>{title}</h3>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>{desc}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {specs.map((spec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94A3B8' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: accent }} />
                        {spec}
                    </div>
                ))}
            </div>

            {/* Corner Decorative Accent */}
            <div style={{
                position: 'absolute', top: 0, right: 0, width: '40px', height: '40px',
                background: `linear-gradient(225deg, ${accent}33, transparent 100%)`,
                borderRadius: '0 24px 0 0'
            }} />
        </div>
    );
};

export default InfraTrustSection;
