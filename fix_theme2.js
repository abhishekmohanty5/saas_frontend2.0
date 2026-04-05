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

  content = content.replace(/backgroundImage:\s*`[\s\n]*radial-gradient\(var\(--border\)/g, 
  'background: "var(--bg)",\n          backgroundImage: `\n            radial-gradient(var(--border)');

  content = content.replace(/borderRight:\s*["']1px solid rgba\(15, 23, 42, 0\.08\)["']/g, 'borderRight: "1px solid var(--border)"');
  
  content = content.replace(/boxShadow:\s*["']0 10px 25px -5px rgba\(0, 0, 0, 0\.05\)["']/g, 'boxShadow: "0 10px 25px -5px var(--border)"');
  
  // also fix some rgba string borders
  content = content.replace(/border:\s*["']1px solid rgba\(15, 23, 42, 0\.06\)["']/g, 'border: "1px solid var(--border)"');
  content = content.replace(/border:\s*["']1px solid rgba\(255, 255, 255, 0\.8\)["']/g, 'border: "1px solid var(--border)"');

  fs.writeFileSync(file, content);
  console.log('Fixed ', file);
}