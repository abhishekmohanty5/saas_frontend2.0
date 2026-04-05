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
  Activity
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
                        <span style={{ fontSize: '17.5px', fontWeight: 800, letterSpacing: '-0.3px' }}>Aegis <span style={{ color: '#3b82f6' }}>I</span>nfra</span>
                    </Link>
                </div>

                {/* Center Navigation */}
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
                                        background: isProfileOpen ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.03)',
                                        border: '1px solid rgba(0,0,0,0.05)',
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
                                                    onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}
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
                                                    <span style={{ fontWeight: 700 }}>My Console</span>
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
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
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
