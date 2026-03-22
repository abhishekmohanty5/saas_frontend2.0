import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: '#020617',
            padding: '100px 48px 40px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Top Glow Divider */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                opacity: 0.5
            }} />

            {/* Subtle Mesh Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.1), transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Top Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '64px',
                    marginBottom: '80px'
                }}>
                    {/* Brand & Stats Column */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{
                            color: '#ffffff',
                            fontSize: '24px',
                            fontWeight: 900,
                            fontFamily: 'var(--ff-sans)',
                            letterSpacing: '-1.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                <img src="/logo.jpg" alt="Aegis Infra" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            Aegis Infra
                        </div>

                        {/* Live Status Console */}
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '16px',
                            maxWidth: '340px',
                            marginBottom: '32px',
                            fontFamily: 'monospace',
                            fontSize: '11px'
                        }}>
                            <div style={{ color: '#0ea5e9', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                <span>AEGIS_ENGINE_V2_4</span>
                                <span style={{ color: '#10b981' }}>● LIVE</span>
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.5 }}>
                                {'>'} CLUSTER: ASIA_EXT_01<br />
                                {'>'} BANDWIDTH: 4.8 GB/S<br />
                                {'>'} LATENCY: 12MS_EST
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <SocialButton type="github" />
                            <SocialButton type="twitter" />
                            <SocialButton type="linkedin" />
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', gridColumn: 'span 3' }}>
                        {/* Product Column */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', marginBottom: '28px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Core Engine
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <FooterLink to="/#features">API Gateway</FooterLink>
                                <FooterLink to="/pricing">Pricing Tiers</FooterLink>
                                <FooterLink to="/#api-docs">SDK Resources</FooterLink>
                                <FooterLink to="/dashboard">Admin Console</FooterLink>
                            </nav>
                        </div>

                        {/* Company Column */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', marginBottom: '28px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Infrastructure
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <FooterLink to="/">Edge Nodes</FooterLink>
                                <FooterLink to="/">Global Status</FooterLink>
                                <FooterLink to="/">Mesh Security</FooterLink>
                                <FooterLink to="/">Compliance</FooterLink>
                            </nav>
                        </div>

                        {/* Support Column */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', marginBottom: '28px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Support
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <FooterLink to="/login">Documentation</FooterLink>
                                <FooterLink to="/register">Developer API</FooterLink>
                                <FooterLink to="/dashboard">Ticketing</FooterLink>
                                <FooterLink to="/">Community</FooterLink>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '40px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}>
                    <div style={{ fontWeight: 400, letterSpacing: '0.3px' }}>
                        © 2026 Aegis Infra. Unified SaaS Engine. <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>| All Data Encrypted AES-256</span>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', fontWeight: 500 }}>
                        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}>Privacy Artifacts</button>
                        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}>End-User Terms</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <Link
            to={to}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                fontSize: '14px',
                color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transform: isHovered ? 'translateX(6px)' : 'none'
            }}
        >
            {isHovered && <div style={{ width: '4px', height: '1px', background: '#3b82f6' }} />}
            {children}
        </Link>
    );
};

const SocialButton = ({ type }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isHovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: isHovered ? '#3b82f6' : 'rgba(255, 255, 255, 0.6)'
            }}
        >
            {type === 'github' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>}
            {type === 'twitter' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2.17-2 2.51c0 0 0 .01 0 0 1 1 2 4 2 4s-1-.01-1 0c0 0-1.5-1.5-2-2 0 0-1 4-1 4s-1-2-1-2c0 0-2 2-3 2 0 0 1-5 1-5s-2 1-3 1c0 0 0-5 0-5s2 1 3 1c0 0 1-4 1-4s2 2 3 2"></path><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>}
            {type === 'linkedin' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>}
        </button>
    );
};

export default Footer;
