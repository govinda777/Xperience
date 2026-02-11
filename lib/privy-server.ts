import { PrivyClient, User } from '@privy-io/node';

const appId = process.env.PRIVY_APP_ID || process.env.VITE_PRIVY_APP_ID;
const appSecret = process.env.PRIVY_APP_SECRET;

if (!appId || !appSecret) {
  throw new Error('Missing Privy environment variables: PRIVY_APP_ID (or VITE_PRIVY_APP_ID) and PRIVY_APP_SECRET must be set.');
}

export const privyServer = new PrivyClient({
  appId,
  appSecret,
});

export async function verifyPrivyToken(token: string) {
  try {
    const claims = await privyServer.utils().auth().verifyAccessToken(token);
    return claims;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getPrivyUser(userId: string): Promise<User> {
  // Use _get as per SDK implementation for this version
  return await privyServer.users()._get(userId);
}

export async function updatePrivyUserMetadata(userId: string, metadata: Record<string, any>) {
  return await privyServer.users().setCustomMetadata(userId, {
    custom_metadata: metadata
  });
}
