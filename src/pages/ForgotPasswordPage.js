import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../components/ToastProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BackgroundElements = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
            pointerEvents: 'none',
            background: 'var(--bg)', 
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                zIndex: 1,
            }} />
        </div>
    );
};

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Validation Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            await authAPI.forgotPassword(email.trim());
            setSubmitted(true);
            toast.success('Request Sent', 'If an account exists for this email, you will receive reset instructions shortly.');
        } catch (err) {
            toast.error('Error', err.response?.data?.message || 'Could not process your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Navbar />
            <BackgroundElements />

            <div style={styles.page}>
                <div style={styles.card}>
                    {!submitted ? (
                        <>
                            <h1 style={styles.heading}>Reset password</h1>
                            <p style={styles.subtext}>
                                Enter the email address associated with your account and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} noValidate style={{ marginTop: '32px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={styles.inputWrapper}>
                                        <div style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            style={styles.inputField}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
                                >
                                    {loading ? 'Sending link...' : 'Send reset link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={styles.successIcon}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <h1 style={styles.heading}>Check your email</h1>
                            <p style={styles.subtext}>
                                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                style={{ ...styles.submitBtn, marginTop: '24px' }}
                            >
                                Back to login
                            </button>
                        </div>
                    )}

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <Link to="/login" style={styles.backLink}>
                            &larr; Back to sign in
                        </Link>
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <Footer />
            </div>
        </div>
    );
};

const styles = {
    page: {
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 24px 60px',
        fontFamily: "Inter, sans-serif",
        position: 'relative',
        zIndex: 10,
    },
    card: {
        background: 'var(--surface)',
        width: '100%',
        maxWidth: '480px',
        padding: '48px 52px',
        borderRadius: '32px',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--border)',
        textAlign: 'left',
        position: 'relative',
        zIndex: 5,
    },
    heading: {
        fontSize: '32px',
        fontWeight: 800,
        color: 'var(--ink)',
        letterSpacing: '-1.5px',
        marginBottom: '12px',
    },
    subtext: {
        fontSize: '15px',
        color: 'var(--muted)',
        lineHeight: 1.6,
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        background: 'var(--bg)',
        height: '56px',
        overflow: 'hidden',
    },
    inputIcon: {
        color: 'var(--muted)',
        marginRight: '12px',
        display: 'flex',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        fontWeight: '500',
        color: 'var(--ink)',
        background: 'transparent',
    },
    submitBtn: {
        width: '100%',
        height: '56px',
        background: 'var(--ink)',
        color: 'var(--bg)',
        borderRadius: '32px',
        fontSize: '18px',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
    backLink: {
        fontSize: '14px',
        color: 'var(--muted)',
        textDecoration: 'none',
        fontWeight: 600,
    },
    successIcon: {
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'center'
    }
};

export default ForgotPasswordPage;
