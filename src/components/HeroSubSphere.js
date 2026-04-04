import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSubSphere = () => {
    const navigate = useNavigate();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * -30;
        setTilt({ x, y });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToHowItWorks = () => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            zIndex: 1,
            background: 'var(--white)',
            perspective: '2000px'
        }}>
            {/* 1. Digital Rain - Neural Data Streams */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -4, opacity: 0.5 }}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: '-10%',
                        left: `${i * 7}%`,
                        width: '1px',
                        height: '120%',
                        background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.3), transparent)',
                        animation: `digitalRain ${3 + Math.random() * 5}s infinite linear`,
                        animationDelay: `${Math.random() * 5}s`,
                        filter: 'blur(0.3px)'
                    }} />
                ))}
            </div>

            {/* 2. Central Neon Kinetic Core (Preserved Circles) */}

            {/* ═ HYPER-3D BACKGROUND FIELD ═ */}

            {/* Liquid Mesh Gradient Aura */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '120%', height: '120%',
                background: `
                    radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 70% 70%, rgba(162, 89, 255, 0.05) 0%, transparent 50%)
                `,
                transform: `translate(-50%, -50%) translate3d(${tilt.x * -0.5}px, ${tilt.y * -0.5}px, -100px)`,
                filter: 'blur(100px)',
                zIndex: -3,
                pointerEvents: 'none'
            }} />

            {/* Deep Perspective Grid Layer */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '300%', height: '300%',
                background: `
                    linear-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '150px 150px',
                transform: `translate(-50%, -50%) rotateX(80deg) translateZ(-500px) translateY(${tilt.y * 2}px)`,
                opacity: 0.35,
                maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                zIndex: -2,
                pointerEvents: 'none'
            }} />

            {/* ═ THE AEGIS SPATIAL GLOBE (Pure CSS 3D - Setup for Perf) ═ */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                /* Drastically simplified parallax - translation is much faster than 3D rotation */
                transform: `translate(-50%, -50%) translate3d(${tilt.x * -0.5}px, ${tilt.y * -0.5}px, 0)`,
                width: '800px', height: '800px',
                zIndex: -2,
                pointerEvents: 'none',
                /* Removed expensive perspective here, keeping it flat but parallaxed */
                transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                willChange: 'transform' // Hardware acceleration hint
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    animation: 'slowRotateGlobe 60s linear infinite', /* Further slowed down to reduce frame updates */
                    willChange: 'transform'
                }}>
                    {/* Inner Core Glow - Kept simple radial blur */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: '300px', height: '300px',
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 60%)',
                        filter: 'blur(40px)',
                        borderRadius: '50%',
                        willChange: 'transform',
                    }} />

                    {/* 
                        PERFORMANCE HACK: Replace 24 expensive 3D CSS nodes with a single SVG!
                        SVGs are hardware accelerated differently and handle many paths much better 
                        than the DOM handles many deeply nested 3D intersecting divs.
                    */}
                    <svg width="100%" height="100%" viewBox="-400 -400 800 800" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(14,165,233,0.3)" />
                                <stop offset="100%" stopColor="rgba(14,165,233,0.05)" />
                            </linearGradient>
                        </defs>

                        {/* Meridians (Vertical Ellipses) */}
                        {[...Array(6)].map((_, i) => ( // Reduced to 6 for perf
                            <ellipse
                                key={`m-${i}`}
                                cx="0" cy="0"
                                rx="400" ry="400"
                                fill="none"
                                stroke="url(#globeGrad)"
                                strokeWidth="1"
                                transform={`rotate(${i * 30}) scale(${Math.cos(i * 30 * Math.PI / 180)}, 1)`}
                            />
                        ))}

                        {/* Parallels (Horizontal Ellipses) */}
                        {[...Array(9)].map((_, i) => { // Reduced to 9 for perf
                            const index = i - 4;
                            const yPosition = index * 80;
                            const r = 400;
                            if (Math.abs(yPosition) >= r) return null;
                            const rx = Math.sqrt(r * r - yPosition * yPosition);
                            const ry = rx * 0.3; // Simulate 3D tilt

                            return (
                                <ellipse
                                    key={`p-${i}`}
                                    cx="0" cy={yPosition}
                                    rx={rx} ry={ry}
                                    fill="none"
                                    stroke="url(#globeGrad)"
                                    strokeWidth="1"
                                />
                            );
                        })}
                    </svg>

                    {/* Orbiting Quantum Data Nodes - Reduced count for perf */}
                    {[...Array(8)].map((_, i) => (
                        <div key={`n-${i}`} style={{
                            position: 'absolute', inset: 0,
                            animation: `slowRotateGlobe ${15 + i * 2}s linear infinite`,
                            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                            willChange: 'transform'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                width: '6px', height: '6px',
                                background: i % 3 === 0 ? 'var(--gold)' : '#0EA5E9',
                                boxShadow: `0 0 15px ${i % 3 === 0 ? 'var(--gold)' : '#0EA5E9'}`, /* Single box-shadow instead of triple */
                                borderRadius: '50%',
                                /* Used 2D transforms to simulate 3D orbit */
                                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-380px)`,
                                willChange: 'transform'
                            }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Display */}
            <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'var(--badge-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--badge-border)',
                    borderRadius: '100px',
                    padding: '10px 24px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--gold)',
                    marginBottom: '40px',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    animation: 'fadeSlideUp 0.8s ease both'
                }}>
                    <span style={{ width: 8, height: 8, background: 'var(--emerald2)', borderRadius: '50%', boxShadow: '0 0 15px var(--emerald2)' }} />
                    Engineering the Infrastructure Future
                </div>

                <h1 style={{
                    fontFamily: 'var(--ff-h)',
                    fontSize: 'clamp(42px, 6.5vw, 76px)',
                    lineHeight: 1.05,
                    letterSpacing: '-3px',
                    color: 'var(--ink)',
                    fontWeight: 900,
                    marginBottom: '28px',
                    animation: 'fadeSlideUp 0.8s 0.1s ease both',
                }}>
                    Architecture for <br />
                    <span style={{
                        background: 'linear-gradient(135deg, var(--gold) 0%, #0EA5E9 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Modern Stability.</span>
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: 'var(--stone)',
                    lineHeight: 1.6,
                    maxWidth: '540px',
                    margin: '0 auto 60px',
                    fontWeight: 450,
                    animation: 'fadeSlideUp 0.8s 0.2s ease both'
                }}>
                    Aegis is the high-velocity core powering the next generation of SaaS.
                    Unified auth and subscription lifecycles in one spatial engine.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '32px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: 'fadeSlideUp 0.8s 0.3s ease both'
                }}>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'var(--ink)',
                            color: 'var(--btn-primary-text)',
                            fontSize: '15px',
                            fontWeight: 800,
                            padding: '18px 48px',
                            borderRadius: '100px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Initialize Engine
                    </button>

                    <button
                        onClick={scrollToHowItWorks}
                        style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: 'var(--ink)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink)'}
                    >
                        Blueprint
                        <div style={{ width: 32, height: 1.5, background: 'currentColor', opacity: 0.3 }} />
                    </button>
                </div>
            </div>

            {/* ═ PREMIUM GLASSMORPHIC ACCENTS ═ */}
            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1
            }}>
                <FloatingGlassBadge
                    top="15%" right="10%"
                    label="SYS: OPTIMAL"
                    iconColor="var(--emerald2)"
                    tilt={tilt} delay="0s"
                />

                <FloatingGlassBadge
                    bottom="20%" left="12%"
                    label="LATENCY: 12ms"
                    iconColor="#0EA5E9"
                    tilt={tilt} delay="0.5s"
                />
            </div>

            <style>{`
                @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes digitalRain { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(100vh); opacity: 0; } }
                @keyframes slowRotateGlobe {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes floatGlass {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
        </section>
    );
};

const FloatingGlassBadge = ({ top, bottom, left, right, label, iconColor, tilt, delay }) => (
    <div style={{
        position: 'absolute', top, bottom, left, right,
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '100px',
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.05), var(--glass-shadow-inner)`,
        /* Parallax + Float */
        transform: `translate3d(${tilt.x * 0.2}px, ${tilt.y * 0.2}px, 0)`,
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        animation: `floatGlass 6s infinite alternate ease-in-out ${delay}`,
    }}>
        <div style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: iconColor,
            boxShadow: `0 0 10px ${iconColor}`
        }} />
        <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--ink)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
        }}>
            {label}
        </span>
    </div>
);

export default HeroSubSphere;
