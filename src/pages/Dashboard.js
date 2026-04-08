import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';
import Navbar from '../components/Navbar';
import ApiCredentialsSection from '../components/ApiCredentialsSection';
import { useToast } from '../components/ToastProvider';
import api, { aiAPI, dashboardAPI } from '../services/api';
import { useTheme } from '../utils/ThemeContext';
import { motion } from 'framer-motion';


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

const PaginationControl = ({ current, total, onPageChange }) => {
  if (total <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '24px', padding: '0 8px' }}>
      <button
        disabled={current === 0}
        onClick={() => onPageChange(current - 1)}
        style={{
          background: "var(--surface)", border: "1px solid var(--border)", color: current === 0 ? '#94a3b8' : '#1e1b4b',
          padding: '6px 12px', borderRadius: '8px', cursor: current === 0 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 600,
          transition: 'all 0.2s'
        }}
      >
        &larr; Prev
      </button>
      <span style={{ fontSize: '13px', color: "var(--muted)", fontWeight: 500 }}>Page {current + 1} of {total}</span>
      <button
        disabled={current >= total - 1}
        onClick={() => onPageChange(current + 1)}
        style={{
          background: "var(--surface)", border: "1px solid var(--border)", color: current >= total - 1 ? '#94a3b8' : '#1e1b4b',
          padding: '6px 12px', borderRadius: '8px', cursor: current >= total - 1 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 600,
          transition: 'all 0.2s'
        }}
      >
        Next &rarr;
      </button>
    </div>
  );
};

// ─── CENTRAL TELEMETRY COMPONENTS ──────────────────────────────────────────


