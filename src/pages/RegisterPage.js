import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

/* ─────────────────────────────────────────────────────────
   REGISTER PAGE  –  /register
   POST /api/auth/reg → { tenantName, userName, email, password }
───────────────────────────────────────────────────────── */
const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/dashboard';

    const [form, setForm] = useState({
        tenantName: '',
        userName: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    /* ── handlers ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: '' }));
        setApiError('');
    };

    const validate = () => {
        const errs = {};
        if (!form.tenantName.trim()) errs.tenantName = 'Company name is required';
        if (!form.userName.trim()) errs.userName = 'Your name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
        if (!form.password) {
            errs.password = 'Password is required';
        } else {
            if (form.password.length < 8) errs.password = 'Must be at least 8 characters';
            else if (!/[A-Z]/.test(form.password)) errs.password = 'Must include at least one uppercase letter';
            else if (!/[a-z]/.test(form.password)) errs.password = 'Must include at least one lowercase letter';
            else if (!/\d/.test(form.password)) errs.password = 'Must include at least one number';
            else if (!/[@$!%*?&]/.test(form.password)) errs.password = 'Must include at least one special character (@$!%*?&)';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        try {
            const res = await authAPI.register({
                tenantName: form.tenantName.trim(),
                userName: form.userName.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            // Backend returns { data: { email, token }, ... }
            const token = res.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                const user = { email: res.data?.data?.email || form.email, role: 'USER' };
                localStorage.setItem('user', JSON.stringify(user));
                navigate(decodeURIComponent(redirectTo));
            } else {
                // Fallback: go to login
                navigate('/login');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Gold radial glow */}
            <div style={styles.glow1} />
            <div style={styles.glow2} />

            {/* Back to home */}
            <Link to="/" style={styles.backLink}>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path d="M10 3L5 8l5 5" stroke="#C4BAA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to home
            </Link>

            {/* Card */}
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoRow}>
                    <div style={styles.logoMark}>
                        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                            <rect width="6" height="6" rx="1.5" fill="#1A1714" />
                            <rect x="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".5" />
                            <rect y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".5" />
                            <rect x="8" y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".85" />
                        </svg>
                    </div>
                    <span style={styles.logoText}>SubSphere</span>
                </div>

                <h1 style={styles.heading}>Start your free trial</h1>
                <p style={styles.subtext}>
                    14 days free. No credit card required.{' '}
                    <span style={{ color: 'var(--gold)' }}>API keys generated instantly.</span>
                </p>

                {/* API Error */}
                {apiError && (
                    <div style={styles.apiError}>{apiError}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <Field
                        label="Company Name"
                        name="tenantName"
                        placeholder="Your startup name"
                        value={form.tenantName}
                        onChange={handleChange}
                        error={errors.tenantName}
                    />
                    <Field
                        label="Your Name"
                        name="userName"
                        placeholder="Full name"
                        value={form.userName}
                        onChange={handleChange}
                        error={errors.userName}
                    />
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@startup.com"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <PasswordField
                        label="Password"
                        name="password"
                        placeholder="Min 8 chars · uppercase · number · symbol"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                        show={showPass}
                        onToggle={() => setShowPass((v) => !v)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1, cursor: loading ? 'wait' : 'pointer' }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#B8962C'; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--gold)'; }}
                    >
                        {loading ? 'Creating account…' : 'Create account & get API keys →'}
                    </button>
                </form>

                {/* Sign in link */}
                <p style={styles.switchText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.switchLink}>Sign in</Link>
                </p>

                {/* Info note */}
                <div style={styles.infoNote}>
                    <span style={{ fontSize: '15px' }}>🔑</span>
                    <span>After registration, you'll get your <strong style={{ color: 'var(--gold)' }}>Client ID</strong> and <strong style={{ color: 'var(--gold)' }}>Client Secret</strong> instantly in your Developer Console.</span>
                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ─── */
const Field = ({ label, name, type = 'text', placeholder, value, onChange, error }) => (
    <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            style={{
                ...styles.input,
                borderColor: error ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)',
            }}
            onFocus={(e) => { e.target.style.borderColor = error ? 'rgba(181,70,58,0.8)' : 'rgba(201,168,76,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)'; }}
        />
        {error && <div style={styles.fieldError}>{error}</div>}
    </div>
);

const PasswordField = ({ label, name, placeholder, value, onChange, error, show, onToggle }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={styles.label}>{label}</label>
        <div style={{ position: 'relative' }}>
            <input
                type={show ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    ...styles.input,
                    paddingRight: '48px',
                    borderColor: error ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => { e.target.style.borderColor = error ? 'rgba(181,70,58,0.8)' : 'rgba(201,168,76,0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)'; }}
            />
            <button
                type="button"
                onClick={onToggle}
                style={styles.eyeBtn}
                tabIndex={-1}
            >
                {show ? '🙈' : '👁️'}
            </button>
        </div>
        {error && <div style={styles.fieldError}>{error}</div>}
    </div>
);

/* ─── Styles ─── */
const styles = {
    page: {
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--ff-sans)',
    },
    glow1: {
        position: 'fixed',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    glow2: {
        position: 'fixed',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    backLink: {
        position: 'absolute',
        top: '28px',
        left: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--stone)',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--ff-sans)',
        transition: 'color 0.15s',
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px 40px 32px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
    },
    logoMark: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'var(--gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    logoText: {
        fontFamily: 'var(--ff-sans)',
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--white)',
        letterSpacing: '-0.3px',
    },
    heading: {
        fontFamily: 'var(--ff-serif)',
        fontSize: '28px',
        fontWeight: 400,
        color: 'var(--white)',
        letterSpacing: '-0.5px',
        marginBottom: '8px',
    },
    subtext: {
        fontSize: '14px',
        color: 'var(--stone)',
        marginBottom: '24px',
        lineHeight: 1.5,
    },
    apiError: {
        background: 'rgba(181,70,58,0.12)',
        border: '1px solid rgba(181,70,58,0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        color: '#E07070',
        fontSize: '13px',
        fontWeight: 500,
        marginBottom: '20px',
        lineHeight: 1.5,
    },
    label: {
        display: 'block',
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '7px',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '13px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'var(--white)',
        fontSize: '14px',
        fontFamily: 'var(--ff-sans)',
        outline: 'none',
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '2px 4px',
        opacity: 0.6,
    },
    fieldError: {
        color: '#E07070',
        fontSize: '12px',
        marginTop: '5px',
        fontWeight: 500,
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        background: 'var(--gold)',
        color: 'var(--ink)',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: 'var(--ff-sans)',
        cursor: 'pointer',
        transition: 'background 0.15s',
        letterSpacing: '0.2px',
        marginTop: '4px',
    },
    switchText: {
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--stone)',
        marginTop: '20px',
        fontFamily: 'var(--ff-sans)',
    },
    switchLink: {
        color: 'var(--gold)',
        textDecoration: 'none',
        fontWeight: 600,
    },
    infoNote: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        background: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: '10px',
        padding: '12px 16px',
        marginTop: '20px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.55,
    },
};

export default RegisterPage;
