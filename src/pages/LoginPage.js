import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
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
            background: '#F0F9FF', // Slightly more blue-tinted base
        }}>
            {/* SVG Noise Filter */}
            <svg style={{ visibility: 'hidden', position: 'absolute' }}>
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                </filter>
            </svg>

            {/* Grid Pattern Layer */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                zIndex: 1,
            }} />

            {/* Noise Overlay - More visible */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.05,
                filter: 'url(#noiseFilter)',
                zIndex: 4,
            }} />

            {/* Mesh Gradient Blobs - More Saturated */}
            <div style={{
                position: 'absolute',
                top: '-10%', left: '-5%',
                width: '65vw', height: '65vw',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
                filter: 'blur(70px)',
                borderRadius: '50%',
                animation: 'driftBlob 20s infinite alternate ease-in-out',
                zIndex: 2,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-15%', right: '-5%',
                width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)',
                filter: 'blur(90px)',
                borderRadius: '50%',
                animation: 'driftBlob 18s infinite alternate-reverse ease-in-out',
                zIndex: 2,
            }} />
            <div style={{
                position: 'absolute',
                top: '30%', right: '10%',
                width: '45vw', height: '45vw',
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
                borderRadius: '50%',
                animation: 'driftBlob 25s infinite alternate ease-in-out',
                zIndex: 2,
            }} />

            {/* Floating Abstract Geometry */}
            <FloatingGeometry delay="0s" size="400px" top="5%" left="2%" rotate="15deg" />
            <FloatingGeometry delay="7s" size="500px" bottom="2%" right="-5%" rotate="-15deg" />

            {/* Global glass layer - Slightly lighter to keep colors vibrant */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                zIndex: 3,
            }} />
        </div>
    );
};

