import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionSummaryCard } from '../SessionSummaryCard';
import { AgentStatesCard } from '../AgentStatesCard';
import { VariablesPanelCard } from '../VariablesPanelCard';
import { ToolsTraceCard } from '../ToolsTraceCard';
import { LogsPanelCard } from '../LogsPanelCard';
import { AgentInspectorState } from '../../../types/agent';
import '@testing-library/jest-dom';

// Mock state
const mockState: AgentInspectorState = {
  sessionId: 'session_12345',
  userDisplayName: 'User',
  channel: 'web',
  currentNode: 'tool_execution',
  securityLevel: 2,
  messageCount: 5,
  toolCount: 1,
  nodes: [
    { name: 'hydration', label: 'HYDRATION', status: 'done', durationMs: 10 },
    { name: 'perception', label: 'PERCEPTION', status: 'done', durationMs: 20 },
    { name: 'tool_execution', label: 'TOOL_EXEC', status: 'running' },
  ],
  variables: {
    intent: 'check_status',
    slots: { order_id: '123' },
    ragContext: [{ title: 'Order Policy', score: 0.95, source: 'KB' }],
    rawState: { foo: 'bar' }
  },
  toolRuns: [
    {
      id: 'tool_1',
      name: 'get_order',
      status: 'ok',
      startedAt: '2025-01-01T00:00:00Z',
      inputSummary: '{"id":"123"}',
      outputSummary: 'Found',
      durationMs: 50
    }
  ],
  logs: [
    { id: 'log_1', timestamp: '2025-01-01T00:00:00Z', type: 'system', message: 'System init' },
    { id: 'log_2', timestamp: '2025-01-01T00:00:01Z', type: 'llm', message: 'LLM thinking' },
  ]
};

describe('Agent Components', () => {

  test('SessionSummaryCard renders correctly', () => {
    render(<SessionSummaryCard state={mockState} />);
    expect(screen.getByText('Resumo da Sessão')).toBeInTheDocument();
    // Session ID is truncated if > 12 chars. 'session_12345' is 13 chars.
    expect(screen.getByText('session_1234...')).toBeInTheDocument();
    expect(screen.getByText('TOOL_EXECUTION')).toBeInTheDocument();
    expect(screen.getByText('Lvl 2')).toBeInTheDocument();
  });

  test('AgentStatesCard renders nodes and statuses', () => {
    render(<AgentStatesCard state={mockState} />);
    expect(screen.getByText('Estados do Agente')).toBeInTheDocument();
    expect(screen.getByText('HYDRATION')).toBeInTheDocument();
    expect(screen.getByText('10ms')).toBeInTheDocument();
    // Running node
    expect(screen.getByText('TOOL_EXEC')).toBeInTheDocument();
  });

  test('VariablesPanelCard switches tabs', () => {
    render(<VariablesPanelCard state={mockState} />);

    // Default: Intent tab
    expect(screen.getByText('Intent')).toBeInTheDocument();
    expect(screen.getByText('check_status')).toBeInTheDocument();
    expect(screen.getByText('order_id')).toBeInTheDocument();

    // Switch to Context tab
    fireEvent.click(screen.getByText('RAG Context'));
    expect(screen.getByText('Order Policy')).toBeInTheDocument();
    expect(screen.getByText('Score: 0.95')).toBeInTheDocument();

    // Switch to Raw JSON tab
    fireEvent.click(screen.getByText('JSON Raw'));
    // We expect the JSON content to be visible. Text matching might be tricky due to formatting,
    // so let's just check if the pre tag exists or some unique string
    expect(screen.getByText(/"foo": "bar"/)).toBeInTheDocument();
  });

  test('ToolsTraceCard expands and collapses', () => {
    render(<ToolsTraceCard state={mockState} />);

    expect(screen.getByText('Tools Trace')).toBeInTheDocument();
    const toolHeader = screen.getByText('get_order');
    expect(toolHeader).toBeInTheDocument();

    // Not expanded yet
    expect(screen.queryByText('Input')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(toolHeader);
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('{"id":"123"}')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(toolHeader);
    expect(screen.queryByText('Input')).not.toBeInTheDocument();
  });

  test('LogsPanelCard filters logs', () => {
    render(<LogsPanelCard state={mockState} />);

    expect(screen.getByText('Logs & Eventos')).toBeInTheDocument();

    // Initially system is false, tool/llm/error true
    expect(screen.getByText('LLM thinking')).toBeInTheDocument();
    expect(screen.queryByText('System init')).not.toBeInTheDocument();

    // Enable system filter
    const systemFilter = screen.getByText('system');
    fireEvent.click(systemFilter);
    expect(screen.getByText('System init')).toBeInTheDocument();

    // Disable llm filter
    const llmFilter = screen.getByText('llm');
    fireEvent.click(llmFilter);
    expect(screen.queryByText('LLM thinking')).not.toBeInTheDocument();
  });

});
