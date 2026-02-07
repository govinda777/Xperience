import {
  AgentInspectorState,
  AgentNodeState,
  AgentToolRun,
  AgentLogEvent,
  AgentVariables
} from '../types/agent';

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
    context = []
  } = backendState;

  // 1. Process Nodes (States)
  const nodes = processNodes(auditLog);

  // 2. Process Logs
  const logs = processLogs(auditLog, messages);

  // 3. Process Tool Runs
  const toolRuns = processToolRuns(messages);

  // 4. Process Variables
  const variables: AgentVariables = {
    intent: intent || 'unknown',
    slots: {}, // Backend doesn't return slots yet, keep empty
    ragContext: Array.isArray(context) ? context.map((c: any) => ({
      title: c.title || 'Untitled',
      score: c.score || 0,
      source: c.source
    })) : [],
    rawState: backendState
  };

  // Determine current node (last one in audit log)
  const lastStep = auditLog.length > 0 ? auditLog[auditLog.length - 1].step : 'hydration';
  const currentNode = mapStepToNodeName(lastStep);

  return {
    sessionId: sessionId || 'unknown',
    userDisplayName: 'User', // Placeholder
    channel: 'web', // Default to web for now
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
  variables: { slots: {}, ragContext: [], rawState: null },
  toolRuns: [],
  logs: []
});

const INITIAL_NODES: AgentNodeState[] = [
  { name: 'hydration', label: 'HYDRATION', status: 'pending' },
  { name: 'perception', label: 'PERCEPTION', status: 'pending' },
  { name: 'retrieval', label: 'RETRIEVAL', status: 'pending' },
  { name: 'reasoning', label: 'REASONING', status: 'pending' },
  { name: 'tool_execution', label: 'TOOL_EXEC', status: 'pending' },
  { name: 'response', label: 'RESPONSE', status: 'pending' },
  { name: 'state_update', label: 'STATE_UPDATE', status: 'pending' },
];

const mapStepToNodeName = (step: string): AgentNodeState['name'] => {
  const map: Record<string, AgentNodeState['name']> = {
    'Hydration': 'hydration',
    'Perception': 'perception',
    'Retrieval': 'retrieval',
    'Reasoning': 'reasoning',
    'Tool Execution': 'tool_execution',
    'Response': 'response',
    'StateUpdate': 'state_update',
    'State Update': 'state_update'
  };
  return map[step] || 'hydration';
};

const processNodes = (auditLog: any[]): AgentNodeState[] => {
  const nodes = JSON.parse(JSON.stringify(INITIAL_NODES)); // Deep copy

  auditLog.forEach((entry, index) => {
    const nodeName = mapStepToNodeName(entry.step);
    const nodeIndex = nodes.findIndex((n: any) => n.name === nodeName);

    if (nodeIndex !== -1) {
      nodes[nodeIndex].status = 'done';

      // Calculate duration
      const startTime = new Date(entry.timestamp).getTime();
      let endTime = startTime;

      // Look for next entry to calculate duration
      if (index < auditLog.length - 1) {
        endTime = new Date(auditLog[index + 1].timestamp).getTime();
      }

      nodes[nodeIndex].durationMs = Math.max(0, endTime - startTime);
    }
  });

  return nodes;
};

const processLogs = (auditLog: any[], messages: any[]): AgentLogEvent[] => {
  const logs: AgentLogEvent[] = [];

  // Audit logs
  auditLog.forEach((entry, idx) => {
    logs.push({
      id: `audit-${idx}`,
      timestamp: entry.timestamp,
      type: 'system',
      message: `[${entry.step}] ${entry.details}`
    });
  });

  // Message logs (simplified)
  messages.forEach((msg, idx) => {
    // Only add interesting events
    if (msg.role === 'tool' || (msg.tool_calls && msg.tool_calls.length > 0)) {
         // These are covered in tool runs usually, but let's add LLM decision log
         if (msg.tool_calls && msg.tool_calls.length > 0) {
             logs.push({
                 id: `msg-${idx}`,
                 timestamp: new Date().toISOString(), // We don't have msg timestamp in simple objects
                 type: 'llm',
                 message: `Decided to call tools: ${msg.tool_calls.map((tc: any) => tc.name).join(', ')}`
             });
         }
    }
  });

  // Sort by time (approximated)
  return logs.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
};

const processToolRuns = (messages: any[]): AgentToolRun[] => {
  const runs: AgentToolRun[] = [];

  // We need to pair tool_calls (AIMessage) with tool results (ToolMessage)
  // This is tricky without strict IDs, but LangChain messages usually have `tool_call_id`.

  const toolCallsMap = new Map<string, any>();

  messages.forEach(msg => {
      if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
          msg.tool_calls.forEach((tc: any) => {
              toolCallsMap.set(tc.id, {
                  call: tc,
                  startTime: new Date().toISOString() // Approximation
              });
          });
      }
  });

  messages.forEach(msg => {
      if (msg.role === 'tool' && msg.tool_call_id) {
          const pending = toolCallsMap.get(msg.tool_call_id);
          if (pending) {
              runs.push({
                  id: msg.tool_call_id,
                  name: pending.call.name,
                  status: 'ok',
                  startedAt: pending.startTime,
                  finishedAt: new Date().toISOString(), // Approximation
                  inputSummary: JSON.stringify(pending.call.args),
                  outputSummary: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
                  durationMs: 100 // Mock duration as we don't have exact start/end
              });
          }
      }
  });

  return runs;
};
