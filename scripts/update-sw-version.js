const fs = require('fs');
const path = require('path');

const swCleanupPath = path.join(__dirname, '../public/sw-cleanup.js');
const swPath = path.join(__dirname, '../public/sw.js');

const now = new Date();
// Format: YYYY.MM.DD.HHMM
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

const newVersion = `${year}.${month}.${day}.${hours}${minutes}`;

function updateFile(filePath, regex, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.match(regex)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${path.basename(filePath)} to version ${newVersion}`);
    } else {
        console.warn(`Version pattern not found in ${path.basename(filePath)}`);
    }
  } else {
    // It's okay if sw.js doesn't exist (generated file), but sw-cleanup.js should exist
    if (filePath.includes('sw-cleanup.js')) {
        console.warn(`File not found: ${filePath}`);
    }
  }
}

console.log(`Setting Service Worker version to: ${newVersion}`);

// Update sw-cleanup.js
updateFile(
  swCleanupPath,
  /const CLEANUP_VERSION = '.*?';/,
  `const CLEANUP_VERSION = '${newVersion}';`
);

// Update sw.js (if exists)
updateFile(
  swPath,
  /const VERSION = '.*?';/,
  `const VERSION = '${newVersion}';`
);
