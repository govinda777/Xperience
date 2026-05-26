import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Copy, Check } from 'lucide-react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InviteLinkBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-family: monospace;
  color: #4b5563;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #f97316;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #fffedd;
  }
`;

export const InviteWidget: React.FC = () => {
  const { user } = usePrivy();
  const [copied, setCopied] = useState(false);

  // Derive the wallet number from Privy
  const walletNumber = user?.wallet?.address || user?.email?.address || 'UNKNOWN';

  // Create a mock domain for the invite link
  const inviteLink = `https://xperience.com/join/${walletNumber}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!user) return null;

  return (
    <WidgetContainer>
      <div>
        <h3 className="text-xl font-black text-gray-900">Meu Perfil / Convite</h3>
        <p className="text-sm text-gray-500 mt-1">
          Compartilhe com um novo membro para expandir a sua pirâmide e escalar mais rápido.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Seu Link de Convite (DNA de Acesso):
        </label>
        <InviteLinkBox>
          <span className="truncate mr-4">{inviteLink}</span>
          <CopyButton onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'COPIADO' : 'COPIAR'}
          </CopyButton>
        </InviteLinkBox>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Status</span>
              <span className="text-sm font-medium text-gray-900">Membro da Equipe</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Departamento</span>
              <span className="text-sm font-medium text-gray-900">Engenharia</span> {/* Mocked for now */}
          </div>
      </div>
    </WidgetContainer>
  );
};
