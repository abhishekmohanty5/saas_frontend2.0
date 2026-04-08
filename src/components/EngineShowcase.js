import React, { useState, useEffect, useRef } from 'react';

/**
 * ENGINE SHOWCASE
 * Restored to the 'Aegis Infra' style: Node Graph Visualizer + Live Terminal
 */

const EngineShowcase = () => {
    const [scene, setScene] = useState(0);
    const [terminalLines, setTerminalLines] = useState([]);
    const [responseCard, setResponseCard] = useState(null);
    const [stats, setStats] = useState({ nodes: 119, latency: 11, load: 35.8, throughput: 1.3 });
    const canvasRef = useRef(null);

    // ════════════════════════════════════════════
    // 1. LIVE STATS JITTER
    // ════════════════════════════════════════════
    useEffect(() => {
        const jitter = (v, d, lo, hi) => Math.max(lo, Math.min(hi, v + (Math.random() - 0.42) * d));
        const interval = setInterval(() => {
            setStats(prev => ({
                nodes: Math.round(jitter(prev.nodes, 5, 80, 200)),
                latency: Math.round(jitter(prev.latency, 2, 5, 30)),
                load: Number(jitter(prev.load, 3, 18, 85).toFixed(1)),
                throughput: Number(jitter(prev.throughput, 0.15, 0.7, 3.5).toFixed(1))
            }));
        }, 1300);
        return () => clearInterval(interval);
    }, []);

    // ════════════════════════════════════════════
    // 2. NODE GRAPH ANIMATION
    // ════════════════════════════════════════════
    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const cx = cv.getContext('2d');
        const parent = cv.parentElement;
        cv.width = parent.clientWidth;
        cv.height = parent.clientHeight;

        const NN = 32;
        const nodes = Array.from({ length: NN }, () => ({
            x: Math.random() * cv.width,
            y: Math.random() * cv.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1.2,
            pr: 0, pm: 0
        }));

        const pkts = [];
        const PKT_COLS = ['rgba(45,212,191,.9)', 'rgba(167,139,250,.9)', 'rgba(96,165,250,.9)', 'var(--gold)'];

        const spawnPkt = () => {
            let a = Math.floor(Math.random() * NN), b;
            do { b = Math.floor(Math.random() * NN); } while (b === a);
            pkts.push({ a, b, t: 0, spd: 0.014 + Math.random() * 0.014, col: PKT_COLS[pkts.length % PKT_COLS.length] });
        };

        const pktInterval = setInterval(spawnPkt, 320);
        const pulseInterval = setInterval(() => {
            const n = nodes[Math.floor(Math.random() * NN)];
            n.pr = 1; n.pm = Math.random() * 14 + 6;
        }, 550);

        let raf;
        const draw = () => {
            cx.clearRect(0, 0, cv.width, cv.height);
            // edges
            for (let i = 0; i < NN; i++) for (let j = i + 1; j < NN; j++) {
                const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                const d = Math.hypot(dx, dy);
                if (d < 88) {
                    cx.beginPath();
                    cx.strokeStyle = `rgba(37,99,235,${(1 - d / 88) * 0.3})`;
                    cx.lineWidth = 0.6;
                    cx.moveTo(nodes[i].x, nodes[i].y);
                    cx.lineTo(nodes[j].x, nodes[j].y);
                    cx.stroke();
                }
            }
            // nodes
            nodes.forEach(n => {
                if (n.pr > 0) {
                    const r = n.pm * (1 - n.pr);
                    cx.beginPath(); cx.arc(n.x, n.y, r, 0, Math.PI * 2);
                    cx.strokeStyle = `rgba(37,99,235,${n.pr * 0.7})`;
                    cx.lineWidth = 0.8; cx.stroke();
                    n.pr = Math.max(0, n.pr - 0.022);
                }
                const g = cx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
                g.addColorStop(0, '#2563EB'); g.addColorStop(1, 'transparent');
                cx.beginPath(); cx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                cx.fillStyle = g; cx.fill();
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > cv.width) n.vx *= -1;
                if (n.y < 0 || n.y > cv.height) n.vy *= -1;
            });
            // packets
            for (let i = pkts.length - 1; i >= 0; i--) {
                const p = pkts[i], a = nodes[p.a], b = nodes[p.b];
                const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
                cx.beginPath(); cx.arc(x, y, 2.2, 0, Math.PI * 2);
                cx.fillStyle = p.col; cx.shadowColor = p.col; cx.shadowBlur = 8;
                cx.fill(); cx.shadowBlur = 0;
                p.t += p.spd;
                if (p.t >= 1) { nodes[p.b].pr = 1; nodes[p.b].pm = 8; pkts.splice(i, 1); }
            }
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            clearInterval(pktInterval);
            clearInterval(pulseInterval);
            cancelAnimationFrame(raf);
        };
    }, []);

    // ════════════════════════════════════════════
    // 3. TERMINAL ENGINE LOGIC
    // ════════════════════════════════════════════
    useEffect(() => {
        let isMounted = true;
        const addL = async (type, method, path, val, colorClass, ms) => {
            if (!isMounted) return;
            await new Promise(r => setTimeout(r, ms));
            setTerminalLines(prev => [...prev.slice(-12), { type, method, path, val, colorClass }]);
        };

        const addCard = async (card, ms) => {
            if (!isMounted) return;
            await new Promise(r => setTimeout(r, ms));
            setResponseCard(card);
        };

        const playScene = async () => {
            // Scene 0: Secure Auth
            if (scene === 0) {
                setTerminalLines([]); setResponseCard(null);
                await addL('line', 'POST', '/api/v1/auth/login', '', 'dim', 0);
                await addL('line', '·', 'Authenticating Secure Handshake...', '', 'dim', 140);
                await addL('line', '⟳', 'Bcrypt.verify() → PBKDF2 Salting', '', 'purple', 180);
                await addL('line', '✓', 'Identity Confirmed: SUPER_ADMIN', '', 'ok', 330);
                await addL('line', '→', 'Generating AES-256 JWT Token', '', '', 210);
                await addCard({
                    type: 'auth',
                    header: '🔐 SECURE BACKEND AUTH · 112ms',
                    rows: [
                        { k: 'Auth Status', v: 'SUCCESS', vc: 'ok' },
                        { k: 'Role Assigned', v: 'ADMIN_TRUSTED', vc: 'gold' },
                        { k: 'Encryption', v: 'AES-256-GCM', vc: 'ok' }
                    ]
                }, 700);
            }
            // Scene 1: Analytics
            else if (scene === 1) {
                setTerminalLines([]); setResponseCard(null);
                await addL('line', 'GET', '/api/v1/ai/analytics', '', 'dim', 0);
                await addL('line', '⟳', 'ApiKeyInterceptor → validating...', '', 'dim', 180);
                await addL('line', '✓', 'Tenant: "TechFlow SaaS" | PRO', '', 'ok', 380);
                await addL('line', '·', 'AI Gemini thinking', '...', 'purple', 410);
                await addCard({
                    type: 'analytics',
                    header: '📊 ANALYTICS ENGINE · 143ms',
                    rows: [
                        { k: 'Active Subs', v: '198 units', vc: 'ok' },
                        { k: 'Retention Rate', v: '94.2%', vc: 'gold' },
                        { k: 'Revenue Prediction', v: '+$12k/mo', vc: 'purple' }
                    ]
                }, 700);
            }
            // Scene 2: Churn Prediction
            else if (scene === 2) {
                setTerminalLines([]); setResponseCard(null);
                await addL('line', 'GET', '/api/v1/ai/predict-churn/882', '', 'dim', 0);
                await addL('line', '✓', 'user: marcus@techflow.io', '', 'ok', 330);
                await addL('line', '·', 'AI Gemini predicting churn', '...', 'purple', 410);
                await addCard({
                    type: 'churn',
                    header: '⚡ RISK PREDICTION · 321ms',
                    rows: [
                        { k: 'Churn Probability', v: 'LOW', vc: 'ok' },
                        { k: 'Confidence', v: '98.5%', vc: 'ok' },
                        { k: 'Prevention', v: 'Active', vc: 'gold' }
                    ]
                }, 900);
            }

            setTimeout(() => { if (isMounted) setScene(prev => (prev + 1) % 3); }, 6000);
        };

        playScene();
        return () => { isMounted = false; };
    }, [scene]);

    return (
        <section id="engine-showcase" className="engine-showcase-section" style={{
            background: 'var(--white)',
            padding: '120px 48px',
            minHeight: '800px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid var(--sand)'
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: `
                    radial-gradient(ellipse 60% 50% at 20% 50%, rgba(37,99,235,0.05) 0%, transparent 60%),
                    radial-gradient(ellipse 40% 60% at 80% 30%, rgba(96,165,250,0.03) 0%, transparent 50%)
                `,
                pointerEvents: 'none'
            }} />

            <div className="engine-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 1fr) 450px', gap: '80px', maxWidth: '1280px', width: '100%', alignItems: 'center', position: 'relative', zIndex: 1 }}>

                {/* ══ LEFT: THE SHOWCASE SCREEN ══════════════ */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute', inset: '-40px',
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 65%)',
                        animation: 'ambientPulse 4s ease-in-out infinite',
                        pointerEvents: 'none'
                    }} />

                    <div style={{
                        width: '100%', aspectRatio: '16/10', background: '#0C0F18', borderRadius: '16px',
                        border: '1px solid rgba(37,99,235,0.22)', overflow: 'hidden', position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(37,99,235,0.12)'
                    }}>
                        {/* Brackets */}
                        <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '1.5px solid var(--gold)', borderLeft: '1.5px solid var(--gold)' }} />
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: '1.5px solid var(--gold)', borderRight: '1.5px solid var(--gold)' }} />
                        <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: '1.5px solid var(--gold)', borderLeft: '1.5px solid var(--gold)' }} />
                        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '1.5px solid var(--gold)', borderRight: '1.5px solid var(--gold)' }} />

                        {/* Screen Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(37,99,235,0.22)', background: 'rgba(37,99,235,0.03)' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4BF', boxShadow: '0 0 6px #2DD4BF', animation: 'blink 1.4s infinite' }} />
                                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', fontWeight: 600 }}>AEGIS. CORE RUNTIME</span>
                            </div>
                            <span style={{ fontSize: '9px', color: '#475569', fontFamily: 'var(--ff-mono)' }}>NODE_CLUSTER: ASIA_EXT_01</span>
                        </div>

                        {/* Scene tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(37,99,235,0.22)' }}>
                            {['🔐 SECURE LOGIN', '📊 AI ANALYTICS', '⚡ CHURN PREDICT'].map((tab, i) => (
                                <div key={i} style={{
                                    flex: 1, padding: '8px 4px', fontSize: '8px', textAlign: 'center', fontFamily: 'var(--ff-mono)',
                                    color: scene === i ? 'var(--gold)' : '#475569',
                                    background: scene === i ? 'rgba(37,99,235,0.06)' : 'transparent',
                                    borderRight: i < 2 ? '1px solid rgba(37,99,235,0.22)' : 'none',
                                    position: 'relative',
                                    fontWeight: scene === i ? 700 : 400
                                }}>
                                    {tab}
                                    {scene === i && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />}
                                </div>
                            ))}
                        </div>

                        {/* Screen Body */}
                        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                            <div style={{ width: '190px', borderRight: '1px solid rgba(37,99,235,0.22)', position: 'relative' }}>
                                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
                            </div>
                            <div style={{ flex: 1, padding: '12px', fontFamily: 'var(--ff-mono)', fontSize: '10px', overflow: 'hidden' }}>
                                {terminalLines.map((line, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', animation: 'fadeInUp 0.3s forwards' }}>
                                        <span style={{ color: 'var(--gold)', opacity: 0.5 }}>{line.method === '·' ? '·' : '>'}</span>
                                        <span style={{ color: line.colorClass === 'ok' ? '#2DD4BF' : line.colorClass === 'purple' ? '#A78BFA' : '#475569', fontWeight: 700 }}>{line.method}</span>
                                        <span style={{ color: '#CBD5E1' }}>{line.path}</span>
                                        <span style={{ color: '#A78BFA' }}>{line.val}</span>
                                    </div>
                                ))}
                                {responseCard && (
                                    <div style={{
                                        marginTop: '10px', padding: '10px', background: 'rgba(37,99,235,0.04)',
                                        border: '1px solid rgba(37,99,235,0.16)', borderLeft: '3px solid var(--gold)',
                                        borderRadius: '4px', animation: 'fadeInUp 0.5s forwards'
                                    }}>
                                        <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: 800, marginBottom: '6px' }}>{responseCard.header}</div>
                                        {responseCard.rows.map((row, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '3px' }}>
                                                <span style={{ color: row.vc === 'gold' ? 'var(--gold)' : row.vc === 'blue' ? '#60A5FA' : '#475569' }}>{row.k}</span>
                                                <span style={{ color: row.vc === 'ok' ? '#2DD4BF' : '#CBD5E1' }}>{row.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div style={{ display: 'flex', borderTop: '1px solid rgba(37,99,235,0.22)' }}>
                            <StatBox label="NODES" val={stats.nodes} barW="62%" />
                            <StatBox label="LATENCY" val={`${stats.latency}ms`} barW="20%" />
                            <StatBox label="AI LOAD" val={`${stats.load}%`} barW={`${stats.load}%`} />
                            <StatBox label="TRAFFIC" val={`${stats.throughput}GB`} barW="72%" />
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT: COPY ════════════════════════════ */}
                <div style={{ animation: 'fadeInRight 0.8s ease' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gold-dim)',
                        border: '1px solid rgba(37,99,235,0.2)', borderRadius: '100px', padding: '6px 16px',
                        fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--gold)', marginBottom: '32px'
                    }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', animation: 'blink 1.4s infinite' }} />
                        INFRASTRUCTURE INTELLIGENCE
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--ff-serif)', fontSize: 'clamp(36px, 4.5vw, 60px)',
                        fontWeight: 700, lineHeight: 1.05, color: 'var(--ink)', marginBottom: '24px', letterSpacing: '-2px'
                    }}>
                        Built for <br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Infinite Scale.</span>
                    </h2>

                    <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--stone)', maxWidth: '400px', marginBottom: '40px' }}>
                        Real-time data visualization of the <strong style={{ color: 'var(--ink)' }}>SubSphere engine</strong>.
                        Our AI doesn't just process code—it maps every journey through billions of data nodes in <strong style={{ color: 'var(--ink)' }}>milliseconds</strong>.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px' }}>
                        <Pill icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} title="Secure Identity Gateway" desc="BCrypt + AES-256 Multi-Layer Auth" color="#2DD4BF" />
                        <Pill icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>} title="AI Predictive Analytics" desc="Gemini-Powered Retention Modeling" color="#A78BFA" />
                        <Pill icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>} title="High-Velocity Throughput" desc="Node-Cluster Logic Execution" color="#FBBF24" />
                    </div>

                    <div style={{ display: 'flex', gap: '48px' }}>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)' }}>{stats.load}%</div>
                            <div style={{ fontSize: '9px', color: 'var(--stone)', letterSpacing: '2px', fontWeight: 800 }}>AI LOGIC LOAD</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)' }}>{stats.throughput}GB</div>
                            <div style={{ fontSize: '9px', color: 'var(--stone)', letterSpacing: '2px', fontWeight: 800 }}>THROUGHPUT</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ambientPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @media (max-width: 960px) {
                    .engine-showcase-section { padding: 80px 20px !important; }
                    .engine-grid { gridTemplateColumns: 1fr !important; gap: 48px !important; }
                    .engine-grid > div:first-child { min-width: 0 !important; }
                }
            `}</style>
        </section>
    );
};

const StatBox = ({ label, val, barW }) => (
    <div style={{ flex: 1, padding: '10px 14px', borderRight: '1px solid rgba(37,99,235,0.22)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: '7px', color: '#475569', letterSpacing: '1.5px', marginBottom: '2px', fontWeight: 800 }}>{label}</div>
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '1.5px', background: 'var(--gold)', opacity: 0.4, width: barW, transition: 'width 1.2s' }} />
    </div>
);

const Pill = ({ icon, title, desc, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
            width: '38px', height: '38px', borderRadius: '10px', background: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.06)', fontSize: '18px',
            flexShrink: 0
        }}>{icon}</div>
        <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
            <div style={{ fontSize: '11px', color: 'var(--stone)', fontFamily: 'var(--ff-mono)' }}>{desc}</div>
        </div>
    </div>
);

export default EngineShowcase;
