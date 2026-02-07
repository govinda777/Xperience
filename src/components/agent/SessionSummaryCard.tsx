import React from 'react';
import { InspectorCard, CardTitle, KeyValueRow, KeyLabel, ValueLabel } from './AgentStyles';
import { AgentInspectorState } from '../../types/agent';
import { ShieldCheck, MessageSquare, Wrench } from 'lucide-react';

interface Props {
  state: AgentInspectorState;
}

export const SessionSummaryCard: React.FC<Props> = ({ state }) => {
  return (
    <InspectorCard>
      <CardTitle>Resumo da Sessão</CardTitle>

      <KeyValueRow>
        <KeyLabel>Session ID</KeyLabel>
        <ValueLabel title={state.sessionId}>
          {state.sessionId.length > 12 ? state.sessionId.substring(0, 12) + '...' : state.sessionId}
        </ValueLabel>
      </KeyValueRow>

      <KeyValueRow>
        <KeyLabel>Canal</KeyLabel>
        <ValueLabel>{state.channel}</ValueLabel>
      </KeyValueRow>

      <KeyValueRow>
        <KeyLabel>Estado Atual</KeyLabel>
        <ValueLabel>{state.currentNode.toUpperCase()}</ValueLabel>
      </KeyValueRow>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f3f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#495057' }}>
            <ShieldCheck size={14} color="#fcc419" />
            <span>Lvl {state.securityLevel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#495057' }}>
            <MessageSquare size={14} />
            <span>{state.messageCount}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#495057' }}>
            <Wrench size={14} />
            <span>{state.toolCount}</span>
        </div>
      </div>
    </InspectorCard>
  );
};
