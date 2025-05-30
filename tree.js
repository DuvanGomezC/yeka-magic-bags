import fs from 'fs';
import path from 'path';

const ignore = ['node_modules', 'dist', 'build', '.git'];

function printTree(dir, prefix = '') {
  const files = fs.readdirSync(dir).filter(file => !ignore.includes(file));
  files.forEach((file, index) => {
    const isLast = index === files.length - 1;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${file}${stat.isDirectory() ? '/' : ''}`);
    
    if (stat.isDirectory()) {
      printTree(fullPath, `${prefix}${isLast ? '    ' : '│   '}`);
    }
  });
}

printTree('.');