const fs = require('fs');
const glob = require('glob');
const pages = fs.readdirSync('src/pages').map(f => 'src/pages/'+f);
const comms = fs.readdirSync('src/components').map(f => 'src/components/'+f);
[...pages, ...comms].filter(f=>f.endsWith('.js')).forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.match(/background(?:Color)?:\s*['"](white|#fff|#ffffff)['"]/i)) {
    console.log('Still has white background:', file);
  }
  if (content.match(/color:\s*['"]#1e1b4b['"]/i)) {
    console.log('Still has dark blue text:', file);
  }
});