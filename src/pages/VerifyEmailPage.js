import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VerifyEmailPage = () => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. Missing token.');
            return;
        }

        const verify = async () => {
            try {
                const res = await authAPI.verifyEmail(token);
                setStatus('success');
                setMessage(res.data?.message || 'Your email has been successfully verified! You can now log in.');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
            }
        };

        verify();
    }, [location]);

    return (
        <div style={styles.container}>
            <Navbar />
            
            <div style={styles.content}>
                <div style={styles.card}>
                    {status === 'verifying' && (
                        <div style={styles.inner}>
                            <div className="spinner" style={styles.spinner}></div>
                            <h2 style={styles.h2}>Verifying your email</h2>
                            <p style={styles.p}>Please wait while we confirm your account...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={styles.inner}>
                            <div style={styles.iconSuccess}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h2 style={styles.h2}>Email Verified!</h2>
                            <p style={styles.p}>{message}</p>
                            <Link to="/login" style={styles.button}>Sign In to Your Account</Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={styles.inner}>
                            <div style={styles.iconError}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </div>
                            <h2 style={styles.h2}>Verification Failed</h2>
                            <p style={styles.p}>{message}</p>
                            <div style={styles.actions}>
                                <Link to="/register" style={styles.link}>Try registering again</Link>
                                <span style={{color: 'var(--muted)', margin: '0 8px'}}>•</span>
                                <Link to="/login" style={styles.link}>Go to Login</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(59, 130, 246, 0.2);
                    border-radius: 50%;
                    border-top-color: #3b82f6;
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 20px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
    },
    content: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
    },
    card: {
        background: 'var(--surface)',
        width: '100%',
        maxWidth: '450px',
        padding: '50px 40px',
        borderRadius: '32px',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--border)',
        textAlign: 'center',
    },
    inner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    h2: {
        fontSize: '28px',
        fontWeight: 800,
        color: 'var(--ink)',
        marginBottom: '12px',
        letterSpacing: '-1px',
    },
    p: {
        fontSize: '16px',
        color: 'var(--muted)',
        lineHeight: 1.6,
        marginBottom: '30px',
    },
    iconSuccess: {
        width: '64px',
        height: '64px',
        background: 'rgba(34, 197, 94, 0.1)',
        color: '#22c55e',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    iconError: {
        width: '64px',
        height: '64px',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    button: {
        display: 'inline-block',
        padding: '14px 28px',
        background: 'var(--ink)',
        color: 'var(--bg)',
        borderRadius: '16px',
        fontWeight: 700,
        textDecoration: 'none',
        transition: 'all 0.2s',
    },
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '14px',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
    }
};

export default VerifyEmailPage;
