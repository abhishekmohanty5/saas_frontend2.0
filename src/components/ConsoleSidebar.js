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
            top: 0,
            height: "100vh",
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
                    width: 36, height: 36, background: "#0f172a",
                    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                {sidebarOpen && <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>SubSphere</span>}
            </div>

            {/* Workspace Section */}
            {sidebarOpen && (
                <div style={{ margin: "0 16px 8px", padding: "16px", borderRadius: "12px", background: "#f8fafc" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase" }}>Workspace</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{tenantName || 'Acme SaaS'}</div>
                    <div className="plan-badge">{currentPlan || 'FREE'}</div>
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
