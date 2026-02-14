import React, { useMemo, useState } from 'react';
import { AgentPanelContainer } from './AgentStyles';
import { SessionSummaryCard } from './SessionSummaryCard';
import { AgentStatesCard } from './AgentStatesCard';
import { VariablesPanelCard } from './VariablesPanelCard';
import { ToolsTraceCard } from './ToolsTraceCard';
import { LogsPanelCard } from './LogsPanelCard';
import { KnowledgeUploader } from './KnowledgeUploader';
import { CommandInput } from './CommandInput';
import { transformStateToInspector } from '../../utils/agentMapper';
import { CommandProcessor } from '../../services/agent/CommandProcessor';

interface Props {
  state: any; // Raw backend state
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

export const AgentInspectorPanel: React.FC<Props> = ({ state, isLoading, onSendMessage }) => {
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

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

  const handleCommand = async (command: string, message: string) => {
    // Processa comando com contexto preservado
    const contextualPrompt = await CommandProcessor.process(
      command,
      message,
      conversationHistory
    );

    // Adiciona à história (simplificado, idealmente viria do backend)
    setConversationHistory(prev => [...prev, `User: ${message}`, `Command: ${command}`]);

    // Envia para o agente se a função estiver disponível
    if (onSendMessage) {
      onSendMessage(contextualPrompt);
    } else {
      console.log('Prompt contextual (não enviado):', contextualPrompt);
    }
  };

  return (
    <AgentPanelContainer>
      <KnowledgeUploader />
      <CommandInput onCommand={handleCommand} disabled={isLoading} />

      <SessionSummaryCard state={inspectorState} />
      <AgentStatesCard state={inspectorState} />
      <VariablesPanelCard state={inspectorState} />
      <ToolsTraceCard state={inspectorState} />
      <LogsPanelCard state={inspectorState} />
    </AgentPanelContainer>
  );
};
