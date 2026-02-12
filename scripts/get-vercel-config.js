const fs = require('fs');
const path = require('path');

const projectConfigPath = path.join(process.cwd(), '.vercel', 'project.json');

console.log('🔍 Checking for Vercel project configuration...');

if (!fs.existsSync(projectConfigPath)) {
  console.error('❌ Error: Vercel project configuration not found.');
  console.log('   Please run "vercel link" in your project root to link this project to Vercel.');
  console.log('   This will generate the necessary configuration file.');
  process.exit(1);
}

try {
  const config = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
  const { orgId, projectId } = config;

  if (!orgId || !projectId) {
    console.error('❌ Error: Invalid project configuration. Missing orgId or projectId.');
    process.exit(1);
  }

  console.log('✅ Vercel project configuration found!\n');
  console.log('Add the following secrets to your GitHub repository:');
  console.log('----------------------------------------------------');
  console.log(`VERCEL_ORG_ID:     ${orgId}`);
  console.log(`VERCEL_PROJECT_ID: ${projectId}`);
  console.log('----------------------------------------------------');
  console.log('\n⚠️  Don\'t forget to also add VERCEL_TOKEN!');
  console.log('   You can generate a token at: https://vercel.com/account/tokens');

} catch (error) {
  console.error('❌ Error reading project configuration:', error.message);
  process.exit(1);
}
