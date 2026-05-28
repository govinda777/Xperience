import { authClient } from '../auth/index.js';
import { UserSession, WalletInfo, UserRole } from '../../src/types/session.js';


export class SessionService {
  static async createSession(
    privyUserId: string,
    sessionId: string
  ): Promise<UserSession> {
    const user = await authClient.getUser(privyUserId);

    // Extract wallets using authClient
    const wallets: WalletInfo = authClient.extractWallets(user);

    // Get role from metadata directly to avoid double fetch
    const metadata = user.custom_metadata as Record<string, any> | undefined;
    const roleStr = metadata?.role;
    const role: UserRole = (roleStr && ['admin', 'developer', 'user', 'viewer'].includes(roleStr))
      ? roleStr as UserRole
      : 'user';

    const permissions: string[] = Array.isArray(metadata?.permissions) ? metadata.permissions : [];

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



  static async refreshSession(sessionId: string, privyUserId: string): Promise<UserSession> {
    return this.createSession(privyUserId, sessionId);
  }
}
