import { User } from '@privy-io/node';

export interface VerifiedClaims {
  user_id: string;
  session_id?: string;
  [key: string]: any;
}

import { WalletInfo } from '../../src/types/session.js';

export interface IAuthClient {
  verifyToken(token: string): Promise<VerifiedClaims | null>;
  getUser(userId: string): Promise<User>;
  updateUserMetadata(userId: string, metadata: Record<string, any>): Promise<User>;
  extractWallets(user: User): WalletInfo;
}
