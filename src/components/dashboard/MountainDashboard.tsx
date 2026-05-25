import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardHeader, CardTitle, CardContent } from '../styled/Card';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const MountainVisual = styled.div<{ progress: number }>`
  height: 300px;
  background: linear-gradient(to top, #4ade80 ${props => props.progress}%, #e2e8f0 ${props => props.progress}%);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  transition: all 0.5s ease;
`;

const BaseCamp = styled.div<{ bottom: number, left: number }>`
  position: absolute;
  bottom: ${props => props.bottom}%;
  left: ${props => props.left}%;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transform: translateX(-50%);
`;

const ProgressOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  text-shadow: 1px 1px 2px white;
`;

// Types representing the API response
interface Department {
  id: string;
  departmentName: string;
  progress: number;
}

interface CompanyData {
  id: string;
  name: string;
  status: string;
  businessMapStatus: string;
  totalProgress: number;
  departments: Department[];
  bootcampAllowed: boolean;
}

export const MountainDashboard: React.FC = () => {
  const { user, authenticated, getAccessToken } = usePrivy();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!authenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const token = await getAccessToken();
        if (!token) {
           setError('No access token available');
           setLoading(false);
           return;
        }

        const res = await fetch('/api/mountain/status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || 'Failed to fetch mountain status');
        }

        const data = await res.json();
        setCompanyData(data.companyData);
      } catch (err: any) {
        console.error('Error fetching mountain status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user, authenticated, getAccessToken]);

  if (loading) return <div>Carregando a Montanha...</div>;
  if (!authenticated) return <div>Por favor, conecte sua carteira para ver a montanha.</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!companyData) return <div>Dados da empresa não encontrados.</div>;

  return (
    <DashboardContainer>
      <Card>
        <CardHeader>
          <CardTitle>A Jornada: {companyData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: <strong>{companyData.status}</strong></p>
          <p>Mapa do Negócio: <strong>{companyData.businessMapStatus}</strong></p>
          <p>Acesso ao Bootcamp: <strong>{companyData.bootcampAllowed ? 'Liberado' : 'Bloqueado'}</strong></p>

          <MountainVisual progress={companyData.totalProgress}>
            <ProgressOverlay>{companyData.totalProgress}%</ProgressOverlay>
            {companyData.departments.map((dept, index) => {
              // Distribute base camps along the mountain visually
              const safeTotalProgress = companyData.totalProgress > 0 ? companyData.totalProgress : 1;
              const bottomPos = (dept.progress / safeTotalProgress) * 80; // approximate height
              const leftPos = 20 + (index * 30); // space them out horizontally
              return (
                <BaseCamp key={dept.id} bottom={bottomPos} left={leftPos}>
                  {dept.departmentName} ({dept.progress}%)
                </BaseCamp>
              );
            })}
          </MountainVisual>
        </CardContent>
      </Card>
    </DashboardContainer>
  );
};
