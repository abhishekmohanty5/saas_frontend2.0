const fs = require('fs');

let content = fs.readFileSync('src/components/ApiCredentialsSection.js', 'utf8');

// Incorporate lucide-react icons
if (!content.includes('lucide-react')) {
  content = content.replace("import '../styles/ApiCredentialsSection.css';", "import '../styles/ApiCredentialsSection.css';\nimport { Lock, Unlock, Eye, EyeOff, Copy, Check, ShieldCheck, Key, Trash2 } from 'lucide-react';");
}

// Remove main heading emoji
content = content.replace(/<h1>.*?Security & Access<\/h1>/g, "<h1>Security & Access</h1>");

// Replace lock emojis
content = content.replace(/\{locked\.clientId \? '.*?' : '.*?'\}/g, "{locked.clientId ? <Lock size={16} /> : <Unlock size={16} />}");
content = content.replace(/\{locked\.clientSecret \? '.*?' : '.*?'\}/g, "{locked.clientSecret ? <Lock size={16} /> : <Unlock size={16} />}");
content = content.replace(/\{key\.locked \? '.*?' : '.*?'\}/g, "{key.locked ? <Lock size={16} /> : <Unlock size={16} />}");

// Eye
content = content.replace(/\{revealed\.clientId \? '.*?' : '.*?'\}/g, "{revealed.clientId ? <EyeOff size={16} /> : <Eye size={16} />}");
content = content.replace(/\{revealed\.clientSecret \? '.*?' : '.*?'\}/g, "{revealed.clientSecret ? <EyeOff size={16} /> : <Eye size={16} />}");
content = content.replace(/\{key\.revealed \? '.*?' : '.*?'\}/g, "{key.revealed ? <EyeOff size={16} /> : <Eye size={16} />}");

// Check / Copy
content = content.replace(/\{copied\.clientId \? '.*?' : '.*?'\}/g, "{copied.clientId ? <><Check size={14} className=\"mr-1\" /> COPIED</> : <><Copy size={14} className=\"mr-1\" /> COPY</>}");
content = content.replace(/\{copied\.clientSecret \? '.*?' : '.*?'\}/g, "{copied.clientSecret ? <><Check size={14} className=\"mr-1\" /> COPIED</> : <><Copy size={14} className=\"mr-1\" /> COPY</>}");
content = content.replace(/\{key\.copied \? '.*?' : '.*?'\}/g, "{key.copied ? <><Check size={14} className=\"mr-1\" /> COPIED</> : <><Copy size={14} className=\"mr-1\" /> COPY</>}");

// Other
content = content.replace(/<span className="empty-icon">.*?<\/span>/g, '<ShieldCheck size={32} className="empty-icon" />');
content = content.replace(/>âœ•</g, '><Trash2 size={16} /><');
content = content.replace(/<span className="notice-icon">.*?<\/span>/g, '<ShieldCheck className="notice-icon" size={24} />');
content = content.replace(/'âœ• Cancel' : '\+ Add API Key'/g, "showAddKey ? 'Cancel' : 'Add API Key'");

fs.writeFileSync('src/components/ApiCredentialsSection.js', content);
console.log("Replaced emojis with icons in ApiCredentialsSection.js");
