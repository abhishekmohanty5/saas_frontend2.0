const fs = require('fs');

let content = fs.readFileSync('src/components/ApiCredentialsSection.js', 'utf8');

// Incorporate lucide-react icons
if (!content.includes('lucide-react')) {
  content = content.replace("import '../styles/ApiCredentialsSection.css';", "import '../styles/ApiCredentialsSection.css';\nimport { Lock, Unlock, Eye, EyeOff, Copy, Check, ShieldCheck, Key, Trash2 } from 'lucide-react';");
}

// Remove main heading emoji
content = content.replace("<h1>ðŸ” Security & Access</h1>", "<h1>Security & Access</h1>");
content = content.replace("<h1>\uD83D\uDD10 Security & Access</h1>", "<h1>Security & Access</h1>");
content = content.replace(/<h1>.*?Security & Access<\/h1>/, "<h1>Security & Access</h1>");

// Replace lock emojis
content = content.replace(/\{locked\.clientId \? '.*?' : '.*?'\}/, "{locked.clientId ? <Lock size={18} /> : <Unlock size={18} />}");
content = content.replace(/\{locked\.clientSecret \? '.*?' : '.*?'\}/, "{locked.clientSecret ? <Lock size={18} /> : <Unlock size={18} />}");

// Replace reveal emojis
content = content.replace(/\{revealed\.clientId \? '.*?' : '.*?'\}/, "{revealed.clientId ? <EyeOff size={18} /> : <Eye size={18} />}");
content = content.replace(/\{revealed\.clientSecret \? '.*?' : '.*?'\}/, "{revealed.clientSecret ? <EyeOff size={18} /> : <Eye size={18} />}");

// Optionally do it global if it missed anything
content = content.replace(/'ðŸ”’'/g, "<Lock size={18} />");
content = content.replace(/'ðŸ”“'/g, "<Unlock size={18} />");
content = content.replace(/'ðŸ‘ï¸'/g, "<EyeOff size={18} />");
content = content.replace(/'ðŸ‘ï¸â€ðŸ—¨ï¸'/g, "<Eye size={18} />");

// Any other emojis
content = content.replace(/>ðŸ”‘</g, "><Key size={48} className=\"empty-icon\" />");
content = content.replace(/>ðŸ—‘ï¸</g, "><Trash2 size={16} />");

fs.writeFileSync('src/components/ApiCredentialsSection.js', content);
console.log("Replaced emojis in ApiCredentialsSection.js");
