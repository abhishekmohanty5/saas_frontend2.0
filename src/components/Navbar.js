import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import { Home, LayoutDashboard, CreditCard } from 'lucide-react'; // Added icons

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <div style={{
            position: 'fixed',
            top: isScrolled ? '16px' : '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            width: '90%',
            maxWidth: '1200px',
            transition: 'top 0.3s ease'
        }}>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isScrolled ? '10px 20px' : '12px 24px',
                borderRadius: '9999px',
                background: isScrolled ? 'var(--nav-glass-bg, rgba(255,255,255,0.08))' : 'var(--nav-glass-bg-idle, rgba(255,255,255,0.03))',
                backdropFilter: 'saturate(180%) blur(20px)',
                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                border: isScrolled ? '1px solid var(--nav-glass-border, rgba(255,255,255,0.1))' : '1px solid transparent',
                boxShadow: isScrolled ? '0 10px 40px -10px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
            }}>
                {/* Logo and Center Nav Wrapper to flex them similarly to the image */}
                <div style={{ flex: 1 }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: 'var(--ff-sans)',
                        fontWeight: 900,
                        fontSize: '18px',
                        color: 'var(--theme-text)',
                        letterSpacing: '-1.2px',
                        textDecoration: 'none'
                    }}>
                        <span style={{ fontSize: '17.5px', fontWeight: 800, letterSpacing: '-0.3px' }}>Aegis <span style={{ color: '#3b82f6' }}>I</span>nfra</span>
                    </Link>
                </div>

                {/* Center Navigation - Truly Centered */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    flex: 1
                }}>
                    <NavLink onClick={() => navigate('/')} icon={<Home size={18} />}>Home</NavLink>
                    <NavLink onClick={() => scrollToSection('how-it-works')} icon={<LayoutDashboard size={18} />}>How It Works</NavLink>
                    <NavLink onClick={() => navigate('/pricing')} icon={<CreditCard size={18} />}>Pricing</NavLink>
                </div>

                {/* Right Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '16px',
                    flex: 1
                }}>
                    <ThemeSwitcher />
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
                                color: 'var(--theme-text)',
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
                                border: '1px solid var(--theme-border)',
                                background: 'transparent',
                                color: 'var(--theme-text)',
                                transition: 'all 0.15s',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--muted)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                            }}
                        >
                            Log out
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '8px 24px',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                border: '1px solid var(--theme-border)',
                                background: 'transparent',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--theme-text)',
                                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(128,128,128,0.1)';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 20px -10px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
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
                                border: '1px solid var(--theme-border)',
                                background: 'transparent',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--theme-text)',
                                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(128,128,128,0.1)';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 20px -10px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
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
                                border: '1px solid var(--theme-border)',
                                background: 'var(--theme-text)',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--bg)',
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
        </div >
    );
};

// NavLink Component
const NavLink = ({ children, onClick, icon }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                fontSize: '15px',
                fontWeight: 600,
                color: isHovered ? 'var(--theme-text)' : 'var(--muted)',
                padding: '8px 16px',
                borderRadius: '9999px',
                cursor: 'pointer',
                border: 'none',
                background: isHovered ? 'var(--theme-border)' : 'transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--ff-sans)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            {children}
        </button>
    );
};

export default Navbar;
