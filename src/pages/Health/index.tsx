import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, AlertCircle, CheckCircle2, Clock, Settings, RefreshCw, Save } from 'lucide-react';
import styled from 'styled-components';

// --- Interfaces ---

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency_ms: number;
  message: string;
  critical: boolean;
}

interface HealthResponse {
  globalStatus: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  totalLatency_ms: number;
  results: HealthCheck[];
  summary: {
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

interface ServiceConfig {
  name: string;
  enabled: boolean;
  critical: boolean;
  timeout: number;
  thresholds: {
    healthy: number;
    degraded: number;
  };
}

// --- Styled Components ---

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
`;

const ContentWrapper = styled.div`
  max-width: 80rem; /* max-w-7xl */
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
`;

const Subtitle = styled.p`
  color: #4b5563;
  margin-top: 0.5rem;
`;

const GlobalStatusCard = styled.div<{ status: string }>`
  border-left-width: 4px;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  background-color: ${props =>
    props.status === 'healthy' ? '#dcfce7' :
    props.status === 'degraded' ? '#fef9c3' : '#fee2e2'};
  border-color: ${props =>
    props.status === 'healthy' ? '#22c55e' :
    props.status === 'degraded' ? '#eab308' : '#ef4444'};
  color: ${props =>
    props.status === 'healthy' ? '#166534' :
    props.status === 'degraded' ? '#854d0e' : '#991b1b'};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem; /* text-xl */
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 2rem;
  color: #1f2937;
`;

const Card = styled.div<{ status: string }>`
  padding: 1rem;
  border-radius: 0.5rem;
  border-width: 2px;
  background-color: ${props =>
    props.status === 'healthy' ? '#f0fdf4' :
    props.status === 'degraded' ? '#fefce8' : '#fef2f2'};
  border-color: ${props =>
    props.status === 'healthy' ? '#bbf7d0' :
    props.status === 'degraded' ? '#fef08a' : '#fecaca'};
`;

const ConfigPanel = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

// --- Components ---

function StatusIcon({ status }: { status: string }) {
  if (status === 'healthy') return <CheckCircle2 className="h-6 w-6 text-green-500" />;
  if (status === 'degraded') return <AlertCircle className="h-6 w-6 text-yellow-500" />;
  return <AlertCircle className="h-6 w-6 text-red-500" />;
}

function ComponentCard({ component }: { component: HealthCheck }) {
  return (
    <Card status={component.status}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{component.name}</h4>
        <StatusIcon status={component.status} />
      </div>
      <p className="text-sm text-gray-600 mb-1">{component.message}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500 font-mono">Latência: {component.latency_ms}ms</span>
        {component.critical && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">Crítico</span>}
      </div>
    </Card>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function HealthDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('health_token') || '');
  const [showConfig, setShowConfig] = useState(false);
  const queryClient = useQueryClient();

  const saveToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('health_token', newToken);
  };

  const { data, isLoading, error, refetch } = useQuery<HealthResponse>({
    queryKey: ['health', token],
    queryFn: async () => {
      const res = await fetch('/api/health', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) throw new Error('Unauthorized');
      if (!res.ok) throw new Error('Failed to fetch health status');
      return res.json();
    },
    enabled: !!token,
    refetchInterval: 30000,
    retry: false
  });

  const { data: configData } = useQuery<Record<string, ServiceConfig>>({
      queryKey: ['health-config', token],
      queryFn: async () => {
          const res = await fetch('/api/health-config', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch config');
          return res.json();
      },
      enabled: !!token && showConfig
  });

  const updateConfigMutation = useMutation({
      mutationFn: async ({ service, enabled }: { service: string, enabled: boolean }) => {
          const res = await fetch('/api/health-config', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ service, enabled })
          });
          if (!res.ok) throw new Error('Failed to update config');
          return res.json();
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['health'] });
          queryClient.invalidateQueries({ queryKey: ['health-config'] });
      }
  });

  if (!token) {
    return (
      <Container>
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="text-blue-600" /> Acesso Restrito
          </h2>
          <p className="mb-4 text-gray-600">Insira o token de acesso ao dashboard de saúde.</p>
          <Input
            type="password"
            placeholder="Health Check Token"
            onChange={(e) => saveToken(e.target.value)}
          />
        </div>
      </Container>
    );
  }

  if (error && (error as Error).message === 'Unauthorized') {
      return (
        <Container>
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-20 border-l-4 border-red-500">
                <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
                    <AlertCircle /> Acesso Negado
                </h2>
                <p className="mb-4 text-gray-600">O token fornecido é inválido. Por favor, insira o token correto.</p>
                <Input
                    type="password"
                    placeholder="Novo Token"
                    onChange={(e) => saveToken(e.target.value)}
                />
                <Button className="mt-4" onClick={() => refetch()}>Tentar Novamente</Button>
            </div>
        </Container>
      );
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  const criticalComponents = data?.results.filter(c => c.critical) || [];
  const externalServices = data?.results.filter(c => !c.critical) || [];

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <div className="flex justify-between items-start">
            <div>
                <Title>
                    <Shield className="h-8 w-8 text-blue-600" />
                    Xperience - Health Dashboard
                </Title>
                <Subtitle>
                    Última atualização: {data ? new Date(data.timestamp).toLocaleString('pt-BR') : '-'}
                </Subtitle>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => setShowConfig(!showConfig)} className="bg-gray-600 hover:bg-gray-700 flex items-center gap-2">
                    <Settings className="h-4 w-4" /> {showConfig ? 'Ocultar Config' : 'Configurar'}
                </Button>
                <Button onClick={() => refetch()} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" /> Atualizar
                </Button>
            </div>
          </div>
        </Header>

        {data && (
            <GlobalStatusCard status={data.globalStatus}>
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-2xl font-bold">
                    {data.globalStatus === 'healthy' ? '✅ SISTEMA OPERACIONAL' :
                    data.globalStatus === 'degraded' ? '⚠️ SISTEMA DEGRADADO' : '🔴 SISTEMA CRÍTICO'}
                </h2>
                <p className="mt-2 text-lg">
                    {data.summary.healthy}/{data.results.length} componentes operacionais
                </p>
                </div>
                <div className="text-right">
                <p className="font-mono text-sm">Uptime: {formatUptime(data.uptime)}</p>
                <p className="font-mono text-sm">Latência Total: {data.totalLatency_ms}ms</p>
                </div>
            </div>
            </GlobalStatusCard>
        )}

        {showConfig && configData && (
            <ConfigPanel>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" /> Configuração de Serviços
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(configData).map(([key, config]) => (
                                <tr key={key}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{config.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {config.enabled ? 'Ativo' : 'Desativado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => updateConfigMutation.mutate({ service: key, enabled: !config.enabled })}
                                            className={`text-sm font-medium ${config.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                            disabled={updateConfigMutation.isPending}
                                        >
                                            {config.enabled ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ConfigPanel>
        )}

        <SectionTitle>Componentes Críticos ({criticalComponents.length})</SectionTitle>
        <Grid>
          {criticalComponents.map((component, idx) => (
            <ComponentCard key={idx} component={component} />
          ))}
        </Grid>

        <SectionTitle>Serviços Externos ({externalServices.length})</SectionTitle>
        <Grid>
          {externalServices.map((component, idx) => (
            <ComponentCard key={idx} component={component} />
          ))}
        </Grid>

        {data && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4 text-lg">Resumo Geral</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{data.summary.healthy}</p>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mt-1">Saudáveis</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{data.summary.degraded}</p>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mt-1">Degradados</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{data.summary.unhealthy}</p>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mt-1">Críticos</p>
                </div>
            </div>
            </div>
        )}
      </ContentWrapper>
    </Container>
  );
}
