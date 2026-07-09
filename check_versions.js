const { execSync } = require('child_process');

const packages = [
  'fast-xml-parser@5.9.3',
  'nanoid@3.3.12',
  'cross-spawn@7.0.6',
  'tough-cookie@6.0.2',
  'viem@2.54.6',
  'zod@3.25.76',
  'ai@6.0.191',
  '@ai-sdk/google@3.0.75',
  '@ai-sdk/openai@3.0.65',
  '@ai-sdk/react@3.0.193'
];

packages.forEach(pkg => {
  try {
    execSync(`npm info ${pkg} version`);
    console.log(`✅ ${pkg} exists`);
  } catch (e) {
    console.log(`❌ ${pkg} DOES NOT exist`);
  }
});
