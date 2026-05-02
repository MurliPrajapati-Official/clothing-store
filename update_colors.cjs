const fs = require('fs');
const path = require('path');

const replacements = {
    "bg-offwhite": "bg-canvas",
    "bg-white": "bg-surface-card",
    "text-navy": "text-ink",
    "text-text-body": "text-body-text",
    "text-text-muted": "text-muted",
    "border-gray-100": "border-hairline",
    "border-gray-200": "border-hairline-strong",
    "border-gray-light": "border-hairline",
    "bg-gray-100": "bg-surface-elevated",
    "bg-gray-200": "bg-surface-elevated",
    "text-text-dark": "text-ink",
    "text-gray-400": "text-muted",
    "text-gray-500": "text-muted",
    "text-gray-600": "text-body-text",
    "text-gray-700": "text-body-text",
    "text-maroon": "text-m-red",
    "bg-maroon": "bg-m-red",
    "from-navy/80": "from-canvas/90",
    "from-navy/90": "from-canvas/95",
    "via-navy/50": "via-canvas/50",
    "via-navy/40": "via-canvas/40",
    "bg-green-100": "bg-success/20",
    "text-green-600": "text-success",
    "text-green-700": "text-success",
    "border-navy": "border-ink",
    "hover:border-navy": "hover:border-ink",
    "focus:border-navy": "focus:border-ink",
    "shadow-sm": "shadow-[0_2px_10px_rgba(0,0,0,0.5)]",
    "shadow-md": "shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    "shadow-lg": "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
    "bg-gray-50": "bg-surface-card",
    "bg-red-50": "bg-surface-card hover:bg-m-red/10",
    "hover:text-maroon": "hover:text-m-red",
    "text-gold": "text-warning",
    "bg-navy": "bg-ink",
    "bg-navy/90": "bg-ink/90",
    "hover:bg-navy": "hover:bg-ink",
    "hover:bg-offwhite": "hover:bg-surface-elevated",
};

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
          filelist.push(dirFile);
        }
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');
files.forEach(filepath => {
  let content = fs.readFileSync(filepath, 'utf8');
  Object.keys(replacements).forEach(old => {
    content = content.replace(new RegExp(old, 'g'), replacements[old]);
  });
  fs.writeFileSync(filepath, content);
});
console.log('Done.');
