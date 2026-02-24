import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

// ICONS (SVG inline, match the image style)
const Icon = ({ name, size = 18, color = "currentColor" }) => {
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
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
    currentPlan
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { id: "overview", label: "Dashboard", icon: "grid" },
        { id: "credentials", label: "Credentials", icon: "key" },
        { id: "plans", label: "Plans", icon: "zap" },
        { id: "subscribers", label: "Subscribers", icon: "users" },
        { id: "license", label: "License", icon: "shield" },
        { id: "services", label: "Services", icon: "services" },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNav = (id) => {
        navigate(`/dashboard?tab=${id}`);
    };

    return (
        <aside style={{
            width: sidebarOpen ? 260 : 80,
            background: "#ffffff",
            borderRight: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column",
            transition: "width .3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "sticky",
            top: 68,
            height: "calc(100vh - 68px)",
            zIndex: 100,
            padding: "24px 0"
        }}>
            <style>{`
                .sidebar-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    padding: 24px 24px 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 24px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #64748b;
                    font-weight: 500;
                    font-size: 14px;
                }
                .sidebar-item:hover {
                    color: #0f172a;
                    background: #f8fafc;
                }
                .sidebar-item.active {
                    color: #4f46e5;
                    background: #eef2ff;
                    border-right: 3px solid #4f46e5;
                }
                .sidebar-item.active svg {
                    stroke: #4f46e5;
                }
                .sidebar-footer-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 24px;
                    cursor: pointer;
                    color: #64748b;
                    font-weight: 500;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .sidebar-footer-item:hover {
                    color: #0f172a;
                }
                .sidebar-footer-item.logout {
                    color: #ef4444;
                }
                .plan-badge {
                    font-size: 10px;
                    font-weight: 700;
                    color: #4f46e5;
                    background: #eef2ff;
                    padding: 2px 8px;
                    border-radius: 4px;
                    margin-top: 4px;
                    display: inline-block;
                }
            `}</style>

            {/* Logo Section */}
            <div style={{ padding: "0 24px 32px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                    position: 'relative',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
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
                        <path d="M20 4L36 20L20 36L4 20L20 4Z" stroke="#3B82F6" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 4" />
                        <path d="M20 6L30 20L20 12L10 20L20 6Z" fill="#60A5FA" opacity="0.8" filter="url(#shardGlow)" />
                        <path d="M20 34L30 20L20 28L10 20L20 34Z" fill="#C084FC" opacity="0.8" filter="url(#shardGlow)" />
                        <path d="M20 10L32 20L20 30L8 20L20 10Z" fill="url(#crystalGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                        <circle cx="20" cy="20" r="2.5" fill="none" stroke="#60A5FA" strokeWidth="1" />
                        <circle cx="20" cy="20" r="1" fill="white" />
                        <circle cx="32" cy="20" r="1.5" fill="#3B82F6" />
                        <circle cx="8" cy="20" r="1.5" fill="#A259FF" />
                        <circle cx="20" cy="8" r="1" fill="#FF3B82" />
                        <circle cx="20" cy="32" r="1" fill="#10B981" />
                    </svg>
                </div>
                {sidebarOpen && <span style={{ fontSize: 22, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-1.4px", fontFamily: 'var(--ff-sans)' }}>Aegis Infra</span>}
            </div>

            {/* Workspace Section */}
            {sidebarOpen && (
                <div style={{
                    margin: "0 16px 24px",
                    padding: "16px",
                    borderRadius: "16px",
                    background: "rgba(99, 102, 241, 0.05)",
                    border: "1px solid rgba(99, 102, 241, 0.1)"
                }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Workspace</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b" }}>{tenantName || 'Acme SaaS'}</div>
                    <div className="plan-badge" style={{ background: "#6366f1", color: "white", marginTop: 8 }}>{currentPlan || 'FREE'}</div>
                </div>
            )}

            {/* Menu Section */}
            <div style={{ flex: 1 }}>
                <div className="sidebar-label">{sidebarOpen ? "Menu" : ""}</div>
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
                        onClick={() => handleNav(item.id)}
                    >
                        <Icon name={item.icon} color={activeTab === item.id ? "#4f46e5" : "#94a3b8"} />
                        {sidebarOpen && <span>{item.label}</span>}
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                <div className="sidebar-footer-item" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Icon name="chevronLeft" size={18} style={{ transform: sidebarOpen ? "none" : "rotate(180deg)" }} />
                    {sidebarOpen && <span>Collapse</span>}
                </div>
                <div className="sidebar-footer-item logout" onClick={handleLogout}>
                    <Icon name="logout" size={18} color="#ef4444" />
                    {sidebarOpen && <span>Sign Out</span>}
                </div>
            </div>
        </aside>
    );
};

export default ConsoleSidebar;
