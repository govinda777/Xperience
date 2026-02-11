import { useUserSession } from '../../hooks/useUserSession';

export function SessionInfo() {
  const { session, loading } = useUserSession();

  if (loading) {
    return <div>Carregando sessão...</div>;
  }

  if (!session) {
    return <div>Nenhuma sessão ativa</div>;
  }

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h3 className="font-bold text-lg">Informações da Sessão</h3>

      <div>
        <span className="font-semibold">Privy ID:</span>
        <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
          {session.privyUserId}
        </code>
      </div>

      <div>
        <span className="font-semibold">Role:</span>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {session.role}
        </span>
      </div>

      <div>
        <span className="font-semibold">Carteira Principal:</span>
        <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
          {session.wallets.primary ? `${session.wallets.primary.slice(0, 6)}...${session.wallets.primary.slice(-4)}` : 'Nenhuma'}
        </code>
      </div>

      <div>
        <span className="font-semibold">Carteiras Embedded:</span>
        <span className="ml-2">{session.wallets.embedded.length}</span>
      </div>

      <div>
        <span className="font-semibold">Carteiras Externas:</span>
        <span className="ml-2">{session.wallets.external.length}</span>
      </div>

      <div>
        <span className="font-semibold">Permissões:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {session.permissions.map(perm => (
            <span
              key={perm}
              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
