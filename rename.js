const fs = require('fs');
const path = require('path');

const rootDir = '/home/darshil/Code/judgecode/judgecode';
const excludeDirs = ['node_modules', '.git', '.next'];

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!excludeDirs.includes(file)) {
                traverse(fullPath);
            }
        } else {
            // Only process specific extensions to avoid corrupting binaries/images
            if (/\.(js|jsx|ts|tsx|json|md|html|css|mjs)$/.test(file)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content
                    .replace(/@judgecode/g, '@judgecode')
                    .replace(/JudgeCode/g, 'JudgeCode')
                    .replace(/judgecode/g, 'judgecode');
                
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Updated ${fullPath}`);
                }
            }
        }
    }
}

traverse(rootDir);
