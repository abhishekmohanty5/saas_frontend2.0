import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--surface)',
            padding: '60px 48px 30px', // Reduced height
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid var(--border)'
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
                <div style={{
                    display: 'flex',
                    flexDirection: window.innerWidth > 768 ? 'row' : 'column',
                    justifyContent: 'space-between',
                    gap: '48px',
                    marginBottom: '48px'
                }}>
                    {/* Left: Brand and Project Info */}
                    <div style={{ maxWidth: '400px' }}>
                        <div style={{
                            color: 'var(--ink)',
                            fontSize: '20px',
                            fontWeight: 800,
                            fontFamily: 'var(--ff-sans)',
                            letterSpacing: '-0.3px',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            Aegis <span style={{ color: '#3b82f6', marginLeft: '4px' }}>I</span>nfra
                        </div>
                        
                        <p style={{
                            color: 'var(--muted)',
                            fontSize: '15px',
                            lineHeight: 1.6,
                            marginBottom: '24px'
                        }}>
                            The unified spatial engine empowering the next generation of serverless SaaS platforms. 
                            We engineer high-velocity edge environments, advanced auth protocols, and zero-latency persistent data storage.
                        </p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <SocialButton type="github" />
                            <SocialButton type="twitter" />
                            <SocialButton type="linkedin" />
                        </div>
                    </div>

                    {/* Right: Condensed Essential Links */}
                    <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
                        {/* Column 1 */}
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '0.5px' }}>
                                Platform
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <FooterLink to="/#features">Spatial Engine</FooterLink>
                                <FooterLink to="/pricing">Compute Tiers</FooterLink>
                                <FooterLink to="/#api-docs">API References</FooterLink>
                            </nav>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '0.5px' }}>
                                Resources
                            </div>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <FooterLink to="/">Global Status</FooterLink>
                                <FooterLink to="/login">Client Console</FooterLink>
                                <FooterLink to="/">Documentation</FooterLink>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Clean, Apple-like footer bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '13px',
                    color: 'var(--muted)',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>© {new Date().getFullYear()} Aegis Infrastructure Inc.</span>
                        <span style={{ color: 'var(--border)' }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
                            <span>All systems operational</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <span className="footer-bottom-link">Terms of Service</span>
                        <span className="footer-bottom-link">Privacy Policy</span>
                        <style>{`
                            .footer-bottom-link {
                                cursor: pointer;
                                transition: color 0.2s;
                            }
                            .footer-bottom-link:hover {
                                color: var(--ink);
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
                fontSize: '13.5px',
                color: isHovered ? 'var(--ink)' : 'var(--muted)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            <span style={{ 
                color: '#3b82f6', 
                opacity: isHovered ? 1 : 0, 
                transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.2s ease'
            }}>›</span>
            <span style={{ transform: isHovered ? 'translateX(2px)' : 'translateX(-8px)', transition: 'all 0.2s ease' }}>
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
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: isHovered ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isHovered ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isHovered ? '#3b82f6' : '#94A3B8'
            }}
        >
            {type === 'github' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>}
            {type === 'twitter' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2.17-2 2.51c0 0 0 .01 0 0 1 1 2 4 2 4s-1-.01-1 0c0 0-1.5-1.5-2-2 0 0-1 4-1 4s-1-2-1-2c0 0-2 2-3 2 0 0 1-5 1-5s-2 1-3 1c0 0 0-5 0-5s2 1 3 1c0 0 1-4 1-4s2 2 3 2"></path><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>}
            {type === 'linkedin' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>}
        </button>
    );
};

export default Footer;
