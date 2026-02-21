import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

/* ─────────────────────────────────────────────────────────
   CONSOLE SIDEBAR  –  shared by Dashboard & Subscriptions
   Width: 220px, background: var(--ink)
───────────────────────────────────────────────────────── */
const ConsoleSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const path = location.pathname;

    const NAV_ITEMS = [
        { icon: '⚡', label: 'Overview', route: '/dashboard' },
        { icon: '🔑', label: 'API Credentials', route: '/dashboard#credentials' },
        { icon: '📦', label: 'Subscriptions', route: '/subscriptions' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside style={styles.sidebar}>
            {/* Logo */}
            <div
                style={styles.logo}
                onClick={() => navigate('/')}
                title="Back to landing page"
            >
                <div style={styles.logoMark}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect width="6" height="6" rx="1.5" fill="#1A1714" />
                        <rect x="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".5" />
                        <rect y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".5" />
                        <rect x="8" y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".85" />
                    </svg>
                </div>
                <span style={styles.logoText}>SubSphere</span>
            </div>

            {/* Section label */}
            <div style={styles.sectionLabel}>Developer Console</div>

            {/* Nav items */}
            <nav style={{ flex: 1 }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = path === item.route || (item.route !== '/dashboard' && path.startsWith(item.route));
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.route.split('#')[0])}
                            style={{
                                ...styles.navItem,
                                background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                                color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                style={styles.logoutBtn}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E07070'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
            >
                <span style={{ fontSize: '16px' }}>🚪</span>
                <span>Logout</span>
            </button>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: '220px',
        minWidth: '220px',
        background: 'var(--ink)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 24px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '24px 20px 20px',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '8px',
    },
    logoMark: {
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: 'var(--gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    logoText: {
        fontFamily: 'var(--ff-sans)',
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--white)',
        letterSpacing: '-0.3px',
    },
    sectionLabel: {
        fontSize: '10px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        padding: '8px 20px 12px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '11px 20px',
        border: 'none',
        borderLeft: '2px solid transparent',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--ff-sans)',
        textAlign: 'left',
        transition: 'all 0.15s',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '11px 20px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--ff-sans)',
        color: 'rgba(255,255,255,0.35)',
        textAlign: 'left',
        transition: 'color 0.15s',
        marginTop: 'auto',
    },
};

export default ConsoleSidebar;
