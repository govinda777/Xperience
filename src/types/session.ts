export type UserRole = 'admin' | 'developer' | 'user' | 'viewer';

export interface UserPermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
  manage_users: boolean;
  configure: boolean;
  deploy: boolean;
  debug: boolean;
}

export interface WalletInfo {
  embedded: string[];
  external: string[];
  primary: string;
}

export interface UserSession {
  privyUserId: string;
  sessionId: string;
  wallets: WalletInfo;
  role: UserRole;
  permissions: string[];
  customMetadata: Record<string, any>;
  createdAt: number;
  expiresAt: number;
}

export interface PrivyCustomMetadata {
  role: UserRole;
  permissions: string[];
  updatedAt: number;
  [key: string]: any;
}
