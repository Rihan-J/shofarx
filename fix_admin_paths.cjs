const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (fullPath.includes(path.join('app', 'admin')) && !fullPath.includes('login')) {
        content = content.replace(/\.\.\/\.\.\/lib\/adminApi/g, '../../../lib/adminApi');
        content = content.replace(/\.\.\/\.\.\/hooks\//g, '../../../hooks/');
        content = content.replace(/\.\.\/components\/AdminLayout/g, '../../../admin/components/AdminLayout');
      }

      fs.writeFileSync(fullPath, content);
    }
  });
}

walk('src/app/admin');
