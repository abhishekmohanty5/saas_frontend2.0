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
    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return (
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                );
            case 'warning':
                return (
                    <div style={{ background: 'rgba(245, 158, 11, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
                    </div>
                );
            case 'info':
                return (
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                    </div>
                );
            case 'error':
                return (
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                background: 'rgba(30, 58, 138, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderRadius: '20px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                width: '400px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                pointerEvents: 'auto',
                animation: 'fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                color: '#ffffff',
            }}
        >
            <div style={{ flexShrink: 0 }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px', fontFamily: 'var(--ff-sans)', letterSpacing: '-0.3px' }}>
                    {toast.title}
                </div>
                {toast.subtitle && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: 400, fontFamily: 'var(--ff-sans)' }}>
                        {toast.subtitle}
                    </div>
                )}
            </div>
            <button
                onClick={onRemove}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ffffff',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    );
};
