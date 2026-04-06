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
        <section
            id="trust-infra"
            style={{
                background: 'var(--white)',
                padding: '96px 48px 104px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Background Elements */}
            <div style={{
                position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px',
                background: 'rgba(37,99,235,0.03)', filter: 'blur(100px)', borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px',
                background: 'rgba(96,165,250,0.02)', filter: 'blur(120px)', borderRadius: '50%'
            }} />

            <div className="infra-trust-shell">
                <div className="infra-trust-header">
                    <div className="infra-trust-badge">
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--gold)',
                                animation: 'pulse 2s infinite'
                            }}
                        />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gold)', letterSpacing: '1px' }}>
                            CERTIFIED INFRASTRUCTURE
                        </span>
                    </div>

                    <h2 className="infra-trust-title">
                        Enterprise Trust, built for{' '}
                        <em style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--gold2)' }}>
                            Limitless Growth.
                        </em>
                    </h2>

                    <p className="infra-trust-copy">
                        SubSphere isn&apos;t just a dashboard&mdash;it&apos;s a military-grade backend engine engineered for data integrity and global availability.
                    </p>
                </div>

                <div className="infra-trust-grid">
                    <TrustCard
                        label="Infrastructure"
                        title="Two icons join forces to level up your security."
                        icon={<ShieldCheck />}
                        desc="End-to-End AES-256 encryption. Every subscription payload is locked with tenant-specific nodes."
                        accent="#10b981"
                        specs={['SOC2 Type II Ready', 'GDPR Core compliant', 'E2E Encryption']}
                    />

                    <TrustCard
                        label="Performance"
                        title="Powerhouse scaling for your workload."
                        icon={<Zap />}
                        desc="Stateless node-cluster architecture capable of handling 50,000+ API requests every second."
                        accent="#3b82f6"
                        specs={['99.99% Uptime SLA', 'Auto-Scaling Pods', 'Enterprise Backbone']}
                    />

                    <TrustCard
                        label="Reliability"
                        title="Self-healing logic that never sleeps."
                        icon={<RefreshCw />}
                        desc="Automated CRON recovery and failed-transaction auditing ensure zero data leakage across clusters."
                        accent="#a855f7"
                        specs={['Failover Recovery', 'Audit Log ready', 'Instant Webhooks']}
                    />
                </div>

                <div className="infra-trust-certs">
                    {['PCI COMPLIANT', 'ISO 27001', 'SSL SECURED', 'SLA BACKED'].map((cert, i) => (
                        <div
                            key={i}
                            style={{
                                fontSize: '10px',
                                fontWeight: 900,
                                color: 'var(--stone)',
                                letterSpacing: '2px'
                            }}
                        >
                            {cert}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

                .infra-trust-shell {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .infra-trust-header {
                    text-align: center;
                    margin-bottom: 56px;
                }

                .infra-trust-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: var(--gold-dim);
                    border: 1px solid rgba(37, 99, 235, 0.2);
                    margin-bottom: 16px;
                }

                .infra-trust-title {
                    font-size: clamp(36px, 5vw, 52px);
                    font-family: var(--ff-serif);
                    color: var(--ink);
                    line-height: 1.08;
                    letter-spacing: -1.5px;
                    max-width: 980px;
                    margin: 0 auto 16px;
                }

                .infra-trust-copy {
                    font-size: 18px;
                    color: var(--ink);
                    opacity: 0.7;
                    max-width: 760px;
                    margin: 0 auto;
                    line-height: 1.6;
                    font-family: var(--ff-sans);
                }

                .infra-trust-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 24px;
                    align-items: stretch;
                }

                .infra-trust-certs {
                    margin-top: 48px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 8px 32px;
                    opacity: 0.42;
                }

                .infra-trust-card {
                    background: var(--surface);
                    border-radius: 32px;
                    padding: 24px;
                    box-shadow: 0 10px 24px -20px rgba(15, 23, 42, 0.24), inset 0 0 0 1px rgba(15, 23, 42, 0.05);
                    position: relative;
                    transition: transform 200ms ease, box-shadow 200ms ease;
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                    overflow: hidden;
                    cursor: default;
                }

                .infra-trust-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 18px 34px -24px rgba(15, 23, 42, 0.28), inset 0 0 0 1px rgba(15, 23, 42, 0.05);
                }

                .infra-trust-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    flex-shrink: 0;
                }

                .infra-trust-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--muted);
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    margin-bottom: 8px;
                }

                .infra-trust-card-title {
                    font-size: 26px;
                    font-weight: 800;
                    color: var(--theme-text);
                    line-height: 1.15;
                    letter-spacing: -1px;
                    margin: 0 0 16px;
                }

                .infra-trust-card-copy {
                    font-size: 15px;
                    color: var(--muted);
                    line-height: 1.6;
                    font-weight: 500;
                    margin: 0 0 24px;
                }

                .infra-trust-specs {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin: auto 0 0;
                    padding: 0;
                }

                .infra-trust-spec {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--theme-text);
                    font-family: var(--ff-mono);
                }

                .infra-trust-spec-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 999px;
                    flex-shrink: 0;
                }

                @media (max-width: 1024px) {
                    .infra-trust-grid {
                        grid-template-columns: 1fr;
                    }

                    .infra-trust-title {
                        max-width: 800px;
                    }
                }

                @media (max-width: 768px) {
                    #trust-infra {
                        padding: 88px 24px 96px;
                    }

                    .infra-trust-header {
                        margin-bottom: 48px;
                    }

                    .infra-trust-title {
                        margin-bottom: 16px;
                    }

                    .infra-trust-copy {
                        font-size: 17px;
                    }

                    .infra-trust-card {
                        padding: 24px 20px;
                        border-radius: 28px;
                    }

                    .infra-trust-card-title {
                        font-size: 24px;
                    }

                    .infra-trust-certs {
                        margin-top: 40px;
                        gap: 8px 24px;
                    }
                }
            `}</style>
        </section>
    );
};

const TrustCard = ({ label, title, desc, icon, accent, specs }) => {
    return (
        <div className="infra-trust-card">
            <div
                className="infra-trust-icon"
                style={{
                    background: `linear-gradient(135deg, ${accent}20, ${accent}05)`,
                    color: accent
                }}
            >
                {React.cloneElement(icon, { size: 22 })}
            </div>

            <div className="infra-trust-label">{label}</div>

            <h3 className="infra-trust-card-title">{title}</h3>

            <p className="infra-trust-card-copy">{desc}</p>

            <ul className="infra-trust-specs">
                {specs.map((spec, i) => (
                    <li key={i} className="infra-trust-spec">
                        <span className="infra-trust-spec-dot" style={{ background: accent }} />
                        <span>{spec}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InfraTrustSection;
