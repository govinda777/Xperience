import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useUserSession } from '../hooks/useUserSession';
import { SessionInfo } from '../components/user/SessionInfo';
import { RoleGuard } from '../components/auth/RoleGuard';
import { RoleManager } from '../components/admin/RoleManager';

export default function TestSessionPage() {
  const { login, logout, authenticated } = usePrivy();
  const { session, refreshSession } = useUserSession();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Teste de Sessão com Roles</h1>

      {!authenticated ? (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-6 py-3 rounded"
        >
          Login com Privy
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-3 rounded"
            >
              Logout
            </button>

            <button
              onClick={refreshSession}
              className="bg-green-500 text-white px-6 py-3 rounded"
            >
              Refresh Session
            </button>
          </div>
        </div>
      )}

      {session && (
        <>
          <SessionInfo />

          {/* Admin Panel to change own role for testing */}
          <RoleGuard allowedRoles={['admin']}>
             <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Admin Area: Change User Role</h2>
                <RoleManager
                    userId={session.privyUserId}
                    currentRole={session.role}
                    onRoleUpdated={refreshSession}
                />
             </div>
          </RoleGuard>

          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold">Testes de Permissão</h2>

            <RoleGuard allowedRoles={['admin']}>
              <div className="border-2 border-red-500 p-4 rounded bg-red-50 text-red-900">
                ✅ Você vê isso porque é ADMIN
              </div>
            </RoleGuard>

            <RoleGuard allowedRoles={['admin', 'developer']}>
              <div className="border-2 border-blue-500 p-4 rounded bg-blue-50 text-blue-900">
                ✅ Você vê isso porque é ADMIN ou DEVELOPER
              </div>
            </RoleGuard>

            <RoleGuard requiredPermissions={['write']}>
              <div className="border-2 border-green-500 p-4 rounded bg-green-50 text-green-900">
                ✅ Você vê isso porque tem permissão de WRITE
              </div>
            </RoleGuard>

            <RoleGuard requiredPermissions={['delete']}>
              <div className="border-2 border-yellow-500 p-4 rounded bg-yellow-50 text-yellow-900">
                ✅ Você vê isso porque tem permissão de DELETE
              </div>
            </RoleGuard>
          </div>
        </>
      )}
    </div>
  );
}
