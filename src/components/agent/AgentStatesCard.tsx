import React from 'react';
import styled from 'styled-components';
import { InspectorCard, CardTitle, StatusBadge } from './AgentStyles';
import { AgentInspectorState } from '../../types/agent';
import { Check, Loader, Circle, X } from 'lucide-react';

const StepList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StepItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f8f9fa;

  &:last-child {
    border-bottom: none;
  }
`;

const StepName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #343a40;
`;

const StepTime = styled.span`
  font-size: 0.75rem;
  color: #868e96;
  font-family: monospace;
`;

interface Props {
  state: AgentInspectorState;
}

export const AgentStatesCard: React.FC<Props> = ({ state }) => {
  return (
    <InspectorCard>
      <CardTitle>Estados do Agente</CardTitle>
      <StepList>
        {state.nodes.map((node, index) => (
          <StepItem key={node.name}>
            <StepName>
                <span style={{ color: '#adb5bd', fontSize: '0.7rem', width: '15px' }}>{index + 1}.</span>
                {node.label}
            </StepName>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {node.status === 'done' && <Check size={14} color="#2b8a3e" />}
                {node.status === 'running' && <Loader size={14} className="spin" color="#f08c00" />}
                {node.status === 'error' && <X size={14} color="#c92a2a" />}
                {node.status === 'pending' && <Circle size={8} color="#dee2e6" fill="#dee2e6" />}

                {node.durationMs !== undefined && (
                    <StepTime>{node.durationMs}ms</StepTime>
                )}
            </div>
          </StepItem>
        ))}
      </StepList>
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </InspectorCard>
  );
};
