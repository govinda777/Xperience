import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { UserRole } from '../../types/session';

interface RoleManagerProps {
  userId: string;
  currentRole: UserRole;
  onRoleUpdated?: () => void;
}

export function RoleManager({ userId, currentRole, onRoleUpdated }: RoleManagerProps) {
  const { getAccessToken } = usePrivy();
  const [role, setRole] = useState<UserRole>(currentRole);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const roles: UserRole[] = ['admin', 'developer', 'user', 'viewer'];

  async function handleUpdateRole() {
    try {
      setLoading(true);
      setMessage('');

      const token = await getAccessToken();
      const response = await fetch(`/api/admin/user/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setMessage('Role atualizada com sucesso!');
      onRoleUpdated?.();
    } catch (error) {
      setMessage('Erro ao atualizar role');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 border rounded p-4">
      <h3 className="font-bold">Gerenciar Role do Usuário</h3>
      <div>
        <label className="block font-semibold mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        >
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdateRole}
        disabled={loading || role === currentRole}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        {loading ? 'Atualizando...' : 'Atualizar Role'}
      </button>

      {message && (
        <div className={`p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
