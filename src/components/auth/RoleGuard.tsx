import { ReactNode } from 'react';
import { useUserSession } from '../../hooks/useUserSession';
import { UserRole } from '../../types/session';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // For permissions: require all or just one
}

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermissions,
  fallback,
  requireAll = true
}: RoleGuardProps) {
  const { session, loading } = useUserSession();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return <>{fallback || <div>Acesso negado</div>}</>;
  }

  // Check Role
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <>{fallback || <div>Você não tem permissão para acessar esta área</div>}</>;
  }

  // Check Permissions
  if (requiredPermissions) {
    const hasPermission = requireAll
      ? requiredPermissions.every(p => session.permissions.includes(p))
      : requiredPermissions.some(p => session.permissions.includes(p));

    if (!hasPermission) {
      return <>{fallback || <div>Permissões insuficientes</div>}</>;
    }
  }

  return <>{children}</>;
}
