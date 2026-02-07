import React, { useMemo } from 'react';
import { AgentPanelContainer } from './AgentStyles';
import { SessionSummaryCard } from './SessionSummaryCard';
import { AgentStatesCard } from './AgentStatesCard';
import { VariablesPanelCard } from './VariablesPanelCard';
import { ToolsTraceCard } from './ToolsTraceCard';
import { LogsPanelCard } from './LogsPanelCard';
import { transformStateToInspector } from '../../utils/agentMapper';

interface Props {
  state: any; // Raw backend state
  isLoading?: boolean;
}

export const AgentInspectorPanel: React.FC<Props> = ({ state, isLoading }) => {
  // Memoize transformation to avoid recalculating on every render unless state changes
  const inspectorState = useMemo(() => {
    return transformStateToInspector(state);
  }, [state]);

  // If loading, we might want to show a loading state in the inspector
  // For now, we update the status of the current node to 'running' if loading
  if (isLoading && inspectorState.currentNode) {
      // Find the pending node after the done ones, or defaults
      // This is a simple visual hack for better UX
      const runningNodeIndex = inspectorState.nodes.findIndex(n => n.status === 'pending');
      if (runningNodeIndex !== -1) {
          inspectorState.nodes[runningNodeIndex].status = 'running';
      }
  }

  return (
    <AgentPanelContainer>
      <SessionSummaryCard state={inspectorState} />
      <AgentStatesCard state={inspectorState} />
      <VariablesPanelCard state={inspectorState} />
      <ToolsTraceCard state={inspectorState} />
      <LogsPanelCard state={inspectorState} />
    </AgentPanelContainer>
  );
};
