import { sql } from "./postgres";

export interface LogToolExecutionParams {
  toolName: string;
  input: any;
  output?: any;
  error?: string;
  durationMs: number;
  sessionId?: string;
}

export async function logToolExecution(params: LogToolExecutionParams) {
  try {
    await sql`
      INSERT INTO agent_tool_audit (tool_name, input, output, error, duration_ms, session_id)
      VALUES (
        ${params.toolName},
        ${JSON.stringify(params.input)},
        ${params.output ? JSON.stringify(params.output) : null},
        ${params.error || null},
        ${params.durationMs},
        ${params.sessionId || null}
      )
    `;
  } catch (err) {
    console.error("Failed to log tool execution:", err);
    // Non-blocking error: we don't want to fail the tool just because logging failed
  }
}
