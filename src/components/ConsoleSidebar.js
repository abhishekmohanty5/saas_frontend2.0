import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

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
            width: sidebarOpen ? 280 : 80,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderRight: "1px solid rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            transition: "all .4s cubic-bezier(0.19, 1, 0.22, 1)",
            position: "sticky",
            top: 68,
            height: "calc(100vh - 68px)",
            zIndex: 100,
            padding: "32px 0",
            boxShadow: "10px 0 50px rgba(0,0,0,0.02)",
            overflowX: "hidden"
        }}>
            <style>{`
                .sidebar-label {
                    font-size: 10px;
                    font-weight: 800;
                    color: #94a3b8;
                    padding: 32px 28px 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-family: var(--ff-mono, monospace);
                }
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 14px 28px;
                    margin: 2px 12px;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    position: relative;
                }
                .sidebar-item:hover {
                    color: #1e1b4b;
                    background: rgba(15, 23, 42, 0.03);
                    transform: translateX(4px);
                }
                .sidebar-item.active {
                    color: #4f46e5;
                    background: #ffffff;
                    box-shadow: 
                        0 10px 25px -5px rgba(79, 70, 229, 0.1),
                        0 8px 10px -6px rgba(79, 70, 229, 0.1),
                        inset 0 1px 0 rgba(255,255,255,1);
                    transform: translateX(6px);
                }
                .sidebar-item.active::before {
                    content: '';
                    position: absolute;
                    left: -4px;
                    top: 15%;
                    height: 70%;
                    width: 4px;
                    background: #4f46e5;
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
                }
                .sidebar-item svg {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .sidebar-item:hover svg {
                    transform: scale(1.1) rotate(-5deg);
                }
                .sidebar-footer-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 28px;
                    cursor: pointer;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s;
                    margin: 0 12px;
                    border-radius: 12px;
                }
                .sidebar-footer-item:hover {
                    color: #1e1b4b;
                    background: rgba(15, 23, 42, 0.03);
                }
                .sidebar-footer-item.logout {
                    color: #f43f5e;
                }
                .sidebar-footer-item.logout:hover {
                    background: rgba(244, 63, 94, 0.05);
                }
                .workspace-card {
                    margin: 0 16px 24px;
                    padding: 24px;
                    border-radius: 12px;
                    background: #ffffff;
                    border: 1px solid rgba(15, 23, 42, 0.06);
                    box-shadow: 
                        0 20px 25px -5px rgba(0,0,0,0.03),
                        0 8px 10px -6px rgba(0,0,0,0.03),
                        inset 0 1px 1px rgba(255,255,255,1);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .workspace-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 
                        0 25px 30px -5px rgba(0,0,0,0.05),
                        0 12px 15px -6px rgba(0,0,0,0.05);
                }
                .workspace-card::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0;
                    width: 70px; height: 70px;
                    background: radial-gradient(circle at top right, rgba(79, 70, 229, 0.05), transparent 70%);
                    pointer-events: none;
                }
            `}</style>

            {/* Workspace Section - Persistent Operational HUD */}
            <div className="workspace-card" style={{
                margin: sidebarOpen ? "0 16px 24px" : "0 8px 24px",
                padding: sidebarOpen ? "18px 20px" : "16px 8px",
                textAlign: sidebarOpen ? "left" : "center",
                display: "flex",
                flexDirection: "column",
                alignItems: sidebarOpen ? "flex-start" : "center",
                transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                minHeight: sidebarOpen ? "110px" : "100px",
                justifyContent: "flex-start"
            }}>
                {sidebarOpen ? (
                    <>
                        <div style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#1e1b4b",
                            fontFamily: 'var(--ff-sans)',
                            letterSpacing: '-0.5px',
                            marginBottom: 14
                        }}>
                            {tenantName || 'Acme SaaS'}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <div style={{
                                background: "#6366f1",
                                color: "white",
                                fontSize: '9px',
                                fontWeight: 800,
                                padding: '3px 10px',
                                borderRadius: '100px',
                                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
                                letterSpacing: '0.05em',
                                whiteSpace: 'nowrap'
                            }}>
                                {currentPlan || 'FREE'}
                            </div>

                            {daysRemaining !== undefined && (
                                <div style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: daysRemaining > 10 ? '#10b981' : '#ef4444',
                                    background: daysRemaining > 10 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                    padding: '3px 12px',
                                    borderRadius: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    boxShadow: `0 0 12px ${daysRemaining > 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                                    border: `1px solid ${daysRemaining > 10 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{
                                        width: 5, height: 5, borderRadius: '50%',
                                        background: daysRemaining > 10 ? '#10b981' : '#ef4444',
                                        boxShadow: `0 0 8px ${daysRemaining > 10 ? '#10b981' : '#ef4444'}`
                                    }} />
                                    {daysRemaining} days left
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Compact HUD Protocols (Lights & Plan) when collapsed */}
                        <div style={{
                            width: 12, height: 12, borderRadius: "50%",
                            background: daysRemaining > 10 ? '#10b981' : '#ef4444',
                            boxShadow: `0 0 15px ${daysRemaining > 10 ? '#10b981' : '#ef4444'}, 0 0 5px rgba(255,255,255,0.8)`,
                            marginBottom: 14,
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: -4,
                                borderRadius: '50%',
                                border: `1px solid ${daysRemaining > 10 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                opacity: 0.5
                            }} />
                        </div>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 900,
                            padding: '3px 6px',
                            background: "linear-gradient(135deg, #1e1b4b, #4f46e5)",
                            color: "white",
                            borderRadius: 6,
                            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                            letterSpacing: '0.05em'
                        }}>
                            {(currentPlan || 'F')[0].toUpperCase()}
                        </div>
                    </>
                )}
            </div>

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
            <div style={{
                borderTop: "1px solid rgba(15, 23, 42, 0.05)",
                margin: "16px 16px 0",
                paddingTop: 16
            }}>
                <div className="sidebar-footer-item" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: "rgba(15, 23, 42, 0.03)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s"
                    }}>
                        <Icon name="chevronLeft" size={16} style={{ transform: sidebarOpen ? "none" : "rotate(180deg)" }} />
                    </div>
                    {sidebarOpen && <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: 12, letterSpacing: '0.05em' }}>SYSTEM.COLLAPSE()</span>}
                </div>
                <div className="sidebar-footer-item logout" onClick={handleLogout}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: "rgba(244, 63, 94, 0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Icon name="logout" size={16} color="#f43f5e" />
                    </div>
                    {sidebarOpen && <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: 12, letterSpacing: '0.05em' }}>AUTH.TERMINATE()</span>}
                </div>
            </div>
        </aside>
    );
};

export default ConsoleSidebar;
