import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
`;

const DepartmentSection = styled.div`
  margin-bottom: 24px;
`;

const DepartmentTitle = styled.h4`
  font-size: 14px;
  font-weight: 800;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f97316;
  display: inline-block;
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f9fafb;
    font-weight: 700;
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
  }

  tr:last-child td {
    border-bottom: none;
  }

  td {
    font-size: 14px;
    color: #111827;
  }
`;

const StatusBadge = styled.span<{ active: boolean }>`
  background-color: ${props => props.active ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.active ? '#166534' : '#991b1b'};
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
`;

interface ExpeditionMember {
  id: string;
  walletNumber: string;
  status: string;
  kpiContribution: number;
}

interface ExpeditionData {
  companyName: string;
  expedition: Record<string, ExpeditionMember[]>;
}

export const ExpeditionView: React.FC = () => {
  const { user, authenticated, getAccessToken } = usePrivy();
  const [data, setData] = useState<ExpeditionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpedition = async () => {
      if (!authenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const token = await getAccessToken();
        if (!token) throw new Error('No access token available');

        const res = await fetch('/api/mountain/expedition', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || 'Failed to fetch expedition data');
        }

        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error('Error fetching expedition:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpedition();
  }, [user, authenticated, getAccessToken]);

  if (loading) return <Container>Preparando a expedição...</Container>;
  if (!authenticated) return <Container>Por favor, conecte-se para ver a expedição.</Container>;
  if (error) return <Container>Erro: {error}</Container>;
  if (!data) return null;

  return (
    <Container>
      <div className="mb-6">
        <h3 className="text-2xl font-black text-gray-900">Expedição: Visão do Time</h3>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe quem está escalando a montanha com você na {data.companyName}.
        </p>
      </div>

      {Object.entries(data.expedition).map(([deptName, members]) => (
        <DepartmentSection key={deptName}>
          <DepartmentTitle>[ DEPARTAMENTO: {deptName} ]</DepartmentTitle>
          <MemberTable>
            <thead>
              <tr>
                <th>Membro (Wallet)</th>
                <th>Status</th>
                <th>KPI Contribuído</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td className="font-mono text-sm">{member.walletNumber.substring(0, 10)}...</td>
                  <td>
                    <StatusBadge active={member.status === 'Ativo'}>{member.status}</StatusBadge>
                  </td>
                  <td className="font-bold text-gray-700">{member.kpiContribution}%</td>
                </tr>
              ))}
            </tbody>
          </MemberTable>
        </DepartmentSection>
      ))}

      <button className="mt-4 text-orange-600 font-bold text-sm flex items-center gap-2 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors">
        [+] Convidar novo membro para este departamento
      </button>
    </Container>
  );
};
