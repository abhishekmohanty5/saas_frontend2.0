import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--ink2)',
            padding: '64px 48px 40px',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Top Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                    gap: '48px',
                    marginBottom: '48px'
                }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{
                            color: 'var(--white)',
                            fontSize: '18px',
                            fontWeight: 700,
                            fontFamily: 'var(--ff-sans)',
                            letterSpacing: '-0.3px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                background: 'var(--gold)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8h4v4H8z" fill="#1A1714" />
                                </svg>
                            </div>
                            SubSphere
                        </div>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, marginTop: '12px', maxWidth: '260px' }}>
                            SaaS subscription infrastructure. Authentication + Lifecycle + Multi-Tenancy.
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: 'var(--emerald2)',
                            marginTop: '20px'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'var(--emerald2)',
                                animation: 'pulse 2s infinite'
                            }} />
                            All systems operational
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '16px', letterSpacing: '0.3px' }}>
                            Product
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <FooterLink to="/#features">Features</FooterLink>
                            <FooterLink to="/pricing">Pricing</FooterLink>
                            <FooterLink to="/#api-docs">API Docs</FooterLink>
                            <FooterLink to="/dashboard">Developer Console</FooterLink>
                        </div>
                    </div>

                    {/* Developers Column */}
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '16px', letterSpacing: '0.3px' }}>
                            Developers
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <FooterLink to="/#api-docs">API Reference</FooterLink>
                            <FooterLink to="/#features">Authentication</FooterLink>
                            <FooterLink to="/#how-it-works">Integration Guide</FooterLink>
                            <FooterLink to="/dashboard">Dashboard</FooterLink>
                        </div>
                    </div>

                    {/* Account Column */}
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '16px', letterSpacing: '0.3px' }}>
                            Account
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <FooterLink to="/login">Sign In</FooterLink>
                            <FooterLink to="/register">Start Free Trial</FooterLink>
                            <FooterLink to="/pricing">View Plans</FooterLink>
                            <FooterLink to="/dashboard">Developer Console</FooterLink>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '32px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.25)',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div>© 2026 SubSphere. All rights reserved. Built on Spring Boot · Secured with JWT.</div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <FooterLink to="/">Privacy</FooterLink>
                        <FooterLink to="/">Terms</FooterLink>
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
                color: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                transition: 'color 0.15s'
            }}
        >
            {children}
        </Link>
    );
};

export default Footer;