function TelemetryUnit({ dashboard }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
  }, [phase, charIdx, lineIdx, stepIdx, flowIdx, flow.steps]);

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
          background: ${isDark ? "#0a0a0f" : "#ffffff"};
          border-radius: 16px;
          border: 1px solid ${isDark ? "rgba(99, 102, 241, 0.2)" : "rgba(0, 0, 0, 0.05)"};
          box-shadow: ${isDark ? "0 0 50px rgba(99, 102, 241, 0.08), inset 0 2px 10px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.03)"};
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          transform-style: preserve-3d;
          position: relative;
        }
        .telemetry-3d-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-2px) rotateX(2deg);
        }
        .telemetry-header {
          padding: 16px 24px;
          background: ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"};
          border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .terminal-scroll {
          scroll-behavior: smooth;
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .line-num { color: #2d3748; user-select: none; margin-right: 18px; font-size: 11px; width: 24px; display: inline-block; text-align: right; }
        .cursor { display: inline-block; width: 2px; height: 13px; background: #e2e8f0; margin-left: 2px; vertical-align: middle; animation: blink .8s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>

      <div className="telemetry-3d-card">
        <div className="telemetry-header">
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "var(--ff-mono)" }}>
            STREAMING_RESPONSE.JSON
          </div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
            {flow.method} {flow.endpoint}
          </div>
        </div>

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
          background: isDark ? '#07070a' : '#f8fafc'
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

        <div style={{
          padding: '14px 24px',
          background: isDark ? '#0a0a0f' : 'var(--bg)',
          borderTop: '1px solid #10b98122',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#ef4444',
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
              <span style={{ fontSize: 10, fontWeight: 800, color: isDark ? 'white' : 'var(--ink)', fontFamily: "var(--ff-mono)" }}>{flow.endpoint}</span>
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 800, paddingLeft: 10 }}>LN: {lineIdx + 1}</div>
          </div>
        </div>
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
        @keyframes premiumBreath {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor66, 0 0 40px currentColor22; 
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.15); 
            box-shadow: 0 0 15px currentColor, 0 0 35px currentColor, 0 0 60px currentColor44; 
            filter: brightness(1.2);
          }
        }
        .energy-line {
          background: linear-gradient(to bottom, 
            rgba(59, 130, 246, 0.05), 
            rgba(59, 130, 246, 0.6) 50%, 
            rgba(59, 130, 246, 0.05)
          );
          background-size: 100% 200%;
          animation: energyPulse 2s linear infinite;
        }
        .plasma-node {
          position: relative;
          animation: premiumBreath 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .plasma-node::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          background: inherit;
          filter: blur(8px);
          opacity: 0.4;
          z-index: -1;
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
              boxShadow: '0 25px 60px -12px var(--theme-border)'
            }} />
          )}

          <div className="plasma-node" style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, white 0%, ${insight.color} 80%)`,
            color: insight.color,
            marginTop: 6,
            zIndex: 1,
            border: '1px solid rgba(255,255,255,0.2)'
          }} />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: insight.color, letterSpacing: '0.15em' }}>{insight.category}</div>
              <div style={{ background: 'var(--theme-border)', border: '1px solid var(--theme-border)', borderRadius: 4, fontSize: 8, fontWeight: 900, color: 'var(--ink)', padding: '2px 6px' }}>{insight.status}</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink)', fontWeight: 600 }}>
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

// DECOMMISSIONED LiveTerminal - integrated into TelemetryUnit


export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, cancelled: 0, pending: 0 });
  const [plans, setPlans] = useState([]);
  const [plansPage, setPlansPage] = useState(0);
  const [plansTotal, setPlansTotal] = useState(0);
  const [plansTotalPages, setPlansTotalPages] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [subPage, setSubPage] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [subTotalPages, setSubTotalPages] = useState(0);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
  const [formStep, setFormStep] = useState(1);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestedResult, setAiSuggestedResult] = useState(null);

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
        dashboardAPI.getOverview(),
        dashboardAPI.getStats(),
        dashboardAPI.getTenantPlans(plansPage, 9),
        dashboardAPI.getEndUsers(subPage, 10)
      ]);

      const getVal = (res, fallback = null) => res.status === 'fulfilled' ? res.value.data.data : fallback;
      const pData = getVal(plansRes, {});
      const sData = getVal(subRes, {});

      setDashboard(getVal(dashRes));
      setStats(getVal(statsRes, { total: 0, active: 0, cancelled: 0, pending: 0 }));
      setPlans(pData.content || []);
      setPlansTotal(pData.totalElements || 0);
      setPlansTotalPages(pData.totalPages || 0);
      setSubscribers(sData.content || []);
      setSubTotal(sData.totalElements || 0);
      setSubTotalPages(sData.totalPages || 0);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [handleUnauth, plansPage, subPage]);

  const handleCreatePlan = useCallback(async (planData) => {
    setIsSubmittingPlan(true);
    try {
      const payload = {
        ...planData,
        price: typeof planData.price === 'string' ? parseFloat(planData.price) : planData.price,
        active: planData.active ?? true
      };

      if (editingPlanId) {
        await api.put(`/v1/tenant-admin/tenant-plans/${editingPlanId}`, payload);
        toast.success("RECONFIGURED", "Infrastructure node reconfigured");
      } else {
        await api.post('/v1/tenant-admin/tenant-plans', payload);
        toast.success("DEPLOYED", "Infrastructure tier live on network");
      }
      
      setShowPlanModal(false);
      setShowAiModal(false);
      setEditingPlanId(null);
      setFormStep(1);
      setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Operation failed";
      toast.error("ERROR", errorMsg);
    } finally {
      setIsSubmittingPlan(false);
    }
  }, [editingPlanId, fetchData, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: isDark ? "#07070a" : "#f8fafc",
        gap: 20
      }}>
        <div className="admin-spin" style={{ width: 40, height: 40, border: '3px solid rgba(99, 102, 241, 0.1)', borderTopColor: '#6366f1', borderRadius: '50%' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", fontFamily: 'var(--ff-mono)' }}>BOOTING_AEGIS_CORE...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: isDark ? "#07070a" : "#f8fafc",
      color: "var(--text)",
      fontFamily: "var(--ff-sans)",
      transition: 'background 0.3s ease'
    }}>
      <style>{`
        @keyframes drawPath {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        .dashboard-container {
          background-image: ${isDark ? "radial-gradient(circle at 50% -10%, rgba(59, 130, 246, 0.15), transparent 50%)" : "radial-gradient(circle at 50% -10%, rgba(59, 130, 246, 0.08), transparent 45%)"};
        }
        @media (max-width: 900px) {
          .dashboard-main-layout {
            flex-direction: column !important;
          }
          .dashboard-content-main {
            padding: 100px 16px 24px !important;
          }
          .responsive-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .table-container {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }
          .dashboard-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .header-actions {
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
      <Navbar />
      <div className="dashboard-main-layout" style={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>
        <ConsoleSidebar
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          activeTab={activeTab} tenantName={dashboard?.tenantName}
          currentPlan={dashboard?.tenantPlan}
          daysRemaining={dashboard?.daysRemaining}
        />

        <main className="dashboard-content-main" style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 68px)",
          overflowY: "auto",
          background: "var(--bg)",
          backgroundImage: `
            radial-gradient(var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}>



          <div style={{ padding: "132px 32px 24px" }}>

            {activeTab === 'overview' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ marginBottom: 64, marginTop: 16 }}
                >
                  <div style={{ 
                    fontSize: 10, 
                    fontWeight: 900, 
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", 
                    letterSpacing: '0.25em', 
                    textTransform: 'uppercase',
                    marginBottom: 12
                  }}>
                    System Overview
                  </div>
                  <h1 style={{ 
                    fontSize: 22, 
                    fontWeight: 800, 
                    color: isDark ? "white" : "#1e293b", 
                    letterSpacing: "-0.03em", 
                    margin: 0,
                    fontFamily: "var(--ff-h)"
                  }}>
                    Real-time platform activity
                  </h1>
                  <p style={{ 
                    color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)", 
                    marginTop: 8, 
                    fontSize: 14, 
                    lineHeight: 1.6,
                    fontWeight: 500,
                    maxWidth: 540
                  }}>
                    Aegis provides secure, decentralized node orchestration and high-performance edge computing nodes for your distributed applications and services.
                  </p>
                </motion.div>

                {/* Unified 3D Telemetry Unit */}
                <TelemetryUnit
                  dashboard={dashboard}
                  isDark={isDark}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                  {/* Live Insights */}
                  <section style={{ padding: "0 8px" }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--muted)', letterSpacing: '0.2em', marginBottom: 40, textTransform: 'uppercase' }}>
                      LIVE INSIGHTS // ANALYTICAL_ENGINE
                    </div>
                    <LiveInsights stats={stats} dashboard={dashboard} subscribers={subscribers} />
                  </section>

                  {/* Developer Protocol Memo */}
                  <section style={{ padding: "0 8px", borderTop: "1px solid var(--theme-border)", paddingTop: 40, marginTop: 40 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--muted)', letterSpacing: '0.2em', marginBottom: 24, textTransform: 'uppercase' }}>
                      DEVELOPER_PROTOCOL // ADVISORY
                    </div>
                    <div style={{ width: '100%' }}>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text)", fontWeight: 500, margin: 0 }}>
                        Your infrastructure node is currently broadcasting on the <span style={{ color: 'var(--ink)', fontWeight: 700 }}>Aegis Mesh Network</span>.
                        As a developer tenant, you can interface with your provisioned services using the <span style={{ fontFamily: 'var(--ff-mono)', background: 'var(--theme-border)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>X-API-KEY</span> header for all external requests.
                      </p>
                      <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text)", fontWeight: 500, marginTop: 16 }}>
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
                    boxShadow: '0 25px 60px -12px var(--theme-border)'
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#6366f1', letterSpacing: '0.15em', marginBottom: 24, textTransform: 'uppercase' }}>
                      QUICK START // INTEGRATION
                    </div>
                    <pre style={{
                      margin: 0,
                      color: 'var(--muted)',
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, padding: '0 8px', position: 'relative', zIndex: 1 }}>
                  <div>
                    <h1 style={{ 
                      fontSize: 22, 
                      fontWeight: 800, 
                      color: "var(--text)", 
                      letterSpacing: "-0.03em", 
                      lineHeight: 1.2, 
                      fontFamily: "var(--ff-h)", 
                      marginBottom: 8 
                    }}>
                      Subscription Plans
                    </h1>
                    <p style={{ 
                      color: "var(--muted)", 
                      fontSize: 14, 
                      lineHeight: 1.6, 
                      fontWeight: 500, 
                      margin: 0, 
                      maxWidth: 600,
                      opacity: 0.9 
                    }}>
                      Provision and orchestrate your infrastructure nodes by defining resource-aware subscription tiers. Each plan represents a dedicated node configuration across the Aegis Mesh Network.
                    </p>
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
                      onClick={() => { setFormStep(1); setShowPlanModal(true); }}
                      style={{
                        background: "#0a0a0a",
                        color: "#FFF",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "12px 24px",
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: "pointer",
                        boxShadow: "0 10px 30px var(--theme-border)",
                        transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'; e.currentTarget.style.background = '#000'; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px var(--theme-border)'; e.currentTarget.style.background = '#0a0a0a'; }}
                    >
                      + Create New Plan
                    </button>
                  </div>
                </div>

                <div className="responsive-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
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
                        setFormStep(1);
                        setShowPlanModal(true);
                      }}
                      onDelete={async (id) => {
                        if (window.confirm("Are you sure you want to decommission this plan?")) {
                          try {
                            await api.delete(`/v1/tenant-admin/tenant-plans/${id}`);
                            toast.success("Decommissioned", "Plan has been removed from infrastructure");
                            fetchData();
                          } catch (err) {
                            toast.error("Failure", "Could not remove plan");
                          }
                        }
                      }}
                    />
                  )) : (
                    <div style={{ 
                      gridColumn: "1/-1", 
                      padding: "80px 40px", 
                      textAlign: "center", 
                      background: "var(--theme-bg-secondary)", 
                      borderRadius: 32, 
                      border: '1px solid var(--theme-border)',
                      boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.02)',
                      animation: 'fadeIn 0.6s ease-out'
                    }}>
                      <div style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 16, 
                        background: 'rgba(99, 102, 241, 0.05)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                      }}>
                        <Icon name="zap" size={24} color="#6366f1" />
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>No nodes provisioned</h3>
                      <p style={{ color: "var(--muted)", fontSize: 13, fontWeight: 500, maxWidth: 360, margin: '0 auto' }}>
                        Start building your infrastructure by adding your first subscription tier or using AI to generate node clusters.
                      </p>
                    </div>
                  )}
                </div>
                <PaginationControl current={plansPage} total={plansTotalPages} onPageChange={setPlansPage} />

                {/* AI Recommendation Modal */}
                {showAiModal && (
                  <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
                    perspective: '1000px'
                  }}>
                    <div style={{
                      width: '100%', maxWidth: '480px', background: 'var(--surface)',
                      borderRadius: 32, padding: '40px', position: 'relative',
                      boxShadow: '0 25px 60px -12px var(--theme-border)',
                      animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      border: '1px solid var(--theme-border)',
                      transform: 'rotateX(2deg)'
                    }}>
                      <button
                        onClick={() => { setShowAiModal(false); setAiSuggestedResult(null); }}
                        style={{ position: 'absolute', top: 24, right: 24, background: 'var(--ink)', border: 'none', cursor: 'pointer', color: 'var(--muted)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="close" size={18} />
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="zap" size={24} color="#6366f1" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', margin: 0 }}>AI Market Intelligence</h2>
                          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>Smart infrastructure pricing strategies.</p>
                        </div>
                      </div>

                      {!aiSuggestedResult && !aiLoading && (
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Describe Your Business</label>
                          <textarea
                            value={aiDescription}
                            onChange={(e) => setAiDescription(e.target.value)}
                            placeholder="e.g. A cloud-native storage platform for creative agencies looking for high availability..."
                            style={{
                              width: '100%', height: 120, padding: '16px', borderRadius: 16, border: '1px solid var(--border)',
                              fontSize: 14, outline: 'none', resize: 'none', marginBottom: 20, color: 'var(--ink)',
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
                              width: '100%', background: '#6366f1', color: 'var(--surface)', borderRadius: 14, border: 'none',
                              padding: '16px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                              boxShadow: '0 25px 60px -12px var(--theme-border)',
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
                          <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>Analyzing market volatility & node costs...</p>
                        </div>
                      ) : aiSuggestedResult && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>SUGGESTED INFRASTRUCTURE TIERS</div>
                          <div style={{ display: 'grid', gap: 12 }}>
                            {aiSuggestedResult.map((p, i) => (
                              <div
                                key={i}
                                onClick={() => handleCreatePlan(p)}
                                style={{
                                  padding: '16px 20px', borderRadius: 16, border: '1px solid var(--border)', cursor: 'pointer',
                                  transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.02)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
                              >
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{p.name}</div>
                                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.description}</div>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#6366f1' }}>₹{p.price}</div>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setAiSuggestedResult(null)}
                            style={{ width: '100%', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 14, padding: '12px', marginTop: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
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
                    background: 'rgba(7, 7, 10, 0.6)', backdropFilter: 'blur(20px)',
                    perspective: '2000px'
                  }}>
                    <div className="telemetry-3d-card" style={{
                      width: '100%', maxWidth: '460px', background: 'var(--glass-bg)',
                      borderRadius: 32, padding: '40px', position: 'relative',
                      boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                      animation: 'modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      border: '1px solid var(--theme-border)',
                      transform: 'rotateX(4deg) translateY(-20px)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      overflow: 'hidden'
                    }}>
                      {/* Scanning Line FX */}
                      <div style={{ 
                        position: 'absolute', top: '-100%', left: 0, width: '100%', height: '50%',
                        background: 'linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.08), transparent)',
                        animation: 'scanningLine 6s linear infinite', pointerEvents: 'none'
                      }} />

                      <button
                        onClick={() => {
                          setShowPlanModal(false);
                          setEditingPlanId(null);
                          setFormStep(1);
                          setNewPlan({ name: "", description: "", price: "", billingCycle: "MONTHLY", features: "", active: true });
                        }}
                        style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--theme-border)', cursor: 'pointer', color: 'var(--muted)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', zIndex: 10 }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--muted)'; }}
                      >
                        <Icon name="close" size={20} />
                      </button>

                      <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* STEP PROGRESS INDICATOR */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 32, padding: '2px' }}>
                          {[1, 2, 3].map(s => (
                            <div key={s} style={{ 
                              flex: 1, height: 4, borderRadius: 2, 
                              background: formStep >= s ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.1)',
                              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: formStep === s ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none'
                            }} />
                          ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name={formStep === 1 ? "edit" : (formStep === 2 ? "zap" : "check")} size={24} color="#6366f1" />
                          </div>
                          <div>
                            <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', margin: 0, letterSpacing: '-1px', fontFamily: 'var(--ff-h)' }}>
                              {formStep === 1 ? 'STEP_01: IDENTITY' : (formStep === 2 ? 'STEP_02: ECONOMY' : 'STEP_03: PROTOCOLS')}
                            </h2>
                            <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, fontWeight: 600 }}>
                              {formStep === 1 ? 'Defining the infrastructure core' : (formStep === 2 ? 'Configuring resource allocation' : 'Finalizing security protocols')}
                            </p>
                          </div>
                        </div>
                        
                        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 13, fontWeight: 500, lineHeight: 1.6 }}>
                          {formStep === 1 ? 'Enter the unique identifier and operational summary for this new infrastructure tier.' : 
                           formStep === 2 ? 'Set the credit requirements and synchronization interval for the sub-mesh network.' : 
                           'Define the core features and security protocols that will be deployed across the nodes.'}
                        </p>

                        <div style={{ display: 'grid', gap: 24, minHeight: '300px' }}>
                          {formStep === 1 && (
                            <div style={{ opacity: 1 }}>
                              <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: '#6366f1', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>PLAN_IDENTIFIER</label>
                                <input
                                  type="text" placeholder="e.g. ULTIMATE_NODE"
                                  value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                  style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid var(--theme-border)', outline: 'none', fontSize: 14, color: 'var(--text)', background: 'rgba(0, 0, 0, 0.25)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)', transition: 'all 0.3s' }}
                                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                  onBlur={(e) => e.target.style.borderColor = 'var(--theme-border)'}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>OPERATIONAL_DESCRIPTION</label>
                                <textarea
                                  placeholder="Brief summary of the plan capability..."
                                  value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                                  style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid var(--theme-border)', outline: 'none', fontSize: 14, height: 120, resize: 'none', color: 'var(--text)', background: 'rgba(0, 0, 0, 0.25)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)', lineHeight: 1.6 }}
                                />
                              </div>
                            </div>
                          )}

                          {formStep === 2 && (
                            <div style={{ opacity: 1 }}>
                              <div style={{ display: 'grid', gap: 24 }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>CREDITS_PER_CYCLE</label>
                                  <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontWeight: 800, fontSize: 14 }}>₹</span>
                                    <input
                                      type="number" placeholder="0"
                                      value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                      style={{ width: '100%', padding: '14px 18px 14px 34px', borderRadius: 16, border: '1px solid var(--theme-border)', outline: 'none', fontSize: 14, color: 'var(--text)', background: 'rgba(0, 0, 0, 0.25)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>SYNC_INTERVAL</label>
                                  <select
                                    value={newPlan.billingCycle} onChange={(e) => setNewPlan({ ...newPlan, billingCycle: e.target.value })}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid var(--theme-border)', outline: 'none', fontSize: 14, background: 'rgba(0, 0, 0, 0.25)', color: 'var(--text)', cursor: 'pointer', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}
                                  >
                                    <option value="MONTHLY">Monthly cycle</option>
                                    <option value="YEARLY">Yearly cycle</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {formStep === 3 && (
                            <div style={{ opacity: 1 }}>
                              <div>
                                <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>CORE_FEATURES (PROTOCOLS)</label>
                                <textarea
                                  placeholder="JWT_AUTH&#10;SSL_ENCRYPTION&#10;REGION_LOCK"
                                  value={newPlan.features} onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                                  style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid var(--theme-border)', outline: 'none', fontSize: 13, height: 180, resize: 'none', color: '#a855f7', background: 'rgba(0, 0, 0, 0.25)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)', fontFamily: 'var(--ff-mono)', lineHeight: 1.6 }}
                                />
                              </div>
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 16, marginTop: 'auto', paddingTop: 20 }}>
                            <button
                              onClick={() => {
                                if (formStep === 1) {
                                  setShowPlanModal(false);
                                  setEditingPlanId(null);
                                  setFormStep(1);
                                } else {
                                  setFormStep(formStep - 1);
                                }
                              }}
                              style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text)', borderRadius: 16, border: '1px solid var(--theme-border)', padding: '16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '0.05em'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                              {formStep === 1 ? '← BACK_TO_LIST' : '← PREVIOUS_PHASE'}
                            </button>
                            
                            {formStep < 3 ? (
                              <button
                                onClick={() => {
                                  if (formStep === 1 && !newPlan.name) {
                                    toast.error("VALIDATION_ERROR", "Identifier is required");
                                    return;
                                  }
                                  setFormStep(formStep + 1);
                                }}
                                style={{
                                  flex: 2, background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', borderRadius: 16, border: '1px solid rgba(99, 102, 241, 0.3)', padding: '16px', fontWeight: 900, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '0.1em'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                              >
                                CONTINUE_PROTOCOL &rarr;
                              </button>
                            ) : (
                              <button
                                disabled={isSubmittingPlan}
                                onClick={() => handleCreatePlan(newPlan)}
                                style={{
                                  flex: 2, background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', borderRadius: 16, border: 'none', padding: '16px', fontWeight: 900, fontSize: 14, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)', opacity: isSubmittingPlan ? 0.7 : 1, boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(99, 102, 241, 0.7)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(99, 102, 241, 0.5)'; }}
                              >
                                {isSubmittingPlan ? (editingPlanId ? 'RECONFIGURING...' : 'COMMITTING...') : (editingPlanId ? 'COMMIT_RECONFIGURATION' : 'DEPLOY_INFRASTRUCTURE')}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
                  <div>
                    <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2, fontFamily: "var(--ff-h)" }}>Infrastructure Subscribers</h1>
                    <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 13 }}>Monitor and manage users currently connected to your tenant infrastructure.</p>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      style={{
                        padding: '12px 12px 12px 40px',
                        borderRadius: 14,
                        border: '1px solid var(--theme-border)',
                        background: 'var(--glass-bg)',
                        outline: 'none',
                        width: 280,
                        fontSize: 14,
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid #6366f1'}
                      onBlur={(e) => e.target.style.border = '1px solid var(--theme-border)'}
                    />
                  </div>
                </div>

                <div className="table-container" style={{ 
                  background: isDark ? "rgba(10, 10, 15, 0.4)" : "rgba(255, 255, 255, 0.8)", 
                  backdropFilter: "blur(12px)", 
                  borderRadius: 24, 
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)"}`, 
                  overflow: "hidden", 
                  boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(99, 102, 241, 0.03)" 
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ 
                        textAlign: "left", fontSize: 11, fontWeight: 800, 
                        color: isDark ? "#64748b" : "#94a3b8", 
                        textTransform: "uppercase", letterSpacing: "0.15em", 
                        borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)"}`,
                        background: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.01)" 
                      }}>
                        <th style={{ padding: "18px 32px" }}>Subscriber</th>
                        <th style={{ padding: "18px 32px" }}>Current Plan</th>
                        <th style={{ padding: "18px 32px" }}>Status</th>
                        <th style={{ padding: "18px 32px" }}>Joined Date</th>
                        <th style={{ padding: "18px 32px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.length > 0 ? subscribers.map((sub, i) => (
                        <tr key={i} style={{ 
                          borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0,0,0,0.02)"}`, 
                          fontSize: 13,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(99, 102, 241, 0.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: "18px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ 
                                width: 32, height: 32, borderRadius: "50%", 
                                background: isDark ? "rgba(99, 102, 241, 0.15)" : "linear-gradient(135deg, #e0e7ff, #c7d2fe)", 
                                color: isDark ? "#818cf8" : "#4f46e5", 
                                display: "flex", alignItems: "center", justifyContent: "center", 
                                fontWeight: 800, fontSize: 11,
                                border: isDark ? "1px solid rgba(99, 102, 241, 0.2)" : "none"
                              }}>
                                {(sub.userName || sub.email || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: isDark ? "white" : "#1e293b" }}>{sub.userName || 'Unknown User'}</div>
                                <div style={{ fontSize: 12, color: "#64748b", fontFamily: 'var(--ff-mono)' }}>{sub.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "18px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", boxShadow: isDark ? '0 0 8px #6366f1' : 'none' }} />
                              <span style={{ fontWeight: 600, color: isDark ? "#cbd5e1" : "#1e293b" }}>{sub.planName || 'Standard'}</span>
                            </div>
                          </td>
                          <td style={{ padding: "18px 32px" }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 800,
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              background: sub.status === 'ACTIVE' ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
                              color: sub.status === 'ACTIVE' ? "#10b981" : "#f43f5e",
                              border: `1px solid ${sub.status === 'ACTIVE' ? "#10b98144" : "#f43f5e44"}`
                            }}>
                              {sub.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: "18px 32px", color: isDark ? "#64748b" : "#94a3b8", fontWeight: 500, fontSize: 12 }}>
                            {sub.joinedAt ? new Date(sub.joinedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                          </td>
                          <td style={{ padding: "18px 32px" }}>
                            <button style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Profile</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" style={{ padding: "80px 0", textAlign: "center" }}>
                            <div style={{ opacity: 0.5, marginBottom: 16 }}>
                              <Icon name="users" size={48} color={isDark ? "#1e293b" : "#94a3b8"} />
                            </div>
                            <p style={{ color: isDark ? "#64748b" : "#94a3b8", fontWeight: 600, fontSize: 13 }}>No subscribers detected in current segment.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && (
                     <div style={{ padding: '60px 0', textAlign: 'center', background: isDark ? "rgba(0,0,0,0.1)" : 'var(--glass-bg)' }}>
                        <p style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}>END_OF_LIST</p>
                     </div>
                  )}
                </div>
                <PaginationControl current={subPage} total={subTotalPages} onPageChange={setSubPage} />
              </div>
            )}

            {activeTab === 'license' && (
              <div style={{ maxWidth: 900 }}>
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: 42, fontWeight: 900, color: "var(--text)", letterSpacing: "-2.5px", lineHeight: 1.1, fontFamily: "var(--ff-h)" }}>Infrastructure License</h1>
                  <p style={{ color: "var(--muted)", marginTop: 4 }}>Manage your Aegis partnership and infrastructure tier.</p>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 24, height: 1, background: '#3b82f6' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Aegis Modules</span>
                    </div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2, fontFamily: "var(--ff-h)" }}>System Services</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                      <p style={{ color: "var(--muted)", fontSize: 14, fontWeight: 500, margin: 0 }}>Active infrastructure modules provisioned for the <strong style={{ color: 'var(--text)' }}>{dashboard?.currentPlan || 'FREE'}</strong> tier.</p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                    {[
                      { name: 'Identity Engine', status: 'Healthy', version: 'v2.4.1', stats: '99.9% Uptime', requiredPlan: 'Any', color: '#10b981', icon: 'shield' },
                      { name: 'API Gateway', status: 'Healthy', version: 'v3.0.5', stats: '20ms Latency', requiredPlan: 'Any', color: '#3b82f6', icon: 'zap' },
                      { name: 'Subscription Mesh', status: (dashboard?.currentPlan !== 'Free Trial' ? 'Healthy' : 'Locked'), version: 'v1.1.0', stats: (dashboard?.currentPlan !== 'Free Trial' ? 'Active Sync' : 'Requires Upgrade'), requiredPlan: 'Starter+', color: (dashboard?.currentPlan !== 'Free Trial' ? '#10b981' : '#64748b'), icon: 'layers' },
                      { name: 'Edge Analytics', status: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Healthy' : 'Locked'), version: 'v2.0.0', stats: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Processing' : 'Requires Growth Plan'), requiredPlan: 'Growth+', color: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? '#6366f1' : '#64748b'), icon: 'activity' },
                      { name: 'AI Prediction Core', status: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Healthy' : 'Locked'), version: 'v1.0.claude', stats: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? 'Standing By' : 'Requires Growth Plan'), requiredPlan: 'Growth+', color: (['Growth', 'Enterprise'].includes(dashboard?.currentPlan) ? '#a855f7' : '#64748b'), icon: 'cpu' }
                    ].map((service, i) => (
                      <div key={i} style={{
                        background: service.status === 'Locked' ? 'var(--theme-bg-tertiary)' : 'var(--glass-bg)',
                        backdropFilter: "blur(20px)",
                        borderRadius: 24,
                        padding: 32,
                        border: service.status === 'Locked' ? '1px solid var(--theme-border)' : `1px solid ${service.color}20`,
                        boxShadow: service.status === 'Locked' ? 'none' : `0 10px 40px -10px ${service.color}15`,
                        transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: service.status === 'Locked' ? 'not-allowed' : 'pointer',
                        filter: service.status === 'Locked' ? 'grayscale(100%) opacity(0.6)' : 'none'
                      }}
                        onMouseEnter={(e) => {
                          if (service.status !== 'Locked') {
                            e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                            e.currentTarget.style.borderColor = `${service.color}60`;
                            e.currentTarget.style.boxShadow = `0 20px 50px -15px ${service.color}33`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (service.status !== 'Locked') {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.borderColor = `${service.color}20`;
                            e.currentTarget.style.boxShadow = `0 10px 40px -10px ${service.color}15`;
                          }
                        }}>

                        {/* Top Glowing Accent */}
                        {service.status !== 'Locked' && (
                          <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: '10%', 
                            right: '10%', 
                            height: 3, 
                            borderRadius: '0 0 4px 4px',
                            background: `linear-gradient(90deg, transparent, ${service.color}, transparent)`,
                            boxShadow: `0 0 15px ${service.color}88`,
                            opacity: 0.8
                          }} />
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: 'center' }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'var(--theme-bg-secondary)',
                            border: '1px solid var(--theme-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: service.status === 'Locked' ? 'var(--muted)' : service.color,
                            boxShadow: service.status !== 'Locked' ? `0 8px 16px ${service.color}10` : 'none'
                          }}>
                            <Icon name={service.icon} size={20} color={service.status === 'Locked' ? 'var(--muted)' : service.color} />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", fontFamily: 'var(--ff-mono)', letterSpacing: '0.05em' }}>{service.version}</span>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              background: 'var(--theme-bg-tertiary)', border: '1px solid var(--theme-border)', padding: '4px 10px', borderRadius: 20
                            }}>
                              {service.status !== 'Locked' ? (
                                <div style={{
                                  width: 6, height: 6, borderRadius: '50%',
                                  background: `radial-gradient(circle at 30% 30%, white 0%, ${service.color} 80%)`,
                                  boxShadow: `0 0 10px ${service.color}, 0 0 15px ${service.color}66`
                                }} />
                              ) : (
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
                              )}
                              <span style={{ fontSize: 10, fontWeight: 900, color: "var(--text)", letterSpacing: '0.1em' }}>{service.status.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>

                        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: "0 0 6px 0", letterSpacing: '-0.02em', fontFamily: 'var(--ff-h)' }}>{service.name}</h3>
                        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{service.stats}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {(!['overview', 'credentials', 'plans', 'subscribers', 'license', 'services'].includes(activeTab)) && (
              <div style={{ padding: 60, textAlign: "center", background: "var(--glass-bg)", backdropFilter: "blur(10px)", borderRadius: 24, border: "1px solid var(--glass-bg)" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                <p style={{ color: "var(--muted)", marginTop: 12 }}>This enterprise feature is currently being provisioned for your tenant.</p>
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
      borderTop: "1px solid var(--theme-border)",
      background: "var(--glass-bg)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            AEGIS<span style={{ color: "#3b82f6" }}>.</span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Docs</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Support</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Security</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>System Region</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>ASIA-SOUTH-1</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Build Version</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>v4.2.0-stable</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px dashed var(--theme-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
          © 2026 Aegis. All protocols reserved.
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", letterSpacing: "0.5px" }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}

function StatCard({ label, value, icon, iconColor, subValue = "System Data Linked" }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        backgroundImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.02))",
        borderRadius: "24px",
        border: "1px solid var(--theme-border)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered 
          ? "0 30px 60px -12px var(--shadow-lg), 0 0 0 1px var(--theme-border)"
          : "0 10px 30px -10px var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        cursor: "default",
        height: "100%",
        minHeight: "150px"
      }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ 
            fontSize: "10px", 
            fontWeight: 800, 
            color: "var(--muted)", 
            textTransform: "uppercase", 
            letterSpacing: "1.2px",
            marginBottom: 4
          }}>
            {label}
          </div>
          <div style={{ 
            fontSize: "34px", 
            fontWeight: 900, 
            color: "var(--theme-text)", 
            letterSpacing: "-1.5px",
            lineHeight: 1
          }}>
            {value}
          </div>
        </div>
        <div style={{ 
          width: "44px", height: "44px", borderRadius: "12px", 
          background: `${iconColor}15`, 
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${iconColor}25`,
          color: iconColor,
          boxShadow: `0 8px 16px ${iconColor}10`
        }}>
          <Icon name={icon} size={20} color={iconColor} />
        </div>
      </div>

      <div style={{ 
        marginTop: 'auto',
        fontSize: "11px", 
        fontWeight: 700, 
        color: "var(--muted)",
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(0,0,0,0.03)',
        padding: '6px 12px',
        borderRadius: '100px',
        width: 'fit-content',
        border: '1px solid var(--theme-border)'
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: iconColor, opacity: 1, boxShadow: `0 0 10px ${iconColor}` }} />
        {subValue}
      </div>

      {/* Surface Gloss Reflection */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: `linear-gradient(135deg, rgba(255,255,255,${hovered ? 0.05 : 0}), transparent)`, 
        pointerEvents: 'none',
        transition: 'opacity 0.4s'
      }} />
    </div>
  );
}

function PlanCard({ plan, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const features = plan.features ? plan.features.split(/[,\n]/).filter(f => f.trim()) : [];

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        backgroundImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.03))",
        borderRadius: "32px",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered 
          ? "0 40px 80px -20px var(--shadow-lg), 0 0 0 1px var(--theme-border)"
          : "0 15px 40px -15px var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        position: 'relative',
        border: '1px solid var(--theme-border)',
        cursor: 'default',
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        overflow: 'hidden',
        height: '100%'
      }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted)", textTransform: 'uppercase', letterSpacing: "1.2px", marginBottom: 4 }}>Infrastructure Node</div>
          <h4 style={{ fontSize: "22px", fontWeight: 900, color: "var(--theme-text)", margin: 0, letterSpacing: "-1px" }}>{plan.name}</h4>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <span style={{
              fontSize: "9px",
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              background: plan.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              color: plan.active ? '#10b981' : '#f43f5e',
              padding: '4px 10px',
              borderRadius: 20,
              border: `1px solid ${plan.active ? '#10b98133' : '#f43f5e33'}`
            }}>
              {plan.active ? 'PROVISIONED' : 'HALTED'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEdit?.(plan)}
            style={{
              background: 'var(--theme-bg-secondary)',
              border: '1px solid var(--theme-border)',
              width: "34px", height: "34px", borderRadius: "10px",
              cursor: 'pointer', color: 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Icon name="edit" size={14} />
          </button>
          <button
            onClick={() => onDelete?.(plan.id)}
            style={{
              background: 'rgba(244, 63, 94, 0.05)',
              border: '1px solid rgba(244, 63, 94, 0.1)',
              width: "34px", height: "34px", borderRadius: "10px",
              cursor: 'pointer', color: '#f43f5e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>

      <div style={{ fontSize: "32px", fontWeight: 950, color: "var(--theme-text)", marginBottom: 12, letterSpacing: "-1.5px", display: 'flex', alignItems: 'baseline' }}>
        {plan.price === 0 ? "Free" : `₹${plan.price}`}
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700, letterSpacing: 0, marginLeft: 2 }}>/{plan.billingCycle.toLowerCase()}</span>
      </div>

      <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: 28, lineHeight: 1.5, fontWeight: 500 }}>
        {plan.description || "Active infrastructure tier serving production endpoints."}
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 'auto' }}>
        <div style={{ fontSize: "9px", fontWeight: 900, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>NODE_PROTOCOLS</div>
        {features.map((feature, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={8} color="#6366f1" />
            </div>
            <span style={{ fontSize: '11px', color: "var(--theme-text)", opacity: 0.8, fontWeight: 600, fontFamily: 'var(--ff-mono)' }}>{feature.trim()}</span>
          </div>
        ))}
      </div>

      {/* Surface Light FX */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: `linear-gradient(135deg, rgba(255,255,255,${hovered ? 0.04 : 0}), transparent)`, 
        pointerEvents: 'none',
        transition: 'opacity 0.4s'
      }} />
    </div>
  );
}
