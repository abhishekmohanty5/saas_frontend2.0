import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  CreditCard, 
  User, 
  ChevronDown, 
  LogOut,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const { theme } = useTheme(); 
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dashboardRoute = user?.role === 'ROLE_SUPER_ADMIN' ? '/super-admin' : '/dashboard';
    const dashboardLabel = user?.role === 'ROLE_SUPER_ADMIN' ? 'Admin Console' : 'Developer Console';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = theme === 'dark' || (theme === 'system' && prefersDarkMode);
    const navBackground = isDarkMode
        ? (isScrolled
            ? 'linear-gradient(135deg, rgba(13, 17, 26, 0.92) 0%, rgba(7, 10, 18, 0.78) 50%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(16, 20, 30, 0.72) 0%, rgba(11, 14, 22, 0.54) 50%, rgba(16, 20, 30, 0.68) 100%)')
        : (isScrolled
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0.78) 52%, rgba(248, 250, 252, 0.82) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.62) 52%, rgba(248, 250, 252, 0.66) 100%)');
    const navBorder = isDarkMode
        ? '1px solid rgba(255, 255, 255, 0.08)'
        : '1px solid rgba(15, 23, 42, 0.06)';
    const navShadow = isDarkMode
        ? (isScrolled
            ? '0 24px 60px -18px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
            : '0 16px 42px -18px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.04)')
        : (isScrolled
            ? '0 24px 54px -18px rgba(15, 23, 42, 0.12), 0 10px 30px -20px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.78)'
            : '0 16px 42px -20px rgba(15, 23, 42, 0.08), 0 10px 26px -22px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.76)');
    const navMixBlend = isDarkMode ? 'screen' : 'normal';
    const navOverlayOpacity = isScrolled ? 1 : 0.84;

    const handleNav = (id) => {
        if (user?.role === 'ROLE_SUPER_ADMIN') {
            navigate(`/super-admin?tab=${id}`);
        } else {
            navigate(`/dashboard?tab=${id}`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
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
            top: isScrolled ? '14px' : '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            width: isScrolled ? 'min(90vw, 1120px)' : 'min(94vw, 1200px)',
            transition: 'top 0.35s ease, width 0.35s ease, transform 0.35s ease'
        }}>
            <nav className={`navbar-shell ${isScrolled ? 'is-scrolled' : ''}`} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isScrolled ? '10px 18px' : '14px 22px',
                borderRadius: '9999px',
                background: navBackground,
                backdropFilter: isScrolled ? 'saturate(190%) blur(34px)' : 'saturate(180%) blur(26px)',
                WebkitBackdropFilter: isScrolled ? 'saturate(190%) blur(34px)' : 'saturate(180%) blur(26px)',
                border: navBorder,
                boxShadow: navShadow,
                transform: isScrolled ? 'translateZ(0) scale(0.988)' : 'translateZ(0) scale(1)',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                overflow: 'hidden',
                position: 'relative',
                isolation: 'isolate'
            }}>
                <style>{`
                    .navbar-shell::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background:
                            ${isDarkMode
                                ? `radial-gradient(circle at 12% 20%, rgba(255, 255, 255, 0.45), transparent 28%),
                                   radial-gradient(circle at 88% 0%, rgba(59, 130, 246, 0.22), transparent 22%),
                                   linear-gradient(120deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.16) 100%)`
                                : `radial-gradient(circle at 14% 18%, rgba(255, 255, 255, 0.94), transparent 26%),
                                   radial-gradient(circle at 84% 4%, rgba(255, 255, 255, 0.28), transparent 24%),
                                   radial-gradient(circle at 65% 100%, rgba(255, 255, 255, 0.16), transparent 30%),
                                   linear-gradient(120deg, rgba(255, 255, 255, 0.36), rgba(248, 250, 252, 0.14) 40%, rgba(255, 255, 255, 0.3) 100%)`};
                        opacity: ${navOverlayOpacity};
                        pointer-events: none;
                        z-index: 0;
                        mix-blend-mode: ${navMixBlend};
                    }
                    .navbar-shell::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: inherit;
                        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
                        pointer-events: none;
                        z-index: 0;
                    }
                    .navbar-shell > * {
                        position: relative;
                        z-index: 1;
                    }
                    @media (max-width: 860px) {
                        .nav-center { display: none !important; }
                        .nav-right-desktop { display: none !important; }
                        .nav-mobile-toggle { display: flex !important; }
                    }
                    @media (min-width: 861px) {
                        .nav-mobile-toggle { display: none !important; }
                        .nav-mobile-menu { display: none !important; }
                    }
                `}</style>
                {/* Logo */}
                <div style={{ flex: 1 }}>
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
                        <span style={{ 
                            fontSize: '17.5px', 
                            fontWeight: 800, 
                            letterSpacing: '-0.3px',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            Aegis <span style={{ color: '#3b82f6', marginLeft: '4px' }}>I</span>nfra
                        </span>
                    </Link>
                </div>

                {/* Center Navigation */}
                <div className="nav-center" style={{
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

                {/* Right Actions - Desktop */}
                <div className="nav-right-desktop" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '16px',
                    flex: 1
                }} ref={dropdownRef}>
                    {isAuthenticated ? (
                        <>
                            {/* Profile Dropdown Toggle */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 12px 4px 4px',
                                        borderRadius: '100px',
                                        background: isDarkMode
                                            ? (isProfileOpen ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.03)')
                                            : (isProfileOpen ? 'rgba(59,130,246,0.10)' : 'rgba(235,245,255,0.72)'),
                                        border: isDarkMode ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(145,192,230,0.28)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        color: 'var(--theme-text)'
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#10b981',
                                        boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
                                    }}>
                                        <User size={18} />
                                    </div>
                                    <ChevronDown size={14} style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', opacity: 0.5 }} />
                                </button>

                                {/* Dropdown Menu - Ultimate 3D Zoom-Pop Opening */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ 
                                                opacity: 0, 
                                                scale: 0, 
                                                rotateX: -45, 
                                                y: -40,
                                                transformPerspective: 1200
                                            }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: 1, 
                                                rotateX: 0, 
                                                y: 0 
                                            }}
                                            exit={{ 
                                                opacity: 0, 
                                                scale: 0.2, 
                                                rotateX: 30, 
                                                y: 40 
                                            }}
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 350, 
                                                damping: 20,
                                                mass: 1
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '56px',
                                                right: 0,
                                                width: '280px',
                                                background: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
                                                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 1) 100%)' 
                                                    : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                                                border: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                                    : '1px solid rgba(0, 0, 0, 0.06)',
                                                borderRadius: '28px',
                                                padding: '12px',
                                                boxShadow: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                                                    ? '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                                                    : '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 1)',
                                                backdropFilter: 'blur(40px)',
                                                WebkitBackdropFilter: 'blur(40px)',
                                                zIndex: 300,
                                                transformOrigin: 'top right',
                                            }}
                                        >
                                            <div style={{ 
                                                padding: '18px 20px', 
                                                borderBottom: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                                                    ? '1px solid rgba(255, 255, 255, 0.05)'
                                                    : '1px solid rgba(0, 0, 0, 0.05)', 
                                                marginBottom: '8px',
                                                background: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
                                                    ? 'rgba(255, 255, 255, 0.03)'
                                                    : 'rgba(0, 0, 0, 0.015)',
                                                borderRadius: '20px 20px 8px 8px'
                                            }}>
                                                <div style={{ 
                                                    fontWeight: 900, 
                                                    color: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? '#fff' : '#000', 
                                                    fontSize: '16px', 
                                                    fontFamily: 'var(--ff-sans)', 
                                                    letterSpacing: '-0.5px' 
                                                }}>
                                                    {user?.name || user?.email?.split('@')[0]}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)', 
                                                    fontWeight: 700, 
                                                    fontFamily: 'monospace', 
                                                    marginTop: '4px',
                                                    letterSpacing: '0.2px'
                                                }}>
                                                    {user?.email}
                                                </div>
                                            </div>

                                            <div style={{ padding: '6px' }}>
                                                <button
                                                    onClick={() => { navigate(dashboardRoute); setIsProfileOpen(false); }}
                                                    style={{
                                                        ...dropdownItemStyle, 
                                                        borderRadius: '16px', 
                                                        color: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? '#fff' : '#000',
                                                        padding: '12px 14px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
                                                        e.currentTarget.style.transform = 'scale(1.02) translateX(6px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.transform = 'scale(1) translateX(0)';
                                                    }}
                                                >
                                                    <Activity size={18} style={{ color: '#3b82f6' }} /> 
                                                    <span style={{ fontWeight: 700 }}>{dashboardLabel}</span>
                                                </button>

                                                <button
                                                    onClick={handleLogout}
                                                    style={{ 
                                                        ...dropdownItemStyle, 
                                                        borderRadius: '16px',
                                                        color: '#fff',
                                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                        border: 'none',
                                                        marginTop: '12px',
                                                        padding: '14px',
                                                        boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.4)',
                                                        justifyContent: 'center'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(239, 68, 68, 0.5)';
                                                        e.currentTarget.style.filter = 'brightness(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(239, 68, 68, 0.4)';
                                                        e.currentTarget.style.filter = 'none';
                                                    }}
                                                >
                                                    <LogOut size={18} /> 
                                                    <span style={{ fontWeight: 900, letterSpacing: '1px' }}>LOG OUT</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/super-admin') && (
                                <button
                                    onClick={() => navigate(dashboardRoute)}
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
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {dashboardLabel} {'>'}
                                </button>
                            )}
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
                                    color: 'var(--theme-text)',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    fontFamily: 'var(--ff-sans)'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(128,128,128,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
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
                                    color: 'var(--bg)',
                                    boxShadow: '0 8px 16px -4px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                    fontFamily: 'var(--ff-sans)'
                                }}
                            >
                                Start Free Trial →
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="nav-mobile-toggle" style={{ 
                    display: 'none', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    flex: 1 
                }}>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--theme-text)',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="nav-mobile-menu"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '12px',
                                background: isDarkMode
                                    ? 'linear-gradient(135deg, rgba(11, 15, 23, 0.92), rgba(4, 7, 15, 0.84))'
                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.90), rgba(235, 245, 255, 0.78) 45%, rgba(226, 248, 255, 0.68) 100%)',
                                backdropFilter: 'saturate(180%) blur(30px)',
                                WebkitBackdropFilter: 'saturate(180%) blur(30px)',
                                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(145,192,230,0.34)',
                                borderRadius: '24px',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                boxShadow: isDarkMode
                                    ? '0 30px 60px -18px rgba(0,0,0,0.65)'
                                    : '0 24px 48px -20px rgba(59,130,246,0.16), 0 10px 24px -20px rgba(15, 23, 42, 0.12)',
                                zIndex: 300
                            }}
                        >
                            <NavLink onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} icon={<Home size={18} />}>Home</NavLink>
                            <NavLink onClick={() => { scrollToSection('how-it-works'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard size={18} />}>How It Works</NavLink>
                            <NavLink onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }} icon={<CreditCard size={18} />}>Pricing</NavLink>
                            
                            <div style={{ height: '1px', background: 'var(--nav-glass-border, rgba(0,0,0,0.05))', margin: '8px 0' }} />
                            
                            {isAuthenticated ? (
                                <>
                                    <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>{user?.role === 'ROLE_SUPER_ADMIN' ? 'ADMIN_CONSOLE' : 'DASHBOARD_NAVIGATION'}</div>
                                    {user?.role === 'ROLE_SUPER_ADMIN' ? (
                                        <>
                                            <NavLink onClick={() => { handleNav('overview'); setIsMobileMenuOpen(false); }} icon={<Activity size={18} />}>Overview</NavLink>
                                            <NavLink onClick={() => { handleNav('tenants'); setIsMobileMenuOpen(false); }} icon={<Activity size={18} />}>Tenants</NavLink>
                                            <NavLink onClick={() => { handleNav('plans'); setIsMobileMenuOpen(false); }} icon={<CreditCard size={18} />}>Plans</NavLink>
                                            <NavLink onClick={() => { handleNav('users'); setIsMobileMenuOpen(false); }} icon={<User size={18} />}>Users</NavLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavLink onClick={() => { handleNav('overview'); setIsMobileMenuOpen(false); }} icon={<Activity size={18} />}>Overview</NavLink>
                                            <NavLink onClick={() => { handleNav('credentials'); setIsMobileMenuOpen(false); }} icon={<CreditCard size={18} />}>Credentials</NavLink>
                                            <NavLink onClick={() => { handleNav('plans'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard size={18} />}>Subscription Plans</NavLink>
                                            <NavLink onClick={() => { handleNav('subscribers'); setIsMobileMenuOpen(false); }} icon={<User size={18} />}>Subscribers</NavLink>
                                            <NavLink onClick={() => { handleNav('services'); setIsMobileMenuOpen(false); }} icon={<Activity size={18} />}>System Services</NavLink>
                                        </>
                                    )}
                                    
                                    <div style={{ height: '1px', background: 'var(--nav-glass-border, rgba(0,0,0,0.05))', margin: '8px 0' }} />
                                    <button
                                        onClick={handleLogout}
                                        style={{ 
                                            padding: '12px', 
                                            background: '#ef4444', 
                                            color: '#fff', 
                                            border: 'none', 
                                            borderRadius: '12px', 
                                            fontWeight: 700 
                                        }}
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} style={{ padding: '12px', border: '1px solid var(--nav-glass-border)', borderRadius: '12px', background: 'none', color: 'var(--theme-text)', fontWeight: 600 }}>Sign In</button>
                                    <button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} style={{ padding: '12px', border: 'none', borderRadius: '12px', background: 'var(--theme-text)', color: 'var(--bg)', fontWeight: 700 }}>Start Free Trial</button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
};

const dropdownItemStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'var(--theme-text)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--ff-sans)',
    textAlign: 'left'
};

const NavLink = ({ children, onClick, icon }) => {
    const [isHovered, setIsHovered] = useState(false);
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
