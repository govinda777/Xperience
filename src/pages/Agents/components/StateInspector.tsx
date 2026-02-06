import React from 'react';
import styled from 'styled-components';
import { Card } from '../../../components/styled/styled';

const InspectorContainer = styled.div`
  width: 350px;
  background-color: #f8f9fa;
  border-left: 1px solid #e9ecef;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Geist Mono', monospace;
  font-size: 0.85rem;
  color: #333;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6c757d;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;

  &:first-child {
    margin-top: 0;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
`;

const Label = styled.span`
  color: #666;
`;

const Value = styled.span`
  font-weight: 600;
  color: #212529;
`;

const AuditList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AuditItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: #228be6;
    border-radius: 4px 0 0 4px;
  }
`;

const StepName = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
`;

const StepTime = styled.span`
  font-size: 0.7rem;
  color: #868e96;
`;

const StepDetails = styled.div`
  color: #495057;
  font-size: 0.8rem;
`;

const JsonView = styled.pre`
  background: #212529;
  color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.75rem;
  margin: 0;
`;

interface StateInspectorProps {
  state: any;
  isLoading?: boolean;
}

export const StateInspector: React.FC<StateInspectorProps> = ({ state, isLoading }) => {
  if (!state) {
    return (
      <InspectorContainer>
        <SectionTitle>Status</SectionTitle>
        <div style={{ padding: '1rem', textAlign: 'center', color: '#868e96' }}>
            Waiting for agent state...
        </div>
      </InspectorContainer>
    );
  }

  const { intent, securityLevel, sessionId, auditLog } = state;

  return (
    <InspectorContainer>
      <SectionTitle>Metadata</SectionTitle>
      <InfoRow>
        <Label>Session ID</Label>
        <Value>{sessionId ? sessionId.substring(0, 8) + '...' : 'N/A'}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Intent</Label>
        <Value>{intent || 'Detecting...'}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Security Level</Label>
        <Value>🔒 Level {securityLevel || 0}</Value>
      </InfoRow>

      <SectionTitle>Audit Trail</SectionTitle>
      <AuditList>
        {auditLog?.map((log: any, index: number) => (
          <AuditItem key={index}>
            <StepName>
              {log.step}
              <StepTime>{new Date(log.timestamp).toLocaleTimeString()}</StepTime>
            </StepName>
            <StepDetails>{log.details}</StepDetails>
          </AuditItem>
        ))}
        {isLoading && (
            <AuditItem style={{ opacity: 0.7 }}>
                <StepName>Processing...</StepName>
            </AuditItem>
        )}
      </AuditList>

      <SectionTitle>Raw State</SectionTitle>
      <JsonView>
        {JSON.stringify(state, null, 2)}
      </JsonView>
    </InspectorContainer>
  );
};
