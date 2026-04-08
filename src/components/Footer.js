import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--surface)',
            padding: '40px 48px 24px', // Reduced height
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
            {/* Subtle Top Glow Divider */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '15%',
                right: '15%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
                opacity: 0.5
            }} />

            {/* Frosty Glow Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.05), transparent 60%)',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                
                {/* Main Content Area: Shorter and more focused */}
                <div className="footer-main-grid" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '40px',
                    marginBottom: '32px'
                }}>
                    {/* Left: Brand and Project Info */}
                    <div style={{ maxWidth: '340px' }}>
                        <div style={{
                            color: 'var(--ink)',
                            fontSize: '18px',
                            fontWeight: 700,
                            fontFamily: 'var(--ff-sans)',
                            letterSpacing: '-0.3px',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px'
                        }}>
                            Aegis <span style={{ color: '#3b82f6', marginLeft: '4px' }}>I</span>nfra
                        </div>
                        
                        <p style={{
                            color: 'var(--muted)',
                            fontSize: '14px',
                            lineHeight: 1.45,
                            marginBottom: '16px',
                            opacity: 0.8
                        }}>
                            The unified spatial engine empowering the next generation of serverless SaaS platforms. 
                            We engineer high-velocity edge environments, advanced auth protocols, and zero-latency persistent data storage.
                        </p>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <SocialButton type="github" />
                            <SocialButton type="twitter" />
                            <SocialButton type="linkedin" />
                        </div>
                    </div>

                    {/* Right: Condensed Essential Links */}
                    <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
                        {/* Column 1 */}
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.7 }}>
                                Platform
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <FooterLink to="/#features">Spatial Engine</FooterLink>
                                <FooterLink to="/pricing">Compute Tiers</FooterLink>
                                <FooterLink to="/#api-docs">API References</FooterLink>
                            </nav>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.7 }}>
                                Resources
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <FooterLink to="/">Global Status</FooterLink>
                                <FooterLink to="/login">Client Console</FooterLink>
                                <FooterLink to="/">Documentation</FooterLink>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Clean, Apple-like footer bar */}
                <div className="footer-bottom-bar" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '12px',
                    color: 'var(--muted)',
                    opacity: 0.7,
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>© {new Date().getFullYear()} Aegis Infrastructure Inc.</span>
                        <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)' }} />
                            <span>All systems operational</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span className="footer-bottom-link">Terms of Service</span>
                        <span className="footer-bottom-link">Privacy Policy</span>
                        <style>{`
                            .footer-bottom-link {
                                cursor: pointer;
                                transition: color 0.2s, opacity 0.2s;
                            }
                            .footer-bottom-link:hover {
                                color: var(--ink);
                                opacity: 1;
                            }
                            @media (max-width: 860px) {
                                .footer-main-grid { flex-direction: column !important; gap: 40px !important; }
                                .footer-bottom-bar { flex-direction: column !important; align-items: flex-start !important; }
                            }
                        `}</style>
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
                fontSize: '13px',
                color: isHovered ? 'var(--ink)' : 'var(--muted)',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            <span style={{ 
                color: '#3b82f6', 
                opacity: isHovered ? 1 : 0, 
                transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                transition: 'all 0.15s ease'
            }}>›</span>
            <span style={{ transform: isHovered ? 'translateX(2px)' : 'translateX(-4px)', transition: 'transform 0.15s ease' }}>
                {children}
            </span>
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
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                color: isHovered ? 'var(--ink)' : 'var(--muted)',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
        >
            {type === 'github' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>}
            {type === 'twitter' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2.17-2 2.51c0 0 0 .01 0 0 1 1 2 4 2 4s-1-.01-1 0c0 0-1.5-1.5-2-2 0 0-1 4-1 4s-1-2-1-2c0 0-2 2-3 2 0 0 1-5 1-5s-2 1-3 1c0 0 0-5 0-5s2 1 3 1c0 0 1-4 1-4s2 2 3 2"></path><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>}
            {type === 'linkedin' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>}
        </button>
    );
};

export default Footer;
