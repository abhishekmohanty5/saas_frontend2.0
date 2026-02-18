import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
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
                gap: '10px',
                fontFamily: 'var(--ff-sans)',
                fontWeight: 700,
                fontSize: '18px',
                color: 'var(--ink)',
                letterSpacing: '-0.4px',
                textDecoration: 'none'
            }}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="#C9A84C" opacity="0.9" />
                    </svg>
                </div>
                SubSphere
            </Link>

            {/* Center Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
            }}>
                <NavLink onClick={() => navigate('/')}>Product</NavLink>
                <NavLink onClick={() => navigate('/pricing')}>Pricing</NavLink>
                <NavLink onClick={() => navigate('/dashboard')}>Dashboard</NavLink>
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
                            Go to App
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                padding: '8px 18px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none',
                                color: 'var(--muted)',
                                transition: 'all 0.15s',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = 'var(--ink)';
                                e.target.style.background = 'var(--cream)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = 'var(--muted)';
                                e.target.style.background = 'none';
                            }}
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => navigate('/pricing')}
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                padding: '8px 18px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'var(--ink)',
                                color: 'var(--white)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                                transition: 'all 0.15s',
                                fontFamily: 'var(--ff-sans)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--ink2)';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--ink)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)';
                            }}
                        >
                            Start free trial →
                        </button>
                    </>
                )}
            </div>
        </nav>
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
                background: isHovered ? 'var(--cream)' : 'none',
                transition: 'color 0.15s, background 0.15s',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--ff-sans)'
            }}
        >
            {children}
        </button>
    );
};

export default Navbar;