const FloatingGeometry = ({ delay, size, top, left, right, bottom, rotate }) => (
    <div style={{
        position: 'absolute',
        top, left, right, bottom,
        width: size,
        height: size,
        border: '1px solid rgba(37, 99, 235, 0.05)',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        animation: `driftBlob 40s infinite linear ${delay}`,
        transform: `rotate(${rotate})`,
        zIndex: 3,
    }} />
);

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const toast = useToast();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: '', submit: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
        if (!form.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const result = await login(form.email.trim(), form.password);
            if (result.success) {
                toast.success('Login successful', 'Welcome back to Aegis Infra');
                const user = JSON.parse(localStorage.getItem('user'));
                if (user?.role === 'ROLE_SUPER_ADMIN') {
                    navigate('/super-admin');
                } else if (user?.role === 'ROLE_TENANT_ADMIN') {
                    navigate('/dashboard');
                } else {
                    navigate('/my-subscriptions');
                }
            } else {
                toast.error('Authentication failed', result.error || 'Please check your credentials.');
                const msg = result.error || '';
                if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('not exist')) {
                    setErrors({ email: msg });
                } else {
                    setErrors({ password: msg });
                }
            }
        } catch (err) {
            toast.error('Connection Error', 'An unexpected error occurred. Please try again.');
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
            overflow: 'hidden' // Ensure the background elements don't spill
        }}>
            <Navbar />
            <BackgroundElements />

            <div style={styles.page}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>Sign in</h1>
                    <p style={styles.subtext}>
                        New user? <Link to="/register" style={styles.switchLink}>Create an account</Link>
                    </p>

                    <form onSubmit={handleSubmit} noValidate style={{ marginTop: '32px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={styles.inputWrapper(errors.email)}>
                                <div style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    style={styles.inputField}
                                />
                            </div>
                            {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={styles.inputWrapper(errors.password)}>
                                <div style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    style={styles.inputField}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn} tabIndex={-1}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                            </div>
                            {errors.password && <div style={styles.fieldError}>{errors.password}</div>}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <Link to="#" style={styles.forgotLink}>Forgot password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div style={styles.dividerContainer}>
                        <div style={styles.line}></div>
                        <span style={styles.dividerText}>or</span>
                        <div style={styles.line}></div>
                    </div>

                    <p style={styles.socialPrompt}>Join With Your Favorite Social Media Account</p>

                    <div style={styles.socialRow}>
                        <button style={styles.socialBtn}><svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg></button>
                        <button style={styles.socialBtn}><svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" /></svg></button>
                        <button style={styles.socialBtn}><svg width="20" height="20" fill="#000000" viewBox="0 0 24 24"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.96L18.9 1.15zM17.61 20.65h2.04L6.48 3.24H4.32l11.29 17.41z" /></svg></button>
                        <button style={styles.socialBtn}><svg width="20" height="20" fill="#000000" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.253 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.89 3.67 2.01-3.24 1.95-2.73 5.92.59 7.35-.69 1.57-1.45 2.76-2.91 3.65zm-2.1-14.86c-.53.74-1.35 1.19-2.1 1.25-.13-1.01.37-2.07 1-2.78.61-.69 1.63-1.12 2.38-1.11.16.94-.3 1.94-.97 2.64z" /></svg></button>
                    </div>

                    <p style={styles.legalText}>
                        By signing in with an account, you agree to our<br />
                        <Link to="#" style={styles.legalLink}>Terms of Service</Link> and <Link to="#" style={styles.legalLink}>Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <Footer />
            </div>

            <style>{`
                @keyframes driftBlob {
                    0% { transform: scale(1) translate(0, 0); }
                    50% { transform: scale(1.1) translate(5%, 5%); }
                    100% { transform: scale(0.9) translate(-5%, -5%); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px 24px 80px',
        fontFamily: "var(--ff-sans)",
        position: 'relative',
        zIndex: 10,
        perspective: '1200px', // Added for 3D depth
    },
    card: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        width: '100%',
        maxWidth: '460px',
        padding: '48px 40px',
        borderRadius: '24px',
        boxShadow: '0 32px 64px -16px rgba(0,0,0,0.1), 0 16px 32px -8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        textAlign: 'left',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        transform: 'rotateX(5deg) rotateY(-2deg) translateZ(0)', // Subtle 3D tilt
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    },
    heading: {
        fontFamily: 'var(--ff-h)',
        fontSize: '28px', // Slightly reduced from 32px
        fontWeight: 700,
        color: '#111827',
        letterSpacing: '-1px',
        marginBottom: '4px',
    },
    subtext: {
        fontSize: '15px',
        color: '#6B7280',
        marginBottom: '20px',
    },
    switchLink: {
        color: 'var(--gold)',
        textDecoration: 'none',
        fontWeight: 600,
    },
    inputWrapper: (hasError) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        border: `1px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
        borderRadius: '12px',
        background: '#fff',
        height: '54px',
        transition: 'all 0.2s',
    }),
    inputIcon: {
        color: '#9CA3AF',
        marginRight: '12px',
        display: 'flex',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '15px',
        color: '#111827',
    },
    eyeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#9CA3AF',
        padding: '0 4px',
    },
    fieldError: {
        color: '#EF4444',
        fontSize: '12.5px',
        marginTop: '4px',
        fontWeight: 500,
    },
    forgotLink: {
        fontSize: '14px',
        color: 'var(--gold)',
        textDecoration: 'none',
        fontWeight: 500,
    },
    submitBtn: {
        width: '100%',
        height: '52px',
        background: 'rgba(15, 23, 42, 0.9)', // Deep slate with transparency
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#fff',
        borderRadius: '26px',
        fontSize: '16px',
        fontWeight: 600,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
    },
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '32px 0 24px',
    },
    line: {
        flex: 1,
        height: '1px',
        background: '#E5E7EB',
    },
    dividerText: {
        color: '#9CA3AF',
        fontSize: '13px',
        margin: '0 16px',
        fontWeight: 500,
    },
    socialPrompt: {
        textAlign: 'center',
        color: '#4B5563',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '20px',
    },
    socialRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
    },
    socialBtn: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '1px solid #E5E7EB',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    legalText: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#6B7280',
        marginTop: '60px',
        lineHeight: 1.6,
    },
    legalLink: {
        color: '#2563EB',
        textDecoration: 'none',
        fontWeight: 600,
    }
};

export default LoginPage;
