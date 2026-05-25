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
  totalProgress: number;
  departments: Department[];
  bootcampAllowed: boolean;
}

export const MountainDashboard: React.FC = () => {
  const { user, authenticated } = usePrivy();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!authenticated || !user) {
        setLoading(false);
        return;
      }

      // In a real implementation, you would fetch from your backend API
      // passing the privyId or walletNumber to identify the user and their company.
      // e.g., const res = await fetch(`/api/company?walletNumber=${user.wallet?.address}`);
      // const data = await res.json();

      // Mocking the backend response for demonstration
      setTimeout(() => {
        setCompanyData({
          id: 'comp_1',
          name: 'Acme Corp',
          status: 'Em subida',
          totalProgress: 75,
          bootcampAllowed: false,
          departments: [
            { id: 'dept_1', departmentName: 'Engineering', progress: 40 },
            { id: 'dept_2', departmentName: 'Marketing', progress: 20 },
            { id: 'dept_3', departmentName: 'Sales', progress: 15 },
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchCompanyData();
  }, [user, authenticated]);

  if (loading) return <div>Carregando a Montanha...</div>;
  if (!authenticated) return <div>Por favor, conecte sua carteira para ver a montanha.</div>;
  if (!companyData) return <div>Dados da empresa não encontrados.</div>;

  return (
    <DashboardContainer>
      <Card>
        <CardHeader>
          <CardTitle>A Jornada: {companyData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: <strong>{companyData.status}</strong></p>
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
