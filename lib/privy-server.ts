import { PrivyClient, User } from '@privy-io/node';

const isMock = process.env.MOCK_PRIVY === 'true' || process.env.VITE_MOCK_AUTH === 'true' || process.env.MOCK_AUTH === 'true';

const appId = process.env.PRIVY_APP_ID || process.env.VITE_PRIVY_APP_ID;
const appSecret = process.env.PRIVY_APP_SECRET;

console.log('[Privy Server] Environment variables read:', {
  appId: appId ? `${appId.slice(0, 10)}...` : 'undefined',
  appSecretLength: appSecret ? appSecret.length : 0,
  hasGeminiKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)
});

if (!isMock && (!appId || !appSecret)) {
  console.warn('[Privy Server] WARNING: Missing Privy environment variables: PRIVY_APP_ID (or VITE_PRIVY_APP_ID) and PRIVY_APP_SECRET must be set.');
}

export const privyServer = !isMock && appId && appSecret
  ? new PrivyClient({
      appId: appId,
      appSecret: appSecret,
    })
  : null;

if (privyServer) {
  console.log('[Privy Server] ✅ PrivyClient initialized successfully with App ID:', appId);
} else if (!isMock) {
  console.log('[Privy Server] ❌ PrivyClient failed to initialize! Missing App ID or Secret.');
}

// In-memory store for mock users to support integrated testing flows
const mockUsers = new Map<string, any>();

function getOrCreateMockUser(userId: string): any {
  if (!mockUsers.has(userId)) {
    mockUsers.set(userId, {
      id: userId,
      created_at: Date.now(),
      linked_accounts: [
        {
          type: 'wallet',
          address: '0xMockAddress1234567890abcdef',
          connector_type: 'embedded',
          wallet_client: 'privy',
        }
      ],
      custom_metadata: {
        role: userId.includes('admin') ? 'admin' : 'user'
      }
    });
  }
  return mockUsers.get(userId);
}

export async function verifyPrivyToken(token: string) {
  if (isMock) {
    console.log(`[Privy Mock] Verifying token: ${token}`);
    // Support using a custom user ID as the token for testing flexibility
    const userId = token && token !== 'undefined' && token !== 'null' ? token : 'mock-user-id';
    return {
      user_id: userId,
      session_id: 'mock-session-' + userId,
    };
  }

  try {
    if (!privyServer) {
      throw new Error('Privy Server Client is not initialized. Ensure PRIVY_APP_ID and PRIVY_APP_SECRET are set.');
    }
    const claims = await privyServer.utils().auth().verifyAccessToken(token);
    return claims;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getPrivyUser(userId: string): Promise<User> {
  if (isMock) {
    console.log(`[Privy Mock] Fetching user: ${userId}`);
    return getOrCreateMockUser(userId) as any as User;
  }

  if (!privyServer) {
    throw new Error('Privy Server Client is not initialized. Ensure PRIVY_APP_ID and PRIVY_APP_SECRET are set.');
  }

  // Use _get as per SDK implementation for this version
  return await privyServer.users()._get(userId);
}

export async function updatePrivyUserMetadata(userId: string, metadata: Record<string, any>) {
  if (isMock) {
    console.log(`[Privy Mock] Updating user ${userId} custom metadata:`, metadata);
    const user = getOrCreateMockUser(userId);
    user.custom_metadata = {
      ...user.custom_metadata,
      ...metadata
    };
    return user;
  }

  if (!privyServer) {
    throw new Error('Privy Server Client is not initialized. Ensure PRIVY_APP_ID and PRIVY_APP_SECRET are set.');
  }

  return await privyServer.users().setCustomMetadata(userId, {
    custom_metadata: metadata
  });
}

