const fs = require('fs');
const files = [
  'src/pages/Dashboard.js',
  'src/pages/AdminDashboard.js',
  'src/pages/SubscriptionsPage.js',
  'src/components/ConsoleSidebar.js'
];

for(const file of files) {
  if(!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');

  // Hardcoded UI structural colors
  content = content.replace(/background:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.8\)['"]/g, 'background: "var(--surface)"');
  content = content.replace(/background:\s*['"]white['"]/g, 'background: "var(--surface)"');
  content = content.replace(/backgroundColor:\s*['"]white['"]/g, 'backgroundColor: "var(--surface)"');
  content = content.replace(/color:\s*['"]#1e1b4b['"]/g, 'color: "var(--text)"');
  content = content.replace(/color:\s*['"]#64748b['"]/g, 'color: "var(--muted)"');
  content = content.replace(/color:\s*['"]#475569['"]/g, 'color: "var(--text)"');
  content = content.replace(/color:\s*['"]#334155['"]/g, 'color: "var(--text)"');
  content = content.replace(/border:\s*['"]1px solid #e2e8f0['"]/g, 'border: "1px solid var(--border)"');
  content = content.replace(/borderTop:\s*['"]1px solid #e2e8f0['"]/g, 'borderTop: "1px solid var(--border)"');
  content = content.replace(/borderBottom:\s*['"]1px solid #e2e8f0['"]/g, 'borderBottom: "1px solid var(--border)"');
  content = content.replace(/borderColor:\s*['"]#e2e8f0['"]/g, 'borderColor: "var(--border)"');
  content = content.replace(/borderRight:\s*['"]1px solid #e2e8f0['"]/g, 'borderRight: "1px solid var(--border)"');

  // CSS Blocks in components
  content = content.replace(/background:\s*#ffffff;/g, 'background: var(--surface);');
  content = content.replace(/color:\s*#1e1b4b;/g, 'color: var(--text);');
  content = content.replace(/color:\s*#64748b;/g, 'color: var(--muted);');
  content = content.replace(/border:\s*1px solid rgba\(15, 23, 42, 0\.06\);/g, 'border: 1px solid var(--border);');
  content = content.replace(/background:\s*rgba\(15, 23, 42, 0\.03\);/g, 'background: var(--border);');

  // Background in Dashboard.js
  content = content.replace(/radial-gradient\(rgba\(0,\s*0,\s*0,\s*0\.03\)\s*1px,\s*transparent\s*1px\),\s*linear-gradient\(to\s*bottom,\s*rgba\(255,\s*255,\s*255,\s*0\.8\),\s*rgba\(255,\s*255,\s*255,\s*0\.8\)\)/g, 
    'radial-gradient(var(--border) 1px, transparent 1px)');
  
  content = content.replace(/radial-gradient\(rgba\(0,\s*0,\s*0,\s*0\.03\)\s*1px,\s*transparent\s*1px\)/g, 'radial-gradient(var(--border) 1px, transparent 1px)');
  
  fs.writeFileSync(file, content);
  console.log('Fixed =>', file);
}