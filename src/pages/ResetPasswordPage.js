import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../components/ToastProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [token, setToken] = useState(null);
    const [isValidToken, setIsValidToken] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            validateToken(tokenFromUrl);
        } else {
            setCheckingToken(false);
            toast.error('Invalid link', 'No reset token was found in the URL.');
        }
    }, [location]);

    const validateToken = async (t) => {
        try {
            await authAPI.validateResetToken(t);
            setIsValidToken(true);
        } catch (err) {
            toast.error('Expired or Invalid', 'This password reset link is invalid or has expired.');
        } finally {
            setCheckingToken(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword.length < 8) {
            toast.error('Validation Error', 'Password must be at least 8 characters long.');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            toast.error('Validation Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await authAPI.resetPassword({
                token,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword
            });
            toast.success('Password Reset', 'Your password has been successfully updated. Please sign in.');
            navigate('/login');
        } catch (err) {
            toast.error('Error', err.response?.data?.message || 'Could not reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingToken) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
                <div className="loader" style={{ fontSize: '18px', color: 'var(--muted)', fontWeight: 600 }}>Verifying reset token...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <Navbar />
            <div style={styles.page}>
                <div style={styles.card}>
                    {isValidToken ? (
                        <>
                            <h1 style={styles.heading}>Set new password</h1>
                            <p style={styles.subtext}>
                                Please enter your new password below. Ensure it's secure and at least 8 characters long.
                            </p>

                            <form onSubmit={handleSubmit} noValidate style={{ marginTop: '32px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={styles.inputWrapper}>
                                        <div style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </div>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="New Password"
                                            value={form.newPassword}
                                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                            style={styles.inputField}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <div style={styles.inputWrapper}>
                                        <div style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </div>
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            value={form.confirmPassword}
                                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                            style={styles.inputField}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setShowPass(!showPass)}>
                                    <input type="checkbox" checked={showPass} readOnly />
                                    <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Show password</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
                                >
                                    {loading ? 'Updating...' : 'Update password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={styles.errorIcon}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            </div>
                            <h1 style={styles.heading}>Link expired</h1>
                            <p style={styles.subtext}>
                                This password reset link is no longer valid. For security purposes, reset links expire after a short period.
                            </p>
                            <button 
                                onClick={() => navigate('/forgot-password')}
                                style={{ ...styles.submitBtn, marginTop: '24px' }}
                            >
                                Request new link
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    page: {
        width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 24px 60px', position: 'relative'
    },
    card: {
        background: 'var(--surface)', width: '100%', maxWidth: '480px', padding: '48px 52px', borderRadius: '32px', boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--border)', textAlign: 'left'
    },
    heading: {
        fontSize: '32px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-1.5px', marginBottom: '12px'
    },
    subtext: {
        fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6
    },
    inputWrapper: {
        display: 'flex', alignItems: 'center', padding: '0 20px', border: '1px solid var(--border)', borderRadius: '16px', background: 'var(--bg)', height: '56px'
    },
    inputField: {
        flex: 1, height: '100%', border: 'none', outline: 'none', fontSize: '16px', fontWeight: '500', color: 'var(--ink)', background: 'transparent'
    },
    inputIcon: {
        color: 'var(--muted)', marginRight: '12px', display: 'flex'
    },
    submitBtn: {
        width: '100%', height: '56px', background: 'var(--ink)', color: 'var(--bg)', borderRadius: '32px', fontSize: '18px', fontWeight: 700, border: 'none', cursor: 'pointer'
    },
    errorIcon: {
        marginBottom: '24px', display: 'flex', justifyContent: 'center'
    }
};

export default ResetPasswordPage;
