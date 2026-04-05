const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.js', 'utf-8');

const oldHeaderStr = \        <div className="telemetry-3d-card">
          {/* IDE Title Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'var(--surface)', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "var(--ff-mono)" }}>
              STREAMING_RESPONSE.JSON
            </div>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.05em' }}>
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
            background: 'var(--bg)'
          }}>\

const newHeaderStr = \        <div className="telemetry-3d-card" style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.2), 0 25px 60px -12px rgba(0, 0, 0, 0.2)', backgroundColor: '#07070a' }}>
          {/* IDE Title Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', boxShadow: '0 2px 4px rgba(255, 95, 87, 0.3)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', boxShadow: '0 2px 4px rgba(254, 188, 46, 0.3)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', boxShadow: '0 2px 4px rgba(40, 200, 64, 0.3)' }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#4f46e5', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "var(--ff-mono)" }}>
              STREAMING_RESPONSE.JSON
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.05em', fontFamily: 'var(--ff-mono)' }}>
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
          }}>\


content = content.replace(oldHeaderStr, newHeaderStr);
fs.writeFileSync('src/pages/Dashboard.js', content, 'utf-8');
console.log('done')
