import React, { useState } from 'react';
import styled from 'styled-components';
import { InspectorCard, CardTitle } from './AgentStyles';
import { AgentInspectorState } from '../../types/agent';
import { ChevronRight, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';

const ToolItem = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;

  &:hover {
    background: #e9ecef;
  }
`;

const ToolBody = styled.div`
  padding: 0.5rem;
  border-top: 1px solid #e9ecef;
  background: white;
  font-size: 0.75rem;
`;

const CodeSnippet = styled.pre`
  background: #212529;
  color: #f1f3f5;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.25rem 0;
  font-family: monospace;
`;

const Label = styled.div`
  font-weight: 600;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  color: #495057;

  &:first-child {
    margin-top: 0;
  }
`;

interface Props {
  state: AgentInspectorState;
}

export const ToolsTraceCard: React.FC<Props> = ({ state }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <InspectorCard>
      <CardTitle>Tools Trace</CardTitle>
      {state.toolRuns.length > 0 ? (
          <div>
              {state.toolRuns.map(run => (
                  <ToolItem key={run.id}>
                      <ToolHeader onClick={() => toggleExpand(run.id)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                             {expandedId === run.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                             <span>{run.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#868e96', fontSize: '0.7rem' }}>{run.durationMs}ms</span>
                              {run.status === 'ok' ? (
                                  <CheckCircle size={14} color="#2b8a3e" />
                              ) : (
                                  <AlertCircle size={14} color="#c92a2a" />
                              )}
                          </div>
                      </ToolHeader>
                      {expandedId === run.id && (
                          <ToolBody>
                              <Label>Input</Label>
                              <CodeSnippet>{run.inputSummary}</CodeSnippet>

                              <Label>Output</Label>
                              <CodeSnippet>{run.outputSummary || 'No output'}</CodeSnippet>
                          </ToolBody>
                      )}
                  </ToolItem>
              ))}
          </div>
      ) : (
          <div style={{ color: '#adb5bd', fontStyle: 'italic', padding: '0.5rem' }}>No tools executed</div>
      )}
    </InspectorCard>
  );
};
