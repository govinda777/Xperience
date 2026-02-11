import { RoleService } from '../lib/services/role-service';

async function initializeUsers() {
  console.log('Initializing users roles...');

  const args = process.argv.slice(2);

  if (args.length === 0) {
      console.log('Usage: npx tsx scripts/init-users.ts <user_id> [role]');
      console.log('Example: npx tsx scripts/init-users.ts did:privy:cl... admin');
      return;
  }

  const userId = args[0];
  const role = (args[1] || 'admin') as any;

  try {
    console.log(`Setting role ${role} for ${userId}...`);
    await RoleService.setUserRole(userId, role);
    console.log(`✅ Role ${role} defined for ${userId}`);
  } catch (error) {
    console.error(`❌ Error defining role for ${userId}:`, error);
  }
}

if (!process.env.PRIVY_APP_ID && !process.env.VITE_PRIVY_APP_ID) {
    console.warn('⚠️  PRIVY_APP_ID/VITE_PRIVY_APP_ID is missing. Make sure to load environment variables (e.g. export $(cat .env | xargs)).');
}

initializeUsers();
