import { getPrivyUser } from '../privy-server';
import { UserSession, WalletInfo, UserRole } from '../../src/types/session';
import { RoleService } from './role-service';

export class SessionService {
  static async createSession(
    privyUserId: string,
    sessionId: string
  ): Promise<UserSession> {
    const user = await getPrivyUser(privyUserId);

    // Extract wallets
    const wallets: WalletInfo = this.extractWallets(user.linked_accounts || []);

    // Get role from metadata directly to avoid double fetch
    const metadata = user.custom_metadata as Record<string, any> | undefined;
    const roleStr = metadata?.role;
    const role: UserRole = (roleStr && ['admin', 'developer', 'user', 'viewer'].includes(roleStr))
      ? roleStr as UserRole
      : 'user';

    const permissions = RoleService.getPermissions(role);

    const session: UserSession = {
      privyUserId: user.id,
      sessionId,
      wallets,
      role,
      permissions,
      customMetadata: metadata || {},
      createdAt: user.created_at,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    return session;
  }

  private static extractWallets(linkedAccounts: any[]): WalletInfo {
    const embedded: string[] = [];
    const external: string[] = [];

    for (const account of linkedAccounts) {
      if (account.type === 'wallet') {
        const address = account.address;
        // Check for embedded wallet indicators
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

  static async refreshSession(sessionId: string, privyUserId: string): Promise<UserSession> {
    return this.createSession(privyUserId, sessionId);
  }
}
