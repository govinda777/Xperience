import React, { useState } from 'react';
import styled from 'styled-components';
import { InspectorCard, CardTitle } from './AgentStyles';
import { AgentInspectorState, AgentLogEvent } from '../../types/agent';

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const FilterBadge = styled.button<{ $active: boolean, type: string }>`
  border: 1px solid #dee2e6;
  background: ${props => props.$active ? getBgColor(props.type) : 'white'};
  color: ${props => props.$active ? getColor(props.type) : '#495057'};
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.65rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;

  &:hover {
    background: ${props => props.$active ? getBgColor(props.type) : '#f8f9fa'};
  }
`;

const LogList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LogItem = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f8f9fa;
`;

const Time = styled.span`
  color: #868e96;
  min-width: 60px;
`;

const Tag = styled.span<{ type: string }>`
  color: ${props => getColor(props.type)};
  font-weight: bold;
  min-width: 50px;
`;

const Message = styled.span`
  color: #343a40;
  white-space: pre-wrap;
  word-break: break-all;
`;

function getBgColor(type: string) {
  switch (type) {
    case 'tool': return '#e7f5ff';
    case 'llm': return '#f3f0ff';
    case 'error': return '#ffe3e3';
    default: return '#e9ecef';
  }
}

function getColor(type: string) {
  switch (type) {
    case 'tool': return '#1c7ed6';
    case 'llm': return '#7950f2';
    case 'error': return '#c92a2a';
    default: return '#495057';
  }
}

interface Props {
  state: AgentInspectorState;
}

export const LogsPanelCard: React.FC<Props> = ({ state }) => {
  const [filters, setFilters] = useState<Record<string, boolean>>({
    tool: true,
    llm: true,
    system: false, // Hidden by default
    error: true
  });

  const toggleFilter = (type: string) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredLogs = state.logs.filter(log => filters[log.type]);

  return (
    <InspectorCard>
      <CardTitle>Logs & Eventos</CardTitle>
      <FilterContainer>
        {['tool', 'llm', 'system', 'error'].map(type => (
          <FilterBadge
            key={type}
            type={type}
            $active={filters[type]}
            onClick={() => toggleFilter(type)}
          >
            {type}
          </FilterBadge>
        ))}
      </FilterContainer>

      <LogList>
        {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
            <LogItem key={log.id}>
                <Time>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}</Time>
                <Tag type={log.type}>[{log.type.toUpperCase()}]</Tag>
                <Message>{log.message}</Message>
            </LogItem>
            ))
        ) : (
            <div style={{ color: '#adb5bd', fontStyle: 'italic', padding: '0.5rem' }}>No logs to display</div>
        )}
      </LogList>
    </InspectorCard>
  );
};
