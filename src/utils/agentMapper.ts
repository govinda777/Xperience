import {
  AgentInspectorState,
  AgentNodeState,
  AgentToolRun,
  AgentLogEvent,
  AgentVariables
} from '../types/agent';

const INITIAL_NODES: AgentNodeState[] = [
  { name: 'hydration', label: 'HYDRATION', status: 'pending' },
  { name: 'perception', label: 'PERCEPTION', status: 'pending' },
  { name: 'retrieval', label: 'RETRIEVAL', status: 'pending' },
  { name: 'reasoning', label: 'REASONING', status: 'pending' },
  { name: 'tool_execution', label: 'TOOL_EXEC', status: 'pending' },
  { name: 'response', label: 'RESPONSE', status: 'pending' },
  { name: 'state_update', label: 'STATE_UPDATE', status: 'pending' },
];

const STEP_TO_NODE_NAME: Record<string, AgentNodeState['name']> = {
  'Hydration': 'hydration',
  'Perception': 'perception',
  'Retrieval': 'retrieval',
  'Reasoning': 'reasoning',
  'Tool Execution': 'tool_execution',
  'Response': 'response',
  'StateUpdate': 'state_update',
  'State Update': 'state_update'
};

const NODE_INDEX_MAP: Record<string, number> = INITIAL_NODES.reduce((acc, node, idx) => {
  acc[node.name] = idx;
  return acc;
}, {} as Record<string, number>);

const mapStepToNodeName = (step: string): AgentNodeState['name'] => {
  return STEP_TO_NODE_NAME[step] || 'hydration';
};

export const transformStateToInspector = (backendState: any): AgentInspectorState => {
  if (!backendState) {
    return getEmptyState();
  }

  const {
    sessionId,
    intent,
    securityLevel,
    auditLog = [],
    messages = [],
  } = backendState;

  const nodes: AgentNodeState[] = INITIAL_NODES.map(n => ({ ...n }));
  const logs: AgentLogEvent[] = [];
  const nowIso = new Date().toISOString();

  // 1. Process Audit Log (Nodes & System Logs) in a single pass
  auditLog.forEach((entry: any, index: number) => {
    const nodeName = mapStepToNodeName(entry.step);
    const nodeIndex = NODE_INDEX_MAP[nodeName];

    if (nodeIndex !== undefined) {
      nodes[nodeIndex].status = 'done';

      // Duration calculation
      const startTime = new Date(entry.timestamp).getTime();
      let endTime = startTime;
      if (index < auditLog.length - 1) {
        endTime = new Date(auditLog[index + 1].timestamp).getTime();
      }
      nodes[nodeIndex].durationMs = Math.max(0, endTime - startTime);
    }

    logs.push({
      id: `audit-${index}`,
      timestamp: entry.timestamp,
      type: 'system',
      message: `[${entry.step}] ${entry.details}`
    });
  });

  // 2. Process Messages (Tool Runs & LLM Logs)
  const { toolRuns, messageLogs } = processMessagesOptimized(messages, nowIso);
  logs.push(...messageLogs);

  // 3. Sort logs by timestamp (using string comparison for ISO dates)
  logs.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));

  // 4. Variables
  const variables: AgentVariables = {
    intent: intent || 'unknown',
    slots: {},
    rawState: backendState
  };

  // Current node
  const lastStep = auditLog.length > 0 ? auditLog[auditLog.length - 1].step : 'hydration';
  const currentNode = mapStepToNodeName(lastStep);

  return {
    sessionId: sessionId || 'unknown',
    userDisplayName: 'User',
    channel: 'web',
    currentNode,
    securityLevel: securityLevel || 0,
    messageCount: messages.length,
    toolCount: toolRuns.length,
    nodes,
    variables,
    toolRuns,
    logs
  };
};

const getEmptyState = (): AgentInspectorState => ({
  sessionId: 'pending...',
  channel: 'web',
  currentNode: 'hydration',
  securityLevel: 0,
  messageCount: 0,
  toolCount: 0,
  nodes: INITIAL_NODES.map(n => ({ ...n, status: 'pending' })),
  variables: { slots: {}, rawState: null },
  toolRuns: [],
  logs: []
});

const processMessagesOptimized = (messages: any[], nowIso: string) => {
  const toolRuns: AgentToolRun[] = [];
  const messageLogs: AgentLogEvent[] = [];
  const toolCallsMap = new Map<string, any>();

  // Pass 1: Map tool calls
  messages.forEach(msg => {
    if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
      msg.tool_calls.forEach((tc: any) => {
        toolCallsMap.set(tc.id, {
          call: tc,
          startTime: nowIso
        });
      });
    }
  });

  // Pass 2: Process tool results and LLM decision logs
  messages.forEach((msg, idx) => {
    // Tool runs
    if (msg.role === 'tool' && msg.tool_call_id) {
      const pending = toolCallsMap.get(msg.tool_call_id);
      if (pending) {
        toolRuns.push({
          id: msg.tool_call_id,
          name: pending.call.name,
          status: 'ok',
          startedAt: pending.startTime,
          finishedAt: nowIso,
          inputSummary: JSON.stringify(pending.call.args),
          outputSummary: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
          durationMs: 100
        });
      }
    }

    // Message logs
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      messageLogs.push({
        id: `msg-${idx}`,
        timestamp: nowIso,
        type: 'llm',
        message: `Decided to call tools: ${msg.tool_calls.map((tc: any) => tc.name).join(', ')}`
      });
    }
  });

  return { toolRuns, messageLogs };
};
