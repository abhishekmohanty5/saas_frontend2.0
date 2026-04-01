import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';
import Navbar from '../components/Navbar';
import ApiCredentialsSection from '../components/ApiCredentialsSection';
import { useToast } from '../components/ToastProvider';
import api, { aiAPI } from '../services/api';

// ─── ICONS (SVG inline) ───────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "#64748b" }) => {
  const icons = {
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    chart: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// Simple Sparkline Mockup
const Sparkline = ({ color }) => (
  <svg width="100" height="40" viewBox="0 0 80 30" style={{
    opacity: 0.9,
    filter: `drop-shadow(0 0 8px ${color}66)`
  }}>
    <defs>
      <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 25 L10 20 L20 23 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8"
      fill={`url(#grad-${color.replace('#', '')})`}
      style={{ transition: 'all 0.5s ease' }}
    />
    <path
      d="M0 25 L10 20 L20 23 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: `drop-shadow(0 0 10px ${color})`,
        strokeDasharray: '200',
        strokeDashoffset: '0',
        animation: 'drawPath 3s linear infinite'
      }}
    />
  </svg>
);
// ─── CENTRAL TELEMETRY COMPONENTS ──────────────────────────────────────────


function TelemetryUnit({ dashboard }) {
  const [flowIdx, setFlowIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [phase, setPhase] = useState("typing");
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const flow = FLOWS[flowIdx];

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      // Direct, instant scroll for better anchoring during live typing
      el.scrollTop = el.scrollHeight;

      // Secondary safety check for DOM settling
      const timeout = setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [visibleSteps, lineIdx]); // Anchored to line changes for maximum stability

  useEffect(() => {
    clearTimeout(timerRef.current);
    const currentStep = flow.steps[stepIdx];
    if (!currentStep) return;
    const currentLines = currentStep.lines;
    const currentLine = currentLines[lineIdx];
    if (!currentLine) return;

    const fullText = currentLine.tokens.map(t => t.t).join("");

    if (phase === "typing") {
      if (charIdx < fullText.length) {
        timerRef.current = setTimeout(() => setCharIdx(c => c + 1), 35);
      } else {
        timerRef.current = setTimeout(() => setPhase("next_line"), 150);
      }
    } else if (phase === "next_line") {
      if (lineIdx + 1 < currentLines.length) {
        setLineIdx(l => l + 1);
        setCharIdx(0);
        setPhase("typing");
      } else {
        setVisibleSteps(prev => {
          const existing = prev.filter(s => s.stepIdx !== stepIdx || s.flowIdx !== flowIdx);
          return [...existing, { flowIdx, stepIdx, lines: currentLines, step: currentStep, done: true }];
        });
        timerRef.current = setTimeout(() => setPhase("next_step"), 1200);
      }
    } else if (phase === "next_step") {
      if (stepIdx + 1 < flow.steps.length) {
        setStepIdx(s => s + 1);
        setLineIdx(0);
        setCharIdx(0);
        setPhase("typing");
      } else {
        timerRef.current = setTimeout(() => setPhase("next_flow"), 3000);
      }
    } else if (phase === "next_flow") {
      const nextFlow = (flowIdx + 1) % FLOWS.length;
      setFlowIdx(nextFlow);
      setStepIdx(0);
      setLineIdx(0);
      setCharIdx(0);
      setVisibleSteps([]);
      setPhase("typing");
    }
  }, [phase, charIdx, lineIdx, stepIdx, flowIdx]);

  const buildTypingLine = (line, charCount) => {
    let remaining = charCount;
    return line.tokens.map((tok, ti) => {
      if (remaining <= 0) return null;
      let textToUse = tok.t;
      if (tok.t === '"sb_c7daee5c65bb48fc"' && dashboard?.clientId) {
        textToUse = `"${dashboard.clientId}"`;
      }
      const slice = textToUse.slice(0, remaining);
      remaining -= textToUse.length;
      return <span key={ti} style={{ color: tok.c }}>{slice}</span>;
    });
  };

  const currentStep = flow.steps[stepIdx];
  const sideLabel = (side) => ({
    request: { text: "#60a5fa", dot: "#3b82f6" },
    engine: { text: "#4ade80", dot: "#22c55e" },
    response: { text: "#c084fc", dot: "#a855f7" },
  }[side] || { text: "#94a3b8", dot: "#64748b" });

  return (
    <div className="telemetry-unit-container" style={{
      perspective: '1500px',
      marginBottom: 64
    }}>
      <style>{`
        .telemetry-3d-card {
          background: #07070a;
          border-radius: 12px;
          border: 1px solid #10b981;
          box-shadow: 
            0 40px 100px -20px rgba(0, 0, 0, 0.9),
            0 0 30px rgba(16, 185, 129, 0.1);
          position: relative;
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        .telemetry-unit-container:hover .telemetry-3d-card {
          transform: rotateX(1deg) rotateY(-0.5deg) translateY(-2px);
        }
        .terminal-scroll {
          scroll-behavior: smooth;
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: #10b98144; border-radius: 2px; }
        .line-num { color: #2d3748; user-select: none; margin-right: 18px; font-size: 11px; width: 24px; display: inline-block; text-align: right; }
        .cursor { display: inline-block; width: 2px; height: 13px; background: #e2e8f0; margin-left: 2px; vertical-align: middle; animation: blink .8s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>

      <div className="telemetry-3d-card">
        {/* IDE Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#161b22', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "var(--ff-mono)" }}>
            STREAMING_RESPONSE.JSON
          </div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>
            {flow.method} {flow.endpoint}
          </div>
        </div>

        {/* IDE Content Area */}
        <div ref={scrollRef} className="terminal-scroll" style={{
          height: 340,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          padding: '40px 32px',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          fontWeight: 500,
          lineHeight: '1.8',
          WebkitFontSmoothing: 'antialiased',
          background: '#07070a'
        }}>
          {visibleSteps.map((vs, vi) => (
            <div key={vi} style={{ marginBottom: 16, animation: 'fadeIn 0.3s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: sideLabel(vs.step.side).dot }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: sideLabel(vs.step.side).text, letterSpacing: '0.1em' }}>{vs.step.label}</span>
              </div>
              <div style={{ marginBottom: 20 }}>
                {vs.lines.map((line, li) => (
                  <div key={li} style={{ whiteSpace: 'pre-wrap' }}>
                    <span className="line-num">{li + 1}</span>
                    {line.tokens.map((tok, ti) => {
                      let t = tok.t;
                      if (t === '"sb_c7daee5c65bb48fc"' && dashboard?.clientId) t = `"${dashboard.clientId}"`;
                      return <span key={ti} style={{ color: tok.c }}>{t}</span>;
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {currentStep && phase !== "next_flow" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: sideLabel(currentStep.side).dot, animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: sideLabel(currentStep.side).text, letterSpacing: '0.1em' }}>{currentStep.label}</span>
              </div>
              <div>
                {currentStep.lines.slice(0, lineIdx).map((line, li) => (
                  <div key={li} style={{ whiteSpace: 'pre-wrap' }}>
                    <span className="line-num">{li + 1}</span>
                    {line.tokens.map((tok, ti) => {
                      let t = tok.t;
                      if (t === '"sb_c7daee5c65bb48fc"' && dashboard?.clientId) t = `"${dashboard.clientId}"`;
                      return <span key={ti} style={{ color: tok.c }}>{t}</span>;
                    })}
                  </div>
                ))}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  <span className="line-num">{lineIdx + 1}</span>
                  {buildTypingLine(currentStep.lines[lineIdx], charIdx)}
                  <span className="cursor" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* IDE Status Bar */}
        <div style={{
          padding: '14px 24px',
          background: '#07070a',
          borderTop: '1px solid #10b98122',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 12px #ef4444',
              animation: 'pulse 1.2s infinite'
            }} />
            <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 900, letterSpacing: '0.15em' }}>
              AEGIS_CORE_ENGINE // LIVE_MOVE
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '6px 12px',
              borderRadius: 6,
              display: 'flex',
              gap: 12,
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', letterSpacing: '0.05em' }}>{flow.method}</span>
              <div style={{ width: 1, height: 10, background: 'rgba(239, 68, 68, 0.3)' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#f8fafc', fontFamily: "var(--ff-mono)" }}>{flow.endpoint}</span>
            </div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 800, paddingLeft: 10 }}>LN: {lineIdx + 1}</div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, background: `radial-gradient(circle, ${flow.color}11 0%, transparent 70%)`, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function LiveInsights({ stats, dashboard, subscribers }) {
  const insights = [
    {
      category: "ONBOARDING",
      status: "INFO",
      color: "#6366f1",
      text: stats.total > 0
        ? `${stats.total} total end users registered. Infrastructure integration is successful.`
        : "No end users registered yet. Call POST /api/v1/users/register to begin."
    },
    {
      category: "RENEWAL",
      status: dashboard?.daysRemaining < 15 ? "URGENT" : "NORMAL",
      color: "#f43f5e",
      text: `Plan expires in ${dashboard?.daysRemaining || 0} days. Upgrade to avoid service disruption.`
    },
    {
      category: "API HEALTH",
      status: "NORMAL",
      color: "#22d3ee",
      text: `${dashboard?.apiCallCount || 0} calls logged. System latency stable at < 45ms.`
    },
    {
      category: "CHURN RISK",
      status: "WARNING",
      color: "#f59e0b",
      text: subscribers?.[0]
        ? `${subscribers[0].email?.split('@')[0]} scored HIGH churn risk — only 2 logins in the last 30 days.`
        : "Insufficient user sample to calculate churn probability."
    },
    {
      category: "AI READY",
      status: "INFO",
      color: "#a855f7",
      text: "Run POST /api/v1/ai/generate-plans to create subscriber plans instantly."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <style>{`
        @keyframes energyPulse {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% -100%; }
        }
        @keyframes nodeGlow {
          0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 5px currentColor); }
          50% { transform: scale(1.1); filter: brightness(1.3) drop-shadow(0 0 15px currentColor); }
        }
        .energy-line {
          background: linear-gradient(to bottom, 
            rgba(59, 130, 246, 0.05), 
            rgba(59, 130, 246, 0.8) 50%, 
            rgba(59, 130, 246, 0.05)
          );
          background-size: 100% 200%;
          animation: energyPulse 2s linear infinite;
        }
        .pulsing-node {
          animation: nodeGlow 2s ease-in-out infinite;
        }
      `}</style>
      {insights.map((insight, i) => (
        <div key={i} style={{ display: 'flex', gap: 24, position: 'relative' }}>
          {/* Animated Vertical Line Accent */}
          {i !== insights.length - 1 && (
            <div className="energy-line" style={{
              position: 'absolute',
              left: 4.5,
              top: 24,
              width: 2,
              bottom: -24,
              zIndex: 0,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
            }} />
          )}

          <div className="pulsing-node" style={{
            width: 11,
            height: 11,
            borderRadius: '50%',
            background: insight.color,
            color: insight.color,
            marginTop: 6,
            zIndex: 1,
            boxShadow: `0 0 15px ${insight.color}, 0 0 30px ${insight.color}44`
          }} />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: insight.color, letterSpacing: '0.15em' }}>{insight.category}</div>
              <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 4, fontSize: 8, fontWeight: 900, color: '#1e1b4b', padding: '2px 6px' }}>{insight.status}</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#000000', fontWeight: 600 }}>
              {insight.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



// ── Full API conversation scenarios for the Live Terminal ──────────────────
const FLOWS = [
  {
    title: "Register End User",
    method: "POST",
    endpoint: "/api/v1/users/register",
    color: "#6366f1",
    steps: [
      {
        type: "comment",
        label: "TENANT APP",
        side: "request",
        lines: [
          { tokens: [{ t: "// Step 1: Tenant calls engine to register their end user", c: "#4a5580" }] },
        ]
      },
      {
        type: "request",
        label: "→ REQUEST",
        side: "request",
        lines: [
          { tokens: [{ t: "fetch", c: "#c792ea" }, { t: "(", c: "#89ddff" }, { t: '"/api/v1/users/register"', c: "#c3e88d" }, { t: ", {", c: "#89ddff" }] },
          { tokens: [{ t: "  method", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"POST"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "  headers", c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-ID"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sb_c7daee5c65bb48fc"', c: "#ffcb6b" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-SECRET"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sk_9f3b2a1c7d8e4f0a"', c: "#ffcb6b" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "Content-Type"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"application/json"', c: "#c3e88d" }] },
          { tokens: [{ t: "  },", c: "#89ddff" }] },
          { tokens: [{ t: "  body", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "JSON.stringify", c: "#c792ea" }, { t: "({", c: "#89ddff" }] },
          { tokens: [{ t: "    name", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"alex.morgan"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "    email", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"alex@jobhunt.io"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "    password", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"••••••••"', c: "#c3e88d" }] },
          { tokens: [{ t: "  })", c: "#89ddff" }] },
          { tokens: [{ t: "})", c: "#89ddff" }] },
        ]
      },
      {
        type: "engine",
        label: "⚙ ENGINE",
        side: "engine",
        lines: [
          { tokens: [{ t: "// ApiKeyInterceptor validates credentials", c: "#4a5580" }] },
          { tokens: [{ t: "tenant", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "tenantRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "findByClientId", c: "#c792ea" }, { t: "(clientId)", c: "#89ddff" }] },
          { tokens: [{ t: "// TenantPublicApiController.registerEndUser()", c: "#4a5580" }] },
          { tokens: [{ t: "user", c: "#89ddff" }, { t: ".", c: "#89ddff" }, { t: "setTenant", c: "#c792ea" }, { t: "(tenant)", c: "#89ddff" }] },
          { tokens: [{ t: "user", c: "#89ddff" }, { t: ".", c: "#89ddff" }, { t: "setRole", c: "#c792ea" }, { t: "(", c: "#89ddff" }, { t: "ROLE_USER", c: "#ffcb6b" }, { t: ")", c: "#89ddff" }] },
          { tokens: [{ t: "userRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "save", c: "#c792ea" }, { t: "(user)", c: "#89ddff" }] },
        ]
      },
      {
        type: "response",
        label: "← RESPONSE",
        side: "response",
        status: 201,
        statusText: "CREATED",
        lines: [
          { tokens: [{ t: "{", c: "#89ddff" }] },
          { tokens: [{ t: '  "message"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Successfully registered End User"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '  "status"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "201", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '  "data"', c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "id"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "42", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "username"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"alex.morgan"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "email"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"alex@jobhunt.io"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "role"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"ROLE_USER"', c: "#c3e88d" }] },
          { tokens: [{ t: "  }", c: "#89ddff" }] },
          { tokens: [{ t: "}", c: "#89ddff" }] },
        ]
      }
    ]
  },
  {
    title: "Subscribe User to Plan",
    method: "POST",
    endpoint: "/api/v1/subscriptions",
    color: "#10b981",
    steps: [
      {
        type: "comment",
        label: "TENANT APP",
        side: "request",
        lines: [
          { tokens: [{ t: "// Step 2: Tenant subscribes their user to a plan", c: "#4a5580" }] },
        ]
      },
      {
        type: "request",
        label: "→ REQUEST",
        side: "request",
        lines: [
          { tokens: [{ t: "fetch", c: "#c792ea" }, { t: "(", c: "#89ddff" }, { t: '"/api/v1/subscriptions"', c: "#c3e88d" }, { t: ", {", c: "#89ddff" }] },
          { tokens: [{ t: "  method", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"POST"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "  headers", c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-ID"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sb_c7daee5c65bb48fc"', c: "#ffcb6b" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-SECRET"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sk_9f3b2a1c7d8e4f0a"', c: "#ffcb6b" }] },
          { tokens: [{ t: "  },", c: "#89ddff" }] },
          { tokens: [{ t: "  body", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "JSON.stringify", c: "#c792ea" }, { t: "({", c: "#89ddff" }] },
          { tokens: [{ t: "    userId", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "42", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "    tenantPlanId", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "3", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "    notes", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Growth plan upgrade"', c: "#c3e88d" }] },
          { tokens: [{ t: "  })", c: "#89ddff" }] },
          { tokens: [{ t: "})", c: "#89ddff" }] },
        ]
      },
      {
        type: "engine",
        label: "⚙ ENGINE",
        side: "engine",
        lines: [
          { tokens: [{ t: "// Validates user belongs to tenant", c: "#4a5580" }] },
          { tokens: [{ t: "plan", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "tenantPlanRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "findById", c: "#c792ea" }, { t: "(3)", c: "#89ddff" }] },
          { tokens: [{ t: "// Billing cycle computed", c: "#4a5580" }] },
          { tokens: [{ t: "nextBilling", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "startDate", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "plusMonths", c: "#c792ea" }, { t: "(1)", c: "#89ddff" }] },
          { tokens: [{ t: "subscription", c: "#89ddff" }, { t: ".", c: "#89ddff" }, { t: "setStatus", c: "#c792ea" }, { t: "(", c: "#89ddff" }, { t: "ACTIVE", c: "#c3e88d" }, { t: ")", c: "#89ddff" }] },
          { tokens: [{ t: "userSubscriptionRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "save", c: "#c792ea" }, { t: "(subscription)", c: "#89ddff" }] },
        ]
      },
      {
        type: "response",
        label: "← RESPONSE",
        side: "response",
        status: 201,
        statusText: "CREATED",
        lines: [
          { tokens: [{ t: "{", c: "#89ddff" }] },
          { tokens: [{ t: '  "message"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Successfully subscribed End User"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '  "data"', c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "id"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "18", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "subscriptionName"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Growth"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "amount"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "149.00", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "billingCycle"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"MONTHLY"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "startDate"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"2026-02-25"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "nextBillingDate"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"2026-03-25"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "status"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"ACTIVE"', c: "#c3e88d" }] },
          { tokens: [{ t: "  }", c: "#89ddff" }] },
          { tokens: [{ t: "}", c: "#89ddff" }] },
        ]
      }
    ]
  },
  {
    title: "AI Churn Prediction",
    method: "GET",
    endpoint: "/api/v1/ai/predict-churn/42",
    color: "#a78bfa",
    steps: [
      {
        type: "comment",
        label: "TENANT APP",
        side: "request",
        lines: [
          { tokens: [{ t: "// Step 3: Tenant requests AI churn analysis for user", c: "#4a5580" }] },
        ]
      },
      {
        type: "request",
        label: "→ REQUEST",
        side: "request",
        lines: [
          { tokens: [{ t: "fetch", c: "#c792ea" }, { t: "(", c: "#89ddff" }, { t: '"/api/v1/ai/predict-churn/42"', c: "#c3e88d" }, { t: ", {", c: "#89ddff" }] },
          { tokens: [{ t: "  method", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"GET"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "  headers", c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-ID"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sb_c7daee5c65bb48fc"', c: "#ffcb6b" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-SECRET"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sk_9f3b2a1c7d8e4f0a"', c: "#ffcb6b" }] },
          { tokens: [{ t: "  }", c: "#89ddff" }] },
          { tokens: [{ t: "})", c: "#89ddff" }] },
        ]
      },
      {
        type: "engine",
        label: "⚙ ENGINE + AI",
        side: "engine",
        lines: [
          { tokens: [{ t: "// AiService.predictChurnRisk(userId=42, tenantId=1)", c: "#4a5580" }] },
          { tokens: [{ t: "user", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "userRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "findById", c: "#c792ea" }, { t: "(42)", c: "#89ddff" }] },
          { tokens: [{ t: "subs", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "subscriptionRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "findByUserId", c: "#c792ea" }, { t: "(42)", c: "#89ddff" }] },
          { tokens: [{ t: "// Calling Claude claude-sonnet-4...", c: "#4a5580" }] },
          { tokens: [{ t: "response", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "claudeClient", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "predict", c: "#c792ea" }, { t: "(signals)", c: "#89ddff" }] },
        ]
      },
      {
        type: "response",
        label: "← RESPONSE",
        side: "response",
        status: 200,
        statusText: "OK",
        lines: [
          { tokens: [{ t: "{", c: "#89ddff" }] },
          { tokens: [{ t: '  "message"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"AI Churn Prediction Generated"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '  "data"', c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "risk"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"LOW"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "score"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: "18", c: "#f78c6c" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "signals"', c: "#f07178" }, { t: ": [", c: "#89ddff" }] },
          { tokens: [{ t: '      "142 logins in 30 days — highly engaged"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '      "No support tickets filed"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '      "Active Growth plan subscriber"', c: "#c3e88d" }] },
          { tokens: [{ t: "    ],", c: "#89ddff" }] },
          { tokens: [{ t: '    "recommendation"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Offer annual plan discount to lock in"', c: "#c3e88d" }] },
          { tokens: [{ t: "  }", c: "#89ddff" }] },
          { tokens: [{ t: "}", c: "#89ddff" }] },
        ]
      }
    ]
  },
  {
    title: "Get AI Subscription Analytics",
    method: "GET",
    endpoint: "/api/v1/ai/analytics",
    color: "#f59e0b",
    steps: [
      {
        type: "comment",
        label: "TENANT APP",
        side: "request",
        lines: [
          { tokens: [{ t: "// Step 4: Tenant requests full analytics report", c: "#4a5580" }] },
        ]
      },
      {
        type: "request",
        label: "→ REQUEST",
        side: "request",
        lines: [
          { tokens: [{ t: "fetch", c: "#c792ea" }, { t: "(", c: "#89ddff" }, { t: '"/api/v1/ai/analytics"', c: "#c3e88d" }, { t: ", {", c: "#89ddff" }] },
          { tokens: [{ t: "  method", c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"GET"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: "  headers", c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "X-API-CLIENT-ID"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sb_c7daee5c65bb48fc"', c: "#ffcb6b" }] },
          { tokens: [{ t: '    "X-API-CLIENT-SECRET"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"sk_9f3b2a1c7d8e4f0a"', c: "#ffcb6b" }] },
          { tokens: [{ t: "  }", c: "#89ddff" }] },
          { tokens: [{ t: "})", c: "#89ddff" }] },
        ]
      },
      {
        type: "engine",
        label: "⚙ ENGINE + AI",
        side: "engine",
        lines: [
          { tokens: [{ t: "// AiService.generateSubscriptionAnalytics(tenantId)", c: "#4a5580" }] },
          { tokens: [{ t: "subs", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "subscriptionRepo", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "findByTenantId", c: "#c792ea" }, { t: "(1)", c: "#89ddff" }] },
          { tokens: [{ t: "// Sends full dataset to Claude", c: "#4a5580" }] },
          { tokens: [{ t: "prompt", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "buildAnalyticsPrompt", c: "#82aaff" }, { t: "(subs)", c: "#89ddff" }] },
          { tokens: [{ t: "report", c: "#89ddff" }, { t: " = ", c: "#c792ea" }, { t: "claudeClient", c: "#82aaff" }, { t: ".", c: "#89ddff" }, { t: "complete", c: "#c792ea" }, { t: "(prompt)", c: "#89ddff" }] },
        ]
      },
      {
        type: "response",
        label: "← RESPONSE",
        side: "response",
        status: 200,
        statusText: "OK",
        lines: [
          { tokens: [{ t: "{", c: "#89ddff" }] },
          { tokens: [{ t: '  "message"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"AI Analytics Generated"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '  "data"', c: "#f07178" }, { t: ": {", c: "#89ddff" }] },
          { tokens: [{ t: '    "totalRevenue"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"$626/mo"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "churnRate"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"7.1%"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "topPlan"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Growth (40%)"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "insight"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"2 medium-risk users need re-engagement"', c: "#c3e88d" }, { t: ",", c: "#89ddff" }] },
          { tokens: [{ t: '    "recommendation"', c: "#f07178" }, { t: ": ", c: "#89ddff" }, { t: '"Launch win-back campaign for cancelled users"', c: "#c3e88d" }] },
          { tokens: [{ t: "  }", c: "#89ddff" }] },
          { tokens: [{ t: "}", c: "#89ddff" }] },
        ]
      }
    ]
  }
];

const CHAR_DELAY = 18;
const LINE_DELAY = 60;
const STEP_PAUSE = 600;
const FLOW_PAUSE = 2000;

// DECOMMISSIONED LiveTerminal - integrated into TelemetryUnit


export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || "overview");

  useEffect(() => {
    if (queryTab) setActiveTab(queryTab);
  }, [queryTab]);

  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, cancelled: 0, pending: 0 });
  const [plans, setPlans] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestedResult, setAiSuggestedResult] = useState(null);
  const [aiDescription, setAiDescription] = useState("");
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    subtitle: "",
    price: "",
    billingCycle: "MONTHLY",
    features: "",
    active: true
  });

  const handleUnauth = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { handleUnauth(); return; }

      const [dashRes, statsRes, plansRes, subRes] = await Promise.allSettled([
        api.get('/dashboard'),
        api.get('/developer/tenant-stats'),
        api.get('/developer/tenant-plans'),
        api.get('/developer/tenant-subscribers')
      ]);

      const getVal = (res, fallback = null) => res.status === 'fulfilled' ? res.value.data.data : fallback;

      setDashboard(getVal(dashRes));
      setStats(getVal(statsRes, { total: 0, active: 0, cancelled: 0, pending: 0 }));
      setPlans(getVal(plansRes, []));
      setSubscribers(getVal(subRes, []));

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [handleUnauth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#ffffff" }}>
      <div style={{ width: 40, height: 40, border: "3px solid #f1f5f9", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--white)",
      color: "#1e1b4b",
      fontFamily: "var(--ff-sans)",
      paddingTop: "68px"
    }}>
      <Navbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>
        <ConsoleSidebar
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          activeTab={activeTab} tenantName={dashboard?.tenantName}
          currentPlan={dashboard?.currentPlan}
          daysRemaining={dashboard?.daysRemaining}
        />

        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 68px)",
          overflowY: "auto",
          backgroundImage: `
            radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}>



          <div style={{ padding: "40px 32px" }}>

            {activeTab === 'overview' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 12, height: 2, background: '#6366f1', borderRadius: 2 }} />
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Management Console</span>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", fontFamily: "var(--ff-h)", margin: 0 }}>Infrastructure Overview</h1>
                    <p style={{ color: "#475569", marginTop: 6, fontSize: 13, fontWeight: 500 }}>
                      Real-time telemetry and operational diagnostics for node: <span style={{ fontFamily: 'var(--ff-mono)', color: '#000000', fontWeight: 700 }}>{dashboard?.tenantName || 'SAAS_ROOT'}</span>
                    </p>
                  </div>

                  {/* System HUD */}
                  <div style={{ display: 'flex', gap: 32, paddingBottom: 4 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#64748b', letterSpacing: '0.1em', marginBottom: 2 }}>SYSTEM_CLOCK</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#000000', fontFamily: 'var(--ff-mono)' }}>
                        {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 2 }}>NODE_UPTIME</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', fontFamily: 'var(--ff-mono)' }}>142:08:44:02</div>
                    </div>
                  </div>
                </div>

                {/* Unified 3D Telemetry Unit */}
                <TelemetryUnit
                  dashboard={dashboard}
                  stats={stats}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                  {/* Live Insights */}
                  <section style={{ padding: "0 8px" }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.2em', marginBottom: 40, textTransform: 'uppercase' }}>
                      LIVE INSIGHTS // ANALYTICAL_ENGINE
                    </div>
                    <LiveInsights stats={stats} dashboard={dashboard} subscribers={subscribers} />
                  </section>

                  {/* Developer Protocol Memo */}
                  <section style={{ padding: "0 8px", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 40, marginTop: 40 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.2em', marginBottom: 24, textTransform: 'uppercase' }}>
                      DEVELOPER_PROTOCOL // ADVISORY
                    </div>
                    <div style={{ width: '100%' }}>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "#000000", fontWeight: 500, margin: 0 }}>
                        Your infrastructure node is currently broadcasting on the <span style={{ color: '#1e1b4b', fontWeight: 700 }}>Aegis Mesh Network</span>.
                        As a developer tenant, you can interface with your provisioned services using the <span style={{ fontFamily: 'var(--ff-mono)', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>X-API-KEY</span> header for all external requests.
                      </p>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "#000000", fontWeight: 500, marginTop: 16 }}>
                        All subscriber lifecycle events—including activations and decommissioning—are automatically synchronized across your tenant environment. For deep-level integration, refer to the <span style={{ textDecoration: 'underline', color: '#6366f1', cursor: 'pointer' }}>Infrastructure Documentation</span> or monitor the Live Insights feed above for real-time propagation status.
                      </p>
                    </div>
                  </section>
                </div>
              </>
            )}

            {activeTab === 'credentials' && (
              <div style={{ maxWidth: 880 }}>
                <ApiCredentialsSection 
                  clientId={dashboard?.clientId} 
                  clientSecret={dashboard?.clientSecret} 
                />

                  {/* Quick Start Module */}
                  <div style={{
                    marginTop: 16,
                    padding: 32,
                    background: "#0f172a",
                    borderRadius: 24,
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#6366f1', letterSpacing: '0.15em', marginBottom: 24, textTransform: 'uppercase' }}>
                      QUICK START // INTEGRATION
                    </div>
                    <pre style={{
                      margin: 0,
                      color: '#94a3b8',
                      fontSize: 13,
                      fontFamily: 'var(--ff-mono)',
                      lineHeight: 1.7,
                      overflowX: 'auto'
                    }}>
                      <span style={{ color: '#8b5cf6' }}>fetch</span>(<span style={{ color: '#22d3ee' }}>"/api/v1/users/register"</span>, &#123;{"\n"}
                      {"  "}headers: &#123;{"\n"}
                      {"    "}<span style={{ color: '#f43f5e' }}>"X-API-CLIENT-ID"</span>: <span style={{ color: '#22d3ee' }}>"{dashboard?.clientId || 'YOUR_CLIENT_ID'}"</span>,{"\n"}
                      {"    "}<span style={{ color: '#f43f5e' }}>"X-API-CLIENT-SECRET"</span>: <span style={{ color: '#22d3ee' }}>"YOUR_SECRET"</span>,{"\n"}
                      {"    "}<span style={{ color: '#f43f5e' }}>"Content-Type"</span>: <span style={{ color: '#22d3ee' }}>"application/json"</span>{"\n"}
                      {"  "}&#125;{"\n"}
                      &#125;)
                    </pre>
                  </div>
              </div>
            )}

            {activeTab === 'plans' && (
              <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
                <div className="neural-grid" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, padding: '0 8px', position: 'relative', zIndex: 1 }}>
                  <div>
                    <h1 style={{ fontSize: 32, fontWeight: 950, color: "#1e1b4b", letterSpacing: "-1.5px", lineHeight: 1, fontFamily: "var(--ff-h)", marginBottom: 8 }}>Subscription Plans</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'blinkHUD 2s infinite' }} />
                      <p style={{ color: "#64748b", fontSize: 15, fontWeight: 500, margin: 0 }}>Define and manage plans available for your end-users.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => {
                        setAiSuggestedResult(null);
                        setAiDescription("");
                        setShowAiModal(true);
                      }}
                      style={{
                        background: "rgba(99, 102, 241, 0.05)",
                        color: "#6366f1",
                        borderRadius: 14,
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                        padding: "12px 24px",
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: "pointer",
                        transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <Icon name="zap" size={14} color="#6366f1" />
                      AI Insights
                    </button>

                    <button
                      onClick={() => setShowPlanModal(true)}
                      style={{
                        background: "#0a0a0a",
                        color: "#FFF",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "12px 24px",
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: "pointer",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'; e.currentTarget.style.background = '#000'; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.background = '#0a0a0a'; }}
                    >
                      + Create New Plan
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                  {plans.length > 0 ? plans.map((plan, i) => (
                    <PlanCard
                      key={i}
                      plan={plan}
                      onEdit={(p) => {
                        setEditingPlanId(p.id);
                        setNewPlan({
                          name: p.name,
                          description: p.description || "",
                          price: p.price.toString(),
                          billingCycle: p.billingCycle,
                          features: p.features || "",
                          active: p.active
                        });
                        setShowPlanModal(true);
                      }}
                      onDelete={async (id) => {
                        if (window.confirm("Are you sure you want to decommission this plan?")) {
                          try {
                            await api.delete(`/developer/tenant-plans/${id}`);
                            toast.success("Decommissioned", "Plan has been removed from infrastructure");
                            fetchData();
                          } catch (err) {
                            toast.error("Failure", "Could not remove plan");
                          }
                        }
                      }}
                    />
                  )) : (
                    <div style={{ gridColumn: "1/-1", padding: 100, textAlign: "center", background: "rgba(255, 255, 255, 0.4)", borderRadius: 40, border: '2px dashed rgba(0,0,0,0.05)' }}>
                      <p style={{ color: "#64748b", fontSize: 16, fontWeight: 500 }}>No plans created yet. Start by adding your first subscription tier.</p>
                    </div>
                  )}
                </div>

                {/* AI Recommendation Modal */}
                {showAiModal && (
                  <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
                    perspective: '1000px'
                  }}>
                    <div style={{
                      width: '100%', maxWidth: '480px', background: '#FFFFFF',
                      borderRadius: 32, padding: '40px', position: 'relative',
                      boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
                      animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      border: '1px solid rgba(0,0,0,0.03)',
                      transform: 'rotateX(2deg)'
                    }}>
                      <button
                        onClick={() => { setShowAiModal(false); setAiSuggestedResult(null); }}
                        style={{ position: 'absolute', top: 24, right: 24, background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="close" size={18} />
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="zap" size={24} color="#6366f1" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>AI Market Intelligence</h2>
                          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Smart infrastructure pricing strategies.</p>
                        </div>
                      </div>

                      {!aiSuggestedResult && !aiLoading && (
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Describe Your Business</label>
                          <textarea
                            value={aiDescription}
                            onChange={(e) => setAiDescription(e.target.value)}
                            placeholder="e.g. A cloud-native storage platform for creative agencies looking for high availability..."
                            style={{
                              width: '100%', height: 120, padding: '16px', borderRadius: 16, border: '1px solid #e2e8f0',
                              fontSize: 14, outline: 'none', resize: 'none', marginBottom: 20, color: '#1e1b4b',
                              lineHeight: 1.5
                            }}
                          />
                          <button
                            onClick={async () => {
                              if (!aiDescription.trim()) { toast.error("Missing Info", "Please describe your business first"); return; }
                              setAiLoading(true);
                              try {
                                const res = await aiAPI.generatePlans(aiDescription);
                                setAiSuggestedResult(res.data.data);
                              } catch (e) {
                                const errorMsg = e.response?.data?.message || "Failed to generate strategies. Please try again.";
                                toast.error("AI Error", errorMsg);
                              } finally {
                                setAiLoading(false);
                              }
                            }}
                            style={{
                              width: '100%', background: '#6366f1', color: '#FFF', borderRadius: 14, border: 'none',
                              padding: '16px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                              boxShadow: '0 10px 20px -5px rgba(99,102,241,0.4)',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            Generate AI Strategies
                          </button>
                        </div>
                      )}

                      {aiLoading ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                          <div style={{ width: 40, height: 40, border: "3px solid #f1f5f9", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite", margin: '0 auto 16px' }} />
                          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>Analyzing market volatility & node costs...</p>
                        </div>
                      ) : aiSuggestedResult && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>SUGGESTED INFRASTRUCTURE TIERS</div>
                          <div style={{ display: 'grid', gap: 12 }}>
                            {aiSuggestedResult.map((p, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  setNewPlan({
                                    ...newPlan,
                                    name: p.name,
                                    price: p.price.toString(),
                                    description: p.description,
                                    billingCycle: p.billingCycle || "MONTHLY",
                                    features: p.features
                                  });
                                  setShowAiModal(false);
                                  setShowPlanModal(true);
                                }}
                                style={{
                                  padding: '16px 20px', borderRadius: 16, border: '1px solid #e2e8f0', cursor: 'pointer',
                                  transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.02)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
                              >
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b' }}>{p.name}</div>
                                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.description}</div>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#6366f1' }}>₹{p.price}</div>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setAiSuggestedResult(null)}
                            style={{ width: '100%', background: 'none', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 14, padding: '12px', marginTop: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                          >
                            &larr; Back to description
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {showPlanModal && (
                  <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
                    perspective: '1000px'
                  }}>
                    <div style={{
                      width: '100%', maxWidth: '440px', background: '#FFFFFF',
                      borderRadius: 32, padding: '32px 40px 40px', position: 'relative',
                      boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,1)',
                      animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      border: '1px solid rgba(0,0,0,0.03)',
                      transform: 'rotateX(2deg)'
                    }}>
                      <button
                        onClick={() => {
                          setShowPlanModal(false);
                          setEditingPlanId(null);
                          setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
                        }}
                        style={{ position: 'absolute', top: 24, right: 24, background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                      >
                        <Icon name="close" size={18} />
                      </button>

                      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', marginBottom: 6, letterSpacing: '-0.5px' }}>{editingPlanId ? 'Reconfigure Node' : 'Create New Plan'}</h2>
                      <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{editingPlanId ? 'Modify infrastructure tier protocols.' : 'Deploy a new subscription tier to your ecosystem.'}</p>

                      <div style={{ display: 'grid', gap: 18 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Name</label>
                          <input
                            type="text" placeholder="e.g. Pro, Enterprise, Free"
                            value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, color: '#1e1b4b' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price (INR)</label>
                            <input
                              type="number" placeholder="0"
                              value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, color: '#1e1b4b' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cycle</label>
                            <select
                              value={newPlan.billingCycle} onChange={(e) => setNewPlan({ ...newPlan, billingCycle: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, background: 'white', color: '#1e1b4b' }}
                            >
                              <option value="MONTHLY">Monthly</option>
                              <option value="YEARLY">Yearly</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                          <textarea
                            placeholder="Brief summary of the plan..."
                            value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, height: 70, resize: 'none', color: '#1e1b4b' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features (One per line)</label>
                          <textarea
                            placeholder="JWT Authentication&#10;Cloud Storage"
                            value={newPlan.features} onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, height: 80, resize: 'none', color: '#1e1b4b', fontWeight: 400 }}
                          />
                        </div>

                        <button
                          disabled={isSubmittingPlan}
                          onClick={async () => {
                            if (!newPlan.name || !newPlan.price) {
                              toast.error("Invalid Input", "Please fill required fields");
                              return;
                            }
                            setIsSubmittingPlan(true);
                            try {
                              if (editingPlanId) {
                                await api.put(`/developer/tenant-plans/${editingPlanId}`, {
                                  ...newPlan,
                                  price: parseFloat(newPlan.price),
                                });
                                toast.success("Updated", "Infrastructure node reconfigured");
                              } else {
                                await api.post('/developer/tenant-plans', {
                                  ...newPlan,
                                  price: parseFloat(newPlan.price),
                                });
                                toast.success("Success", "Plan created successfully");
                              }
                              setShowPlanModal(false);
                              setEditingPlanId(null);
                              setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
                              fetchData();
                            } catch (err) {
                              toast.error("Failed", editingPlanId ? "Could not update plan" : "Could not create plan");
                            } finally {
                              setIsSubmittingPlan(false);
                            }
                          }}
                          style={{
                            background: 'rgba(15, 23, 42, 0.95)',
                            color: '#FFF',
                            borderRadius: 14,
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '16px',
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: 'pointer',
                            marginTop: 10,
                            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                            opacity: isSubmittingPlan ? 0.7 : 1,
                            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                            letterSpacing: '0.02em'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#000'; }}
                          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)'; }}
                        >
                          {isSubmittingPlan ? (editingPlanId ? 'UPDATING...' : 'CONFIGURING...') : (editingPlanId ? 'UPDATE NODE' : 'LAUNCH PLAN')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                  <div>
                    <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Infrastructure Subscribers</h1>
                    <p style={{ color: "#64748b", marginTop: 4 }}>Monitor and manage users currently connected to your tenant infrastructure.</p>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      style={{
                        padding: '12px 12px 12px 40px',
                        borderRadius: 14,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.7)',
                        outline: 'none',
                        width: 280,
                        fontSize: 14,
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid #6366f1'}
                      onBlur={(e) => e.target.style.border = '1px solid rgba(0,0,0,0.08)'}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)", overflow: "hidden", boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.4)" }}>
                        <th style={{ padding: "20px 32px" }}>Subscriber</th>
                        <th style={{ padding: "20px 32px" }}>Current Plan</th>
                        <th style={{ padding: "20px 32px" }}>Status</th>
                        <th style={{ padding: "20px 32px" }}>Joined Date</th>
                        <th style={{ padding: "20px 32px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.length > 0 ? subscribers.map((sub, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", fontSize: 14 }}>
                          <td style={{ padding: "20px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>
                                {(sub.userName || sub.email || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#1e1b4b" }}>{sub.userName || 'Unknown User'}</div>
                                <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "20px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
                              <span style={{ fontWeight: 600, color: "#475569" }}>{sub.planName || 'Standard'}</span>
                            </div>
                          </td>
                          <td style={{ padding: "20px 32px" }}>
                            <span style={{
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              background: sub.status === 'ACTIVE' ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
                              color: sub.status === 'ACTIVE' ? "#10b981" : "#f43f5e"
                            }}>
                              {sub.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: "20px 32px", color: "#64748b" }}>
                            {sub.joinedAt ? new Date(sub.joinedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                          </td>
                          <td style={{ padding: "20px 32px" }}>
                            <button style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>View Profile</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" style={{ padding: "80px 0", textAlign: "center" }}>
                            <div style={{ opacity: 0.5, marginBottom: 16 }}>
                              <Icon name="users" size={48} color="#94a3b8" />
                            </div>
                            <p style={{ color: "#64748b", fontWeight: 500 }}>No subscribers found in your infrastructure.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'license' && (
              <div style={{ maxWidth: 900 }}>
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Infrastructure License</h1>
                  <p style={{ color: "#64748b", marginTop: 4 }}>Manage your Aegis Infra partnership and infrastructure tier.</p>
                </div>

                <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", borderRadius: 32, padding: 48, color: "white", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(30, 27, 75, 0.2)" }}>
                  <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7 }}>Current Tier</span>
                        <h2 style={{ fontSize: 42, fontWeight: 900, marginTop: 4 }}>{dashboard?.tenantPlan || 'FREE'} NODE</h2>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.15)", padding: "12px 24px", borderRadius: 16, backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Active License</span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Next Billing</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{dashboard?.nextBillingDate ? new Date(dashboard.nextBillingDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>API Limit</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Unlimited Calls</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Compute Capacity</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>High Efficiency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 12, height: 2, background: '#6366f1', borderRadius: 2 }} />
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Aegis Infra Modules</span>
                  </div>
                  <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>System Services</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'blinkHUD 2s infinite' }} />
                    <p style={{ color: "#64748b", fontWeight: 500, margin: 0 }}>Active infrastructure modules provisioned for the <strong style={{ color: '#1e1b4b' }}>{dashboard?.currentPlan || 'FREE'}</strong> tier.</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                  {/* Dynamic Services Logic based on Plan */}
                  {[
                    // Base Services for ALL plans
                    { name: 'Identity Engine', status: 'Healthy', version: 'v2.4.1', stats: '99.9% Uptime', requiredPlan: 'Any', color: '#10b981', icon: 'shield' },
                    { name: 'API Gateway', status: 'Healthy', version: 'v3.0.5', stats: '20ms Latency', requiredPlan: 'Any', color: '#10b981', icon: 'zap' },

                    // Specific to Starter and above
                    { name: 'Subscription Mesh', status: (dashboard?.currentPlan !== 'Free Trial' ? 'Healthy' : 'Locked'), version: 'v1.1.0', stats: (dashboard?.currentPlan !== 'Free Trial' ? 'Active Sync' : 'Requires Upgrade'), requiredPlan: 'Starter+', color: (dashboard?.currentPlan !== 'Free Trial' ? '#10b981' : '#94a3b8'), icon: 'layers' },

                    // Specific to Growth/Enterprise
                    { name: 'Edge Analytics', status: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Healthy' : 'Locked'), version: 'v2.0.0', stats: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Processing' : 'Requires Growth Plan'), requiredPlan: 'Growth+', color: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? '#6366f1' : '#94a3b8'), icon: 'activity' },
                    { name: 'AI Prediction Core', status: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Healthy' : 'Locked'), version: 'v1.0.claude', stats: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Standing By' : 'Requires Growth Plan'), requiredPlan: 'Growth+', color: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? '#a855f7' : '#94a3b8'), icon: 'cpu' }
                  ].map((service, i) => (
                    <div key={i} style={{
                      background: service.status === 'Locked' ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 24,
                      padding: 32,
                      border: "1px solid rgba(255,255,255,0.8)",
                      boxShadow: service.status === 'Locked' ? 'none' : "0 20px 40px -15px rgba(0,0,0,0.05)",
                      transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: service.status === 'Locked' ? 'not-allowed' : 'pointer',
                      filter: service.status === 'Locked' ? 'grayscale(100%) opacity(0.7)' : 'none'
                    }}
                      onMouseEnter={(e) => {
                        if (service.status !== 'Locked') {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = `0 25px 50px -12px ${service.color}33`;
                          e.currentTarget.style.borderColor = `${service.color}44`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (service.status !== 'Locked') {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = "0 20px 40px -15px rgba(0,0,0,0.05)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                        }
                      }}>

                      {/* Top decorative gradient line */}
                      {service.status !== 'Locked' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }} />
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: `${service.color}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: service.color
                        }}>
                          <Icon name={service.icon} size={20} />
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 11, fontWeight: 900, color: "#94a3b8", fontFamily: 'var(--ff-mono)', letterSpacing: '0.05em' }}>{service.version}</span>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 6, marginTop: 6,
                            background: `${service.color}10`, padding: '4px 8px', borderRadius: 6
                          }}>
                            <div style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: service.color,
                              boxShadow: `0 0 10px ${service.color}`
                            }} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: service.color, letterSpacing: '0.1em' }}>{service.status.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      <h3 style={{ fontSize: 19, fontWeight: 800, color: "#1e1b4b", marginBottom: 8, letterSpacing: '-0.3px' }}>{service.name}</h3>
                      <p style={{ fontSize: 14, color: "#475569", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{service.stats}</p>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!['overview', 'credentials', 'plans', 'subscribers', 'license', 'services'].includes(activeTab)) && (
              <div style={{ padding: 60, textAlign: "center", background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.5)" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b" }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                <p style={{ color: "#64748b", marginTop: 12 }}>This enterprise feature is currently being provisioned for your tenant.</p>
              </div>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      marginTop: "auto",
      padding: "32px",
      borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      background: "rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>
            AEGIS <span style={{ color: "#6366f1" }}>INFRA</span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Docs</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Support</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Security</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>System Region</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>ASIA-SOUTH-1</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Build Version</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>v4.2.0-stable</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px dashed rgba(0, 0, 0, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
          © 2026 Aegis Global Infrastructure. All protocols reserved.
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", letterSpacing: "0.5px" }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}


function StatCard({ label, value, icon, iconBg, iconColor, sparklineColor }) {
  return (
    <div className="stat-card" style={{
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(20px) saturate(160%)",
      borderRadius: 24,
      border: "1px solid rgba(255, 255, 255, 0.8)",
      padding: 28,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      boxShadow: `
        0 10px 30px -10px rgba(0, 0, 0, 0.05),
        inset 0 1px 1px rgba(255, 255, 255, 0.8),
        inset 0 -1px 20px rgba(99, 102, 241, 0.02)
      `,
      transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
      cursor: "pointer",
      perspective: '1000px'
    }}>
      <style>{`
        .stat-card {
            background-image: radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
        }
        .stat-card:hover {
            transform: translateY(-8px) rotateX(4deg) rotateY(-2deg);
            box-shadow:
                0 30px 60px -12px rgba(99, 102, 241, 0.15),
                0 18px 36px -18px rgba(0, 0, 0, 0.2),
                inset 0 1px 1px rgba(255, 255, 255, 1);
            border-color: rgba(99, 102, 241, 0.3);
        }
        .stat-card:hover .spark-container {
            transform: translateZ(20px) scale(1.05);
        }
        @keyframes drawPath {
            0% { stroke-dashoffset: 200; opacity: 0.8; }
            50% { stroke-dashoffset: 0; opacity: 1; }
            100% { stroke-dashoffset: -200; opacity: 0.8; }
        }
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes neuralPulse {
          0% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
          100% { opacity: 0.1; transform: scale(1); }
        }
        @keyframes blinkHUD {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .neural-grid {
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }
      `}</style>

      {/* Engineering Corner Accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderLeft: '1px solid rgba(99, 102, 241, 0.1)', borderTop: '1px solid rgba(99, 102, 241, 0.1)', borderTopLeftRadius: 24 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, zIndex: 2 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${iconColor}22`,
          boxShadow: `0 8px 16px ${iconColor}15`
        }}>
          <Icon name={icon} color={iconColor} />
        </div>
        <div className="spark-container" style={{ transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)' }}>
          <Sparkline color={sparklineColor} />
        </div>
      </div>

      <div style={{ zIndex: 2 }}>
        <div style={{
          fontSize: 42,
          fontWeight: 900,
          color: "#1e1b4b",
          marginBottom: 4,
          letterSpacing: "-1.5px",
          fontFamily: 'var(--ff-sans)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 8
        }}>
          {value}
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#64748b",
            letterSpacing: '0.1em',
            fontFamily: 'var(--ff-mono)'
          }}>[OPERATIONAL]</span>
        </div>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#475569",
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: iconColor }} />
          {label}
        </div>
      </div>

      {/* Technical HUD glow */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${iconColor}08 0%, transparent 70%)`,
        zIndex: 1
      }} />
    </div>
  );
}

function PlanCard({ plan, onDelete, onEdit }) {
  const features = plan.features ? plan.features.split(/[,\n]/).filter(f => f.trim()) : [];

  return (
    <div style={{
      background: "#0a0a0a",
      borderRadius: 32,
      padding: "32px 32px 40px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.05)",
      transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.05)',
      cursor: 'default',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
      overflow: 'hidden'
    }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px) rotateX(4deg) rotateY(-2deg)';
        e.currentTarget.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255,255,255,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)';
      }}
      className="management-card">

      {/* Decorative HUD Corner */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12, width: 20, height: 20,
        borderRight: '1px solid rgba(255,255,255,0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        opacity: 0.5
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative', zIndex: 2 }}>
        <div>
          <h4 style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: '-0.5px' }}>{plan.name.toLowerCase()}</h4>
          <div style={{ display: 'flex', marginTop: 6 }}>
            <span style={{
              fontSize: 9,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              background: plan.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: plan.active ? '#10b981' : '#f43f5e',
              padding: '4px 10px',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              border: `1px solid ${plan.active ? '#10b98166' : '#f43f5e66'}`,
              boxShadow: plan.active ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
            }}>
              {plan.active ? 'SECURE NODE' : 'INACTIVE'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onEdit?.(plan)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: 'pointer',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
            title="Edit Plan"
          >
            <Icon name="edit" size={16} color="currentColor" />
          </button>
          <button
            onClick={() => onDelete?.(plan.id)}
            style={{
              background: 'rgba(244, 63, 94, 0.05)',
              border: 'none',
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: 'pointer',
              color: '#f43f5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'; e.currentTarget.style.color = '#fb7185'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)'; e.currentTarget.style.color = '#f43f5e'; }}
            title="Delete Plan"
          >
            <Icon name="trash" size={16} color="currentColor" />
          </button>
        </div>
      </div>

      <div style={{ fontSize: 42, fontWeight: 950, color: "#ffffff", marginBottom: 12, letterSpacing: "-2px", display: 'flex', alignItems: 'baseline', position: 'relative', zIndex: 2 }}>
        {plan.price === 0 ? "Free" : `₹${plan.price}`}
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700, letterSpacing: 0, marginLeft: 2 }}>/{plan.billingCycle.toLowerCase()}</span>
      </div>

      <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32, lineHeight: 1.6, fontWeight: 500, position: 'relative', zIndex: 2 }}>
        {plan.description || "Infrastructure tier for standard SaaS operations."}
      </p>

      <div style={{ display: "grid", gap: 12, position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>CORE_PROTOCOLS</div>
        {features.length > 0 ? features.map((feature, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Icon name="check" size={10} color="#6366f1" />
            </div>
            <span style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600, fontFamily: 'var(--ff-mono)', fontSize: '11px' }}>{feature.trim()}</span>
          </div>
        )) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={10} color="#475569" />
            </div>
            <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Base system protocols</span>
          </div>
        )}
      </div>

      {/* Bottom Technical HUD Bar */}
      <div style={{
        marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: '8px', color: '#475569', fontWeight: 900, letterSpacing: '0.2em' }}>AEGIS_SECURE_LINK</div>
        <div style={{ width: 30, height: 1, background: 'rgba(99,102,241,0.3)' }} />
      </div>
    </div>
  );
}
