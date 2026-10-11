const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (fullPath.includes(path.join('app', 'admin'))) {
        content = content.replace(/\.\.\/components\//g, '../../../admin/components/');
      }

      fs.writeFileSync(fullPath, content);
    }
  });
}

walk('src/app/admin');
