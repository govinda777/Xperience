import React, { useState } from 'react';
import styled from 'styled-components';
import { InspectorCard, CardTitle, KeyValueRow, KeyLabel, ValueLabel } from './AgentStyles';
import { AgentInspectorState } from '../../types/agent';

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 0.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: ${props => props.$active ? '#007bff' : '#6c757d'};
  font-weight: ${props => props.$active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.$active ? '#007bff' : 'transparent'};

  &:hover {
    color: #007bff;
  }
`;

const TabContent = styled.div`
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.8rem;
`;

const CodeBlock = styled.pre`
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  margin: 0;
  font-size: 0.7rem;
  color: #343a40;
`;

interface Props {
  state: AgentInspectorState;
}

export const VariablesPanelCard: React.FC<Props> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<'intent' | 'context' | 'raw'>('intent');

  return (
    <InspectorCard>
      <CardTitle>Variáveis & Contexto</CardTitle>
      <TabContainer>
        <Tab $active={activeTab === 'intent'} onClick={() => setActiveTab('intent')}>Intent/Slots</Tab>
        <Tab $active={activeTab === 'context'} onClick={() => setActiveTab('context')}>RAG Context</Tab>
        <Tab $active={activeTab === 'raw'} onClick={() => setActiveTab('raw')}>JSON Raw</Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'intent' && (
          <div>
            <KeyValueRow>
                <KeyLabel>Intent</KeyLabel>
                <ValueLabel>{state.variables.intent}</ValueLabel>
            </KeyValueRow>
            {Object.keys(state.variables.slots).length > 0 ? (
                Object.entries(state.variables.slots).map(([key, val]) => (
                    <KeyValueRow key={key}>
                        <KeyLabel>{key}</KeyLabel>
                        <ValueLabel>{String(val)}</ValueLabel>
                    </KeyValueRow>
                ))
            ) : (
                <div style={{ color: '#adb5bd', fontStyle: 'italic', padding: '0.5rem' }}>No slots detected</div>
            )}
          </div>
        )}

        {activeTab === 'context' && (
          <div>
             {state.variables.ragContext.length > 0 ? (
                 <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                     {state.variables.ragContext.map((ctx, idx) => (
                         <li key={idx} style={{ marginBottom: '0.5rem' }}>
                             <div style={{ fontWeight: 600 }}>{ctx.title}</div>
                             <div style={{ color: '#868e96', fontSize: '0.7rem' }}>Score: {ctx.score.toFixed(2)}</div>
                         </li>
                     ))}
                 </ul>
             ) : (
                <div style={{ color: '#adb5bd', fontStyle: 'italic', padding: '0.5rem' }}>No RAG context loaded</div>
             )}
          </div>
        )}

        {activeTab === 'raw' && (
           <CodeBlock>
               {JSON.stringify(state.variables.rawState, null, 2)}
           </CodeBlock>
        )}
      </TabContent>
    </InspectorCard>
  );
};
