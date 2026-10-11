const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'styles');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;
            
            // Replace background and background-color using var(--text-primary) or black hexes
            content = content.replace(/(background(-color)?:\s*)var\(--text-primary\)/g, '$1var(--accent-primary)');
            content = content.replace(/(background(-color)?:\s*)#000000/g, '$1var(--accent-primary)');
            content = content.replace(/(background(-color)?:\s*)#000(?![0-9a-fA-F])/g, '$1var(--accent-primary)');
            content = content.replace(/(background(-color)?:\s*)#1a1a1a/ig, '$1var(--accent-primary)');
            content = content.replace(/(background(-color)?:\s*)#171717/ig, '$1var(--accent-primary)');
            content = content.replace(/(background(-color)?:\s*)#111(?![0-9a-fA-F])/ig, '$1var(--accent-primary)');

            // Replace border, border-color, etc.
            content = content.replace(/(border(?:-[a-z]+)?:\s*[^;]*?)var\(--text-primary\)/g, '$1var(--accent-primary)');
            content = content.replace(/(border(?:-[a-z]+)?:\s*[^;]*?)#000000/g, '$1var(--accent-primary)');
            content = content.replace(/(border(?:-[a-z]+)?:\s*[^;]*?)#000(?![0-9a-fA-F])/g, '$1var(--accent-primary)');
            content = content.replace(/(border(?:-[a-z]+)?:\s*[^;]*?)#1a1a1a/ig, '$1var(--accent-primary)');
            content = content.replace(/(border(?:-[a-z]+)?:\s*[^;]*?)#171717/ig, '$1var(--accent-primary)');
            content = content.replace(/(border(?:-[a-z]+)?:\s*[^;]*?)#111(?![0-9a-fA-F])/ig, '$1var(--accent-primary)');

            // Replace fill and stroke
            content = content.replace(/(fill|stroke):\s*var\(--text-primary\)/g, '$1: var(--accent-primary)');
            content = content.replace(/(fill|stroke):\s*#000000/g, '$1: var(--accent-primary)');
            content = content.replace(/(fill|stroke):\s*#000(?![0-9a-fA-F])/g, '$1: var(--accent-primary)');
            content = content.replace(/(fill|stroke):\s*#1a1a1a/ig, '$1: var(--accent-primary)');
            content = content.replace(/(fill|stroke):\s*#171717/ig, '$1: var(--accent-primary)');
            content = content.replace(/(fill|stroke):\s*#111(?![0-9a-fA-F])/ig, '$1: var(--accent-primary)');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', file);
            }
        }
    }
}

processDirectory(stylesDir);
console.log('Done processing CSS files.');
