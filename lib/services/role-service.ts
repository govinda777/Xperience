import { getPrivyUser, updatePrivyUserMetadata } from '../privy-server';
import { UserRole } from '../../src/types/session';

interface StoredMetadata {
  role: string;
  permissions: string; // JSON string
  updatedAt: number;
}

export class RoleService {
  private static rolePermissions: Record<UserRole, string[]> = {
    admin: ['read', 'write', 'delete', 'manage_users', 'configure'],
    developer: ['read', 'write', 'deploy', 'debug'],
    user: ['read', 'write'],
    viewer: ['read']
  };

  static getPermissions(role: UserRole): string[] {
    return this.rolePermissions[role] || this.rolePermissions.user;
  }

  static async setUserRole(userId: string, role: UserRole): Promise<void> {
    const permissions = this.getPermissions(role);
    const metadata = {
      role,
      permissions: JSON.stringify(permissions),
      updatedAt: Date.now()
    };

    await updatePrivyUserMetadata(userId, metadata);
  }

  static async getUserRole(userId: string): Promise<UserRole> {
    const user = await getPrivyUser(userId);
    const metadata = user.custom_metadata as unknown as StoredMetadata | undefined;

    const role = metadata?.role as UserRole;
    if (role && ['admin', 'developer', 'user', 'viewer'].includes(role)) {
      return role;
    }
    return 'user';
  }

  static hasPermission(userPermissions: string[], required: string): boolean {
    return userPermissions.includes(required);
  }

  static hasAnyPermission(userPermissions: string[], required: string[]): boolean {
    return required.some(perm => userPermissions.includes(perm));
  }

  static hasAllPermissions(userPermissions: string[], required: string[]): boolean {
    return required.every(perm => userPermissions.includes(perm));
  }
}
