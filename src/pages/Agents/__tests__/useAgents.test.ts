import { renderHook, act } from '@testing-library/react';
import { useAgents } from '../useAgents';

describe('useAgents Hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should initialize with empty agents', () => {
    const { result } = renderHook(() => useAgents());
    expect(result.current.agents).toEqual([]);
  });

  it('should add an agent', () => {
    const { result } = renderHook(() => useAgents());

    act(() => {
      result.current.addAgent({
        name: 'Test Agent',
        role: 'Tester',
        description: 'Testing'
      });
    });

    expect(result.current.agents).toHaveLength(1);
    expect(result.current.agents[0].name).toBe('Test Agent');
    expect(result.current.agents[0].id).toBeDefined();
  });

  it('should delete an agent', () => {
    const { result } = renderHook(() => useAgents());

    let agentId: string = '';
    act(() => {
      const agent = result.current.addAgent({
        name: 'Test Agent',
        role: 'Tester',
        description: 'Testing'
      });
      agentId = agent.id;
    });

    expect(result.current.agents).toHaveLength(1);

    act(() => {
      result.current.deleteAgent(agentId);
    });

    expect(result.current.agents).toHaveLength(0);
  });

  it('should add messages to an agent chat', () => {
    const { result } = renderHook(() => useAgents());
    const agentId = 'test-id';

    act(() => {
      result.current.addMessage(agentId, {
        role: 'user',
        content: 'Hello'
      });
    });

    expect(result.current.getMessages(agentId)).toHaveLength(1);
    expect(result.current.getMessages(agentId)[0].content).toBe('Hello');
  });

  it('should persist data to sessionStorage', () => {
    const { result } = renderHook(() => useAgents());

    act(() => {
      result.current.addAgent({
        name: 'Persisted Agent',
        role: 'Bot',
        description: 'Desc'
      });
    });

    const storedAgents = JSON.parse(sessionStorage.getItem('xperience_agents') || '[]');
    expect(storedAgents).toHaveLength(1);
    expect(storedAgents[0].name).toBe('Persisted Agent');
  });
});
