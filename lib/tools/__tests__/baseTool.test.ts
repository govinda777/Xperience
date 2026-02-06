import { describe, expect, it, jest } from '@jest/globals';
import { createAuditedTool } from '../baseTool';
import * as z from 'zod';

// Mock the audit logging function
jest.mock('../../db/audit', () => ({
  logToolExecution: jest.fn(),
}));

import { logToolExecution } from '../../db/audit';

describe('createAuditedTool', () => {
  const testSchema = z.object({
    value: z.string(),
  });

  const testHandler = jest.fn(async (input: z.infer<typeof testSchema>) => {
    return { result: `Processed ${input.value}` };
  });

  const auditedTool = createAuditedTool({
    name: 'test_tool',
    description: 'A test tool',
    schema: testSchema,
    handler: testHandler,
  });

  it('should execute the handler and log success', async () => {
    const input = { value: 'test' };
    const result = await auditedTool.invoke(input, { metadata: { sessionId: 'session-123' } });

    expect(testHandler).toHaveBeenCalledWith(input);
    expect(result).toEqual({ result: 'Processed test' });

    expect(logToolExecution).toHaveBeenCalledWith(expect.objectContaining({
      toolName: 'test_tool',
      input: input,
      output: { result: 'Processed test' },
      sessionId: 'session-123',
    }));
  });

  it('should log error when handler fails', async () => {
    const error = new Error('Handler failed');
    testHandler.mockRejectedValueOnce(error);

    await expect(auditedTool.invoke({ value: 'fail' })).rejects.toThrow('Handler failed');

    expect(logToolExecution).toHaveBeenCalledWith(expect.objectContaining({
      toolName: 'test_tool',
      error: 'Error: Handler failed',
    }));
  });
});
