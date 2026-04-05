import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// ICONS (SVG inline, match the image style)
const Icon = ({ name, size = 18, color = "currentColor", style }) => {
    const icons = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
        key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
        zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
        users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
        shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
        services: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
        logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
        chevronLeft: <><polyline points="15 18 9 12 15 6" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[name]}
        </svg>
    );
};

const ConsoleSidebar = ({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    tenantName,
    currentPlan,
    daysRemaining
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme } = useTheme();

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const menuItems = [
        { id: "overview", label: "Dashboard", icon: "grid" },
        { id: "credentials", label: "Credentials", icon: "key" },
        { id: "plans", label: "Plans", icon: "zap" },
        { id: "subscribers", label: "Subscribers", icon: "users" },
        { id: "services", label: "Services", icon: "services" },
    ];

    const styles = {
        bg: isDark ? "rgba(10, 10, 15, 0.95)" : "rgba(255, 255, 255, 0.98)",
        border: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.08)",
        text: isDark ? "#94a3b8" : "#64748b",
        textActive: isDark ? "white" : "#1e293b",
        cardBg: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(248, 250, 252, 0.8)",
        shadow: isDark ? "inset 1px 0 0 0 rgba(255, 255, 255, 0.03), 10px 0 60px rgba(0,0,0,0.5)" : "10px 0 60px rgba(15, 23, 42, 0.05)",
        btnBg: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.02)",
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNav = (id) => {
        navigate(`/dashboard?tab=${id}`);
    };

    return (
        <aside style={{
            width: sidebarOpen ? 236 : 80,
            background: styles.bg,
            backdropFilter: "blur(24px) saturate(160%)",
            borderRight: `1px solid ${styles.border}`,
            display: "flex",
            flexDirection: "column",
            transition: "all .5s cubic-bezier(0.19, 1, 0.22, 1)",
            position: "sticky",
            top: 132,
            height: "calc(100vh - 132px)",
            zIndex: 100,
            padding: "24px 0",
            boxShadow: styles.shadow,
            overflowX: "hidden"
        }}>
            <style>{`
                .sidebar-label {
                    font-size: 9px;
                    font-weight: 900;
                    color: ${isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(100, 116, 139, 0.6)"};
                    padding: 24px 28px 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-family: var(--ff-mono, monospace);
                }
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px 28px;
                    margin: 1px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    color: ${styles.text};
                    font-weight: 600;
                    font-size: 13px;
                    position: relative;
                }
                .sidebar-item:hover {
                    color: ${styles.textActive};
                    background: ${styles.btnBg};
                    transform: translateX(4px);
                }
                .sidebar-item.active {
                    color: ${styles.textActive};
                    background: ${isDark ? "linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)" : "rgba(99, 102, 241, 0.05)"};
                }
                .sidebar-item.active::before {
                    content: '';
                    position: absolute;
                    left: -12px;
                    top: 20%;
                    height: 60%;
                    width: 3px;
                    background: #6366f1;
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 15px #6366f1, 0 0 5px #6366f1;
                }
                .workspace-card {
                    margin: 0 16px 20px;
                    padding: 16px;
                    border-radius: 18px;
                    background: ${styles.cardBg};
                    border: 1px solid ${styles.border};
                    box-shadow: ${isDark ? "inset 0 2px 10px rgba(0,0,0,0.4)" : "none"};
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }
                .workspace-card:hover {
                    border-color: rgba(99, 102, 241, 0.3);
                    transform: translateY(-2px);
                }
                @keyframes heartbeat {
                    0%, 100% { opacity: 0.4; filter: blur(2px); }
                    50% { opacity: 0.8; filter: blur(4px); }
                }
                .pulse-layer {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.08), transparent 70%);
                    animation: heartbeat 4s ease-in-out infinite;
                    pointer-events: none;
                }
                .sidebar-footer-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 18px;
                    margin: 4px 12px;
                    border-radius: 10px;
                    cursor: pointer;
                    color: ${styles.text};
                    font-family: var(--ff-mono);
                    font-size: 10px;
                    font-weight: 800;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .sidebar-footer-btn:hover {
                    background: ${styles.btnBg};
                    border-color: ${styles.border};
                    color: ${styles.textActive};
                }
                .sidebar-footer-btn.logout:hover {
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.05);
                    border-color: rgba(239, 68, 68, 0.1);
                }
            `}</style>

            {/* Workspace HUD */}
            <motion.div 
                layout
                className="workspace-card" 
                style={{
                    textAlign: sidebarOpen ? "left" : "center",
                    alignItems: sidebarOpen ? "flex-start" : "center",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className="pulse-layer" />
                <AnimatePresence mode="wait">
                    {sidebarOpen ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            style={{ width: '100%' }}
                        >
                            <div style={{
                                fontSize: 11.5,
                                fontWeight: 900,
                                color: isDark ? "white" : "#1e293b",
                                letterSpacing: '0.05em',
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                opacity: 0.9
                            }}>
                                {tenantName || 'ACME_SaaS'}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{
                                    background: "#6366f1",
                                    color: "white",
                                    fontSize: '8px',
                                    fontWeight: 900,
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    letterSpacing: '0.05em',
                                }}>
                                    {currentPlan || 'FREE'}
                                </div>

                                {daysRemaining !== undefined && (
                                    <div style={{
                                        fontSize: '8px',
                                        fontWeight: 900,
                                        color: daysRemaining > 10 ? '#10b981' : '#ef4444',
                                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(15, 23, 42, 0.03)',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        border: `1px solid ${styles.border}`
                                    }}>
                                        <div style={{
                                            width: 4, height: 4, borderRadius: '50%',
                                            background: daysRemaining > 10 ? '#10b981' : '#ef4444',
                                            boxShadow: `0 0 6px ${daysRemaining > 10 ? '#10b981' : '#ef4444'}`
                                        }} />
                                        {daysRemaining}D
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: daysRemaining > 10 ? '#10b981' : '#ef4444',
                                boxShadow: `0 0 15px ${daysRemaining > 10 ? '#10b981' : '#ef4444'}`,
                                marginBottom: 12
                            }} />
                            <div style={{
                                fontSize: 8,
                                fontWeight: 900,
                                padding: '3px 5px',
                                background: "#6366f1",
                                color: "white",
                                borderRadius: 3,
                            }}>
                                {(currentPlan || 'F')[0].toUpperCase()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Menu Section */}
            <div style={{ flex: 1 }}>
                <div className="sidebar-label">{sidebarOpen ? "SYSTEM_PROTOCOLS" : ""}</div>
                {menuItems.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
                        onClick={() => handleNav(item.id)}
                    >
                        <Icon name={item.icon} color={activeTab === item.id ? (isDark ? "white" : "#6366f1") : styles.text} />
                        {sidebarOpen && <span>{item.label}</span>}
                        {activeTab === item.id && (
                            <motion.div 
                                layoutId="activeBeam"
                                className="beam-indicator"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: 12,
                                    background: isDark ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)' : 'rgba(99, 102, 241, 0.04)',
                                    zIndex: -1
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <div style={{
                borderTop: `1px solid ${styles.border}`,
                margin: "12px 12px 0",
                paddingTop: 12
            }}>
                {/* Footer buttons removed */}
            </div>
        </aside>
    );
};

export default ConsoleSidebar;
