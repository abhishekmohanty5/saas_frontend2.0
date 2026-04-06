import React from 'react';
import {
  ShieldCheck,
  Zap,
  RefreshCw,
} from 'lucide-react';

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
                        Enterprise Trust, built for <em style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--gold2)' }}>Limitless Growth.</em>
                    </h2>

                    <p style={{ fontSize: '18px', color: 'var(--ink)', opacity: 0.7, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontFamily: 'var(--ff-sans)' }}>
                        SubSphere isn't just a dashboard—it's a military-grade backend engine engineered for data integrity and global availability.
                    </p>
                </div>

                {/* Trust Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px' }}>

                    {/* Security Pillar */}
                    <TrustCard
                        label="Infrastructure"
                        title="Two icons join forces to level up your security."
                        icon={<ShieldCheck />}
                        desc="End-to-End AES-256 encryption. Every subscription payload is locked with tenant-specific nodes."
                        accent="#10b981"
                        specs={['SOC2 Type II Ready', 'GDPR Core compliant', 'E2E Encryption']}
                    />

                    {/* Scale Pillar */}
                    <TrustCard
                        label="Performance"
                        title="Powerhouse scaling for your workload."
                        icon={<Zap />}
                        desc="Stateless node-cluster architecture capable of handling 50,000+ API requests every second."
                        accent="#3b82f6"
                        specs={['99.99% Uptime SLA', 'Auto-Scaling Pods', 'Enterprise Backbone']}
                    />

                    {/* Resilience Pillar */}
                    <TrustCard
                        label="Reliability"
                        title="Self-healing logic that never sleeps."
                        icon={<RefreshCw />}
                        desc="Automated CRON recovery and failed-transaction auditing ensure zero data leakage across clusters."
                        accent="#a855f7"
                        specs={['Failover Recovery', 'Audit Log ready', 'Instant Webhooks']}
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

const TrustCard = ({ label, title, desc, icon, accent, specs }) => {
    return (
        <div style={{
            background: 'var(--surface)',
            borderRadius: '40px',
            padding: '40px',
            boxShadow: `0 20px 60px -15px var(--shadow-sm), inset 0 0 0 1px var(--glass-border)`,
            position: 'relative',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            cursor: 'default'
        }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 40px 100px -20px var(--shadow-lg), 0 0 0 1px ${accent}25`;
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 20px 60px -15px var(--shadow-sm), inset 0 0 0 1px var(--glass-border)`;
            }}
        >
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${accent}20, ${accent}05)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: accent,
                boxShadow: `0 10px 20px ${accent}15`,
                marginBottom: '28px'
            }}>
                {React.cloneElement(icon, { size: 24 })}
            </div>

            <div style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                marginBottom: '12px'
            }}>
                {label}
            </div>

            <h3 style={{
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--theme-text)',
                lineHeight: 1.15,
                letterSpacing: '-1.2px',
                marginBottom: '20px'
            }}>
                {title}
            </h3>

            <p style={{
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: 1.6,
                fontWeight: 500,
                marginBottom: '32px'
            }}>
                {desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'auto' }}>
                {specs.map((spec, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--theme-text)',
                        fontFamily: 'var(--ff-mono)'
                    }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />
                        {spec}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfraTrustSection;
