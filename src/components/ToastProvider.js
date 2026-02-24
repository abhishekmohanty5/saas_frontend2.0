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
                    <div style={{ background: '#2D6A4F', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                );
            case 'warning':
                return (
                    <div style={{ background: '#F59E0B', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
                    </div>
                );
            case 'info':
                return (
                    <div style={{ background: '#3B82F6', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                    </div>
                );
            case 'error':
                return (
                    <div style={{ background: '#DC2626', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                width: '380px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.04)',
                pointerEvents: 'auto',
                animation: 'fadeSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
        >
            <div style={{ flexShrink: 0 }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
                <div style={{ color: '#1A1714', fontSize: '15px', fontWeight: 600, marginBottom: '2px', fontFamily: '"Geist", sans-serif' }}>
                    {toast.title}
                </div>
                {toast.subtitle && (
                    <div style={{ color: '#7A7368', fontSize: '13px', fontWeight: 400, fontFamily: '"Geist", sans-serif' }}>
                        {toast.subtitle}
                    </div>
                )}
            </div>
            <button
                onClick={onRemove}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#C4BAA8',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    );
};
