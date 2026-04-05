const fs = require('fs');
const c = fs.readFileSync('src/pages/Dashboard.js', 'utf-8');
const lines = c.split('\n');
lines.forEach((l,i) => {
  if(l.match(/background(?:Color)?:\s*['"](white|#fff|#ffffff)['"]/i)) {
    console.log(`Line ${i}: ${l.trim()}`);
  }
});