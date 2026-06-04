import { PrivyClient, User } from '@privy-io/node';
import { IAuthClient, VerifiedClaims } from './IAuthClient.js';
import { WalletInfo } from '../../src/types/session.js';

export class PrivyAuthClient implements IAuthClient {
  private client: PrivyClient | null = null;

  constructor() {
    const appId = process.env.PRIVY_APP_ID || process.env.VITE_PRIVY_APP_ID;
    const appSecret = process.env.PRIVY_APP_SECRET;

    if (!appId || !appSecret) {
      console.warn('[Privy Server] WARNING: Missing Privy environment variables: PRIVY_APP_ID (or VITE_PRIVY_APP_ID) and PRIVY_APP_SECRET must be set.');
    } else {
      this.client = new PrivyClient({ appId, appSecret });
      console.log('[Privy Server] ✅ PrivyClient initialized successfully with App ID:', appId);
    }
  }

  private getClient(): PrivyClient {
    if (!this.client) {
      throw new Error('Privy Server Client is not initialized. Ensure PRIVY_APP_ID and PRIVY_APP_SECRET are set.');
    }
    return this.client;
  }

  async verifyToken(token: string): Promise<VerifiedClaims | null> {
    try {
      const client = this.getClient();
      const claims = await client.utils().auth().verifyAccessToken(token);
      return {
        ...claims,
        user_id: (claims as any).userId,
        session_id: (claims as any).sessionId,
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  async getUser(userId: string): Promise<User> {
    const client = this.getClient();
    return await client.users()._get(userId);
  }

  async updateUserMetadata(userId: string, metadata: Record<string, any>): Promise<User> {
    const client = this.getClient();
    
    // The Privy Node SDK's setCustomMetadata replaces the entire object.
    // We fetch the existing user first to perform a shallow merge.
    const user = await client.users()._get(userId);
    const existingMetadata = (user.custom_metadata as Record<string, any>) || {};

    return await client.users().setCustomMetadata(userId, {
      custom_metadata: {
        ...existingMetadata,
        ...metadata
      }
    });
  }

  extractWallets(user: User): WalletInfo {
    const embedded: string[] = [];
    const external: string[] = [];

    const linkedAccounts = user.linked_accounts || [];

    for (const account of linkedAccounts) {
      if (account.type === 'wallet') {
        const address = account.address;
        if (account.connector_type === 'embedded' || account.wallet_client === 'privy') {
          embedded.push(address);
        } else {
          external.push(address);
        }
      }
    }

    const primary = embedded[0] || external[0] || '';

    return { embedded, external, primary };
  }
}
