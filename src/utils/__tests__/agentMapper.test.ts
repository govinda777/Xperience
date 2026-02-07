import { transformStateToInspector } from '../agentMapper';

describe('agentMapper', () => {
  it('should handle empty state', () => {
    const result = transformStateToInspector(null);
    expect(result.currentNode).toBe('hydration');
    expect(result.nodes.length).toBe(7);
    expect(result.nodes[0].status).toBe('pending');
  });

  it('should transform backend state correctly', () => {
    const backendState = {
      sessionId: 'session_123',
      intent: 'search',
      securityLevel: 2,
      auditLog: [
        { step: 'Hydration', timestamp: '2025-02-18T10:00:00Z', details: 'Hydrated' },
        { step: 'Perception', timestamp: '2025-02-18T10:00:01Z', details: 'Intent: search' },
      ],
      messages: [],
      context: [
        { title: 'Doc 1', score: 0.9, source: 'KB' }
      ]
    };

    const result = transformStateToInspector(backendState);

    expect(result.sessionId).toBe('session_123');
    expect(result.variables.intent).toBe('search');
    expect(result.securityLevel).toBe(2);

    // Check nodes
    const hydrationNode = result.nodes.find(n => n.name === 'hydration');
    const perceptionNode = result.nodes.find(n => n.name === 'perception');

    expect(hydrationNode?.status).toBe('done');
    expect(hydrationNode?.durationMs).toBe(1000); // 1 sec difference

    expect(perceptionNode?.status).toBe('done');
    expect(perceptionNode?.durationMs).toBe(0); // Last node

    // Check context
    expect(result.variables.ragContext[0].title).toBe('Doc 1');
    expect(result.variables.ragContext[0].score).toBe(0.9);
  });

  it('should process tool runs', () => {
    const backendState = {
      sessionId: 'session_456',
      auditLog: [],
      messages: [
        {
          role: 'assistant',
          tool_calls: [{ id: 'call_1', name: 'search_kb', args: { query: 'test' } }]
        },
        {
          role: 'tool',
          tool_call_id: 'call_1',
          content: 'Found 1 result'
        }
      ]
    };

    const result = transformStateToInspector(backendState);

    expect(result.toolRuns.length).toBe(1);
    expect(result.toolRuns[0].id).toBe('call_1');
    expect(result.toolRuns[0].name).toBe('search_kb');
    expect(result.toolRuns[0].status).toBe('ok');
    expect(result.toolRuns[0].outputSummary).toBe('Found 1 result');
  });

  it('should process logs', () => {
    const backendState = {
      sessionId: 'session_789',
      auditLog: [
         { step: 'Reasoning', timestamp: '2025-02-18T10:00:00Z', details: 'Thinking...' }
      ],
      messages: [
        {
          role: 'assistant',
          tool_calls: [{ id: 'call_2', name: 'calc', args: { expr: '1+1' } }]
        }
      ]
    };

    const result = transformStateToInspector(backendState);

    // Should have 1 system log (audit) and 1 LLM log (tool call decision)
    expect(result.logs.length).toBeGreaterThanOrEqual(2);

    const systemLog = result.logs.find(l => l.type === 'system');
    expect(systemLog?.message).toContain('[Reasoning] Thinking...');

    const llmLog = result.logs.find(l => l.type === 'llm');
    expect(llmLog?.message).toContain('Decided to call tools: calc');
  });
});
