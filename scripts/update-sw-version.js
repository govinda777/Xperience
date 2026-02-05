const fs = require('fs');
const path = require('path');

const swPath = path.resolve(__dirname, '../public/sw.js');
const cleanupPath = path.resolve(__dirname, '../public/sw-cleanup.js');

// Helper to format date as YYYY.MM.DD.HHMM
const getVersion = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day}.${hours}${minutes}`;
};

const newVersion = getVersion();
console.log(`Updating Service Workers to version: ${newVersion}`);

// Update sw.js
if (fs.existsSync(swPath)) {
    let content = fs.readFileSync(swPath, 'utf8');
    // Regex matches: const VERSION = '...';
    const versionRegex = /const\s+VERSION\s*=\s*['"]([^'"]+)['"];/;

    if (versionRegex.test(content)) {
        const newContent = content.replace(versionRegex, `const VERSION = '${newVersion}';`);
        fs.writeFileSync(swPath, newContent);
        console.log('✅ Updated public/sw.js');
    } else {
        console.warn('⚠️ Could not find VERSION constant in public/sw.js');
    }
} else {
    console.error('❌ public/sw.js not found');
}

// Update sw-cleanup.js
if (fs.existsSync(cleanupPath)) {
    let content = fs.readFileSync(cleanupPath, 'utf8');
    // Regex matches: const CLEANUP_VERSION = '...';
    const cleanupRegex = /const\s+CLEANUP_VERSION\s*=\s*['"]([^'"]+)['"];/;

    if (cleanupRegex.test(content)) {
        const newContent = content.replace(cleanupRegex, `const CLEANUP_VERSION = '${newVersion}';`);
        fs.writeFileSync(cleanupPath, newContent);
        console.log('✅ Updated public/sw-cleanup.js');
    } else {
        console.warn('⚠️ Could not find CLEANUP_VERSION constant in public/sw-cleanup.js');
    }
} else {
    console.error('❌ public/sw-cleanup.js not found');
}
