import { User } from '@privy-io/node';
import { IAuthClient, VerifiedClaims } from './IAuthClient.js';
import { WalletInfo } from '../../src/types/session.js';

export class MockAuthClient implements IAuthClient {
  private mockUsers = new Map<string, any>();

  constructor() {
    console.log('[Privy Mock] MockAuthClient initialized.');
  }

  private getOrCreateMockUser(userId: string): any {
    if (!this.mockUsers.has(userId)) {
      this.mockUsers.set(userId, {
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
    return this.mockUsers.get(userId);
  }

  async verifyToken(token: string): Promise<VerifiedClaims | null> {
    console.log(`[Privy Mock] Verifying token: ${token}`);
    const userId = token && token !== 'undefined' && token !== 'null' ? token : 'mock-user-id';
    return {
      user_id: userId,
      session_id: 'mock-session-' + userId,
    };
  }

  async getUser(userId: string): Promise<User> {
    console.log(`[Privy Mock] Fetching user: ${userId}`);
    return this.getOrCreateMockUser(userId) as any as User;
  }

  async updateUserMetadata(userId: string, metadata: Record<string, any>): Promise<User> {
    console.log(`[Privy Mock] Updating user ${userId} custom metadata:`, metadata);
    const user = this.getOrCreateMockUser(userId);
    user.custom_metadata = {
      ...user.custom_metadata,
      ...metadata
    };
    return user as any as User;
  }

  extractWallets(user: User): WalletInfo {
    // For mock, just return the mock address
    const linkedAccounts = user.linked_accounts || [];
    const mockAddress = (linkedAccounts.find((a: any) => a.type === 'wallet') as any)?.address || '0xMockAddress1234567890abcdef';
    
    return {
      embedded: [mockAddress],
      external: [],
      primary: mockAddress
    };
  }
}
