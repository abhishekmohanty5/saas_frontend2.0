import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else navigate('/');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            padding: '0 48px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(250,250,248,0.92)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderBottom: '1px solid rgba(36,32,27,0.08)',
            transition: 'background 0.3s'
        }}>
            {/* Logo */}
            <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'var(--ff-sans)',
                fontWeight: 900,
                fontSize: '22px',
                color: 'var(--ink)',
                letterSpacing: '-1.4px',
                textDecoration: 'none'
            }}>
                <div style={{
                    position: 'relative',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    {/* Pulsing Prismatic Energy Field */}
                    <div style={{
                        position: 'absolute',
                        inset: '-4px',
                        background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, rgba(192,132,252,0.15) 50%, transparent 70%)',
                        borderRadius: '50%',
                        zIndex: -1,
                        filter: 'blur(8px)'
                    }} />

                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <defs>
                            <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1E293B" />
                                <stop offset="100%" stopColor="#000000" />
                            </linearGradient>
                            <filter id="shardGlow">
                                <feGaussianBlur stdDeviation="1.2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Outer Geometric Orbit (Antigravity vibe) */}
                        <path d="M20 4L36 20L20 36L4 20L20 4Z" stroke="#3B82F6" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 4" />

                        {/* Upper Spectral Shard */}
                        <path d="M20 6L30 20L20 12L10 20L20 6Z" fill="#60A5FA" opacity="0.8" filter="url(#shardGlow)">
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                        </path>

                        {/* Lower Spectral Shard */}
                        <path d="M20 34L30 20L20 28L10 20L20 34Z" fill="#C084FC" opacity="0.8" filter="url(#shardGlow)">
                            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" delay="1.5s" />
                        </path>

                        {/* Central Crystalline Black Core */}
                        <path d="M20 10L32 20L20 30L8 20L20 10Z" fill="url(#crystalGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

                        {/* Core Data Node */}
                        <circle cx="20" cy="20" r="2.5" fill="none" stroke="#60A5FA" strokeWidth="1" />
                        <circle cx="20" cy="20" r="1" fill="white" />

                        {/* Floating Multicolour Particles */}
                        <circle cx="32" cy="20" r="1.5" fill="#3B82F6" />
                        <circle cx="8" cy="20" r="1.5" fill="#A259FF" />
                        <circle cx="20" cy="8" r="1" fill="#FF3B82" />
                        <circle cx="20" cy="32" r="1" fill="#10B981" />
                    </svg>
                </div>
                Aegis Infra
            </Link>
            {/* Center Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
            }}>
                <NavLink onClick={() => scrollToSection('features')}>Features</NavLink>
                <NavLink onClick={() => scrollToSection('how-it-works')}>How It Works</NavLink>
                <NavLink onClick={() => navigate('/pricing')}>Pricing</NavLink>
                <NavLink onClick={() => scrollToSection('api-docs')}>API Docs</NavLink>
            </div>

            {/* Right Actions */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                {isAuthenticated ? (
                    <>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            marginRight: '8px'
                        }}>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--ink)',
                                fontFamily: 'var(--ff-sans)'
                            }}>
                                {user?.email?.split('@')[0]}
                            </span>
                            <span style={{
                                fontSize: '10px',
                                color: 'var(--muted)',
                                fontFamily: 'var(--ff-sans)'
                            }}>
                                Logged in
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                fontSize: '13px',
                                fontWeight: 500,
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: '1px solid var(--sand)',
                                background: 'var(--white)',
                                color: 'var(--ink)',
                                transition: 'all 0.15s',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--cream)';
                                e.target.style.borderColor = 'var(--stone)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--white)';
                                e.target.style.borderColor = 'var(--sand)';
                            }}
                        >
                            Log out
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'var(--ink)',
                                color: 'var(--white)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                transition: 'all 0.15s',
                                fontFamily: 'var(--ff-sans)'
                            }}
                        >
                            Developer Console →
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '8px 22px',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                border: '1px solid rgba(0,0,0,0.05)',
                                background: 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--ink)',
                                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.8)';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 20px -10px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.4)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                padding: '8px 24px',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,1) 100%)',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--white)',
                                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                e.target.style.boxShadow = '0 12px 24px -6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 8px 16px -4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                            }}
                        >
                            Start Free Trial →
                        </button>
                    </>
                )}
            </div >
        </nav >
    );
};

// NavLink Component
const NavLink = ({ children, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                fontSize: '14px',
                fontWeight: 500,
                color: isHovered ? 'var(--ink)' : 'var(--muted)',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                background: isHovered ? 'rgba(0,0,0,0.03)' : 'none',
                backdropFilter: isHovered ? 'blur(4px)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--ff-sans)'
            }}
        >
            {children}
        </button>
    );
};

export default Navbar;
