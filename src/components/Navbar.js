import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
                gap: '8px',
                fontFamily: 'var(--ff-sans)',
                fontWeight: 900,
                fontSize: '22px',
                color: 'var(--ink)',
                letterSpacing: '-1.4px',
                textDecoration: 'none'
            }}>
                <div style={{
                    position: 'relative',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderRadius: '6px',
                    overflow: 'hidden'
                }}>
                    <img src="/logo.jpg" alt="Aegis Infra Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>Aegis Infra</span>
            </Link>
            {/* Center Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                <NavLink onClick={() => navigate('/')}>Home</NavLink>
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
                            alignItems: 'center',
                            marginRight: '12px',
                            background: 'rgba(0,0,0,0.03)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            gap: '10px'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                background: '#10b981',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                                animation: 'pulse 2s infinite'
                            }} />
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: 'var(--ink)',
                                fontFamily: 'var(--ff-sans)',
                                letterSpacing: '-0.2px'
                            }}>
                                {(() => {
                                    const rawName = user?.name || user?.email?.split('@')[0];
                                    const cleanName = rawName?.split(/[._\s\d]/)[0]; // Split by dot, underscore, space, or digit
                                    return cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : '';
                                })()}
                            </span>
                            <style>{`
                                @keyframes pulse {
                                    0% { opacity: 1; transform: scale(1); }
                                    50% { opacity: 0.5; transform: scale(1.3); }
                                    100% { opacity: 1; transform: scale(1); }
                                }
                            `}</style>
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
                fontWeight: 700,
                color: isHovered ? 'var(--ink)' : 'rgba(15, 23, 42, 0.7)',
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
