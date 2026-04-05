const fs = require('fs');
let file = 'src/pages/Dashboard.js';
let content = fs.readFileSync(file, 'utf8');

// Fix IDE title bar
content = content.replace(/background:\s*'var\(--surface\)',\s*borderBottom:\s*'1px solid #1e293b'/gi, "background: '#f8fafc', borderBottom: '1px solid #e2e8f0'");
content = content.replace(/color:\s*'#6366f1',\s*letterSpacing:\s*'0\.15em',\s*textTransform:\s*'uppercase',\s*fontFamily:\s*"var\(--ff-mono\)"\s*}}>\s*STREAMING_RESPONSE\.JSON/gi, "color: '#4f46e5', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: \\\"var(--ff-mono)\\\" }}>\\n              STREAMING_RESPONSE.JSON");
content = content.replace(/color:\s*'var\(--muted\)',\s*letterSpacing:\s*'0\.05em'\s*}}>\s*\{flow\.method\}\s*\{flow\.endpoint\}/gi, "color: '#64748b', letterSpacing: '0.05em' }}>\\n              {flow.method} {flow.endpoint}");

// Fix content area
content = content.replace(/background:\s*'var\(--bg\)'\s*}}>\s*\{visibleSteps\.map/gi, "background: '#07070a' }}>\\n          {visibleSteps.map");

// Fix the status bar
content = content.replace(/background:\s*'var\(--bg\)',\s*borderTop:\s*'1px solid var\(--border\)',\s*display:\s*'flex',/gi, "background: '#f8fafc', borderTop: '1px solid #10b98144', display: 'flex',");
content = content.replace(/boxShadow:\s*'0\s*-10px\s*30px\s*rgba\(0,0,0,0\.5\)'/gi, "boxShadow: '0 -10px 30px rgba(0,0,0,0.05)'");

// Enhance animation by injecting styles
let animStyle = \          @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
          @keyframes slideBg { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
          @keyframes glowPulse { 0%, 100% { filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.4)); } 50% { filter: drop-shadow(0 0 25px rgba(16, 185, 129, 0.7)); } }\;

content = content.replace(/@keyframes blink \{ 0%, 100% \{ opacity: 1 \} 50% \{ opacity: 0 \} \}/g, animStyle);

// Add animated glow to main card
content = content.replace(/transform-style: preserve-3d;/g, "transform-style: preserve-3d; animation: glowPulse 4s infinite alternate;");

// Re-write to use the exact colors from screenshot for top bar and bottom bar
content = content.replace(/background:\s*'#f8fafc',\s*borderBottom:\s*'1px solid #e2e8f0'/g, "background: '#f8fafc', borderBottom: '2px solid #e2e8f0'");
content = content.replace(/background:\s*'#f8fafc',\s*borderTop:\s*'1px solid #10b98144'/g, "background: '#f8fafc', borderTop: '2px solid #e2e8f0'");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Telemetry unit');
