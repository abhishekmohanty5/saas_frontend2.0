import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, title, subtitle) => {
        const id = idCounter++;
        setToasts((prev) => [...prev, { id, type, title, subtitle }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (title, subtitle) => addToast('success', title, subtitle),
        error: (title, subtitle) => addToast('error', title, subtitle),
        warning: (title, subtitle) => addToast('warning', title, subtitle),
        info: (title, subtitle) => addToast('info', title, subtitle),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '50%',
                    transform: 'translateX(50%)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    pointerEvents: 'none',
                }}
            >
                {toasts.map((t) => (
                    <ToastCard key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastCard = ({ toast, onRemove }) => {
    const getThemeColor = () => {
        if (toast.type === 'success') return '16, 185, 129'; // Emerald
        if (toast.type === 'error') return '239, 68, 68'; // Rose
        if (toast.type === 'warning') return '245, 158, 11'; // Amber
        return '59, 130, 246'; // Blue
    };

    const themeColor = getThemeColor();

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return (
                    <div style={{
                        background: `rgba(${themeColor}, 0.25)`,
                        borderRadius: '12px',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 15px rgba(${themeColor}, 0.3)`
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                );
            case 'error':
            case 'warning':
                return (
                    <div style={{
                        background: `rgba(${themeColor}, 0.25)`,
                        borderRadius: '12px',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 15px rgba(${themeColor}, 0.3)`
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div style={{ background: `rgba(${themeColor}, 0.25)`, borderRadius: '12px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </div>
                );
        }
    };

    return (
        <div
            style={{
                background: `rgba(${themeColor}, 0.12)`,
                backdropFilter: 'blur(12px) saturate(160%)',
                WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                borderRadius: '16px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                width: '440px',
                maxWidth: '90vw',
                boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(${themeColor}, 0.2)`,
                pointerEvents: 'auto',
                animation: 'fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                color: '#1e1b4b',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Glossy Overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, height: '50%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)',
                pointerEvents: 'none'
            }} />

            <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>{getIcon()}</div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px', fontFamily: 'var(--ff-sans)', letterSpacing: '-0.3px', color: '#0f172a' }}>
                    {toast.title}
                </div>
                {toast.subtitle && (
                    <div style={{ color: '#475569', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--ff-sans)' }}>
                        {toast.subtitle}
                    </div>
                )}
            </div>
            <button
                onClick={onRemove}
                style={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)')}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    );
};
