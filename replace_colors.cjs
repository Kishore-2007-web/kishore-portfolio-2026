const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // For CSS files, we can also replace them, but they might be safe as is if they use vars.
    // For JSX:
    const newContent = content
      .replace(/'#000000'/g, "'var(--bg)'")
      .replace(/"#000000"/g, '"var(--bg)"')
      .replace(/'#111111'/g, "'var(--bg-card)'")
      .replace(/"#111111"/g, '"var(--bg-card)"')
      .replace(/'#ffffff'/g, "'var(--text)'")
      .replace(/"#ffffff"/g, '"var(--text)"')
      .replace(/'#fff'/g, "'var(--text)'")
      .replace(/"#fff"/g, '"var(--text)"')
      .replace(/rgba\(255,\s*255,\s*255,/g, 'rgba(var(--glass-rgb),')
      .replace(/rgba\(0,\s*0,\s*0,/g, 'rgba(var(--shadow-rgb),')
      .replace(/rgba\(\s*255,\s*255,\s*255,\s*/g, 'rgba(var(--glass-rgb),')
      .replace(/rgba\(\s*0,\s*0,\s*0,\s*/g, 'rgba(var(--shadow-rgb),');
      
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated', filePath);
    }
  }
});
