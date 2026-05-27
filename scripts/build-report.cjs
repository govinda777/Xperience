const fs = require('fs');
const path = require('path');

function getDirectorySize(dir) {
  let size = 0;
  if (!fs.existsSync(dir)) return 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  });

  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log('\n📊 BUILD REPORT\n');
console.log('=====================================');

const nextDir = path.join(__dirname, '../.next');
const distDir = path.join(__dirname, '../dist');
const publicDir = path.join(__dirname, '../public');
const vercelOutput = path.join(__dirname, '../.vercel/output');

if (fs.existsSync(nextDir)) {
  const nextSize = getDirectorySize(nextDir);
  console.log(`📦 .next/ size: ${formatBytes(nextSize)}`);
}

if (fs.existsSync(distDir)) {
  const distSize = getDirectorySize(distDir);
  console.log(`📦 dist/ size: ${formatBytes(distSize)}`);
}

if (fs.existsSync(vercelOutput)) {
    const vercelSize = getDirectorySize(vercelOutput);
    console.log(`📦 .vercel/output size: ${formatBytes(vercelSize)}`);
}

if (fs.existsSync(publicDir)) {
  const publicSize = getDirectorySize(publicDir);
  console.log(`📦 public/ size: ${formatBytes(publicSize)}`);
}

console.log('=====================================\n');
