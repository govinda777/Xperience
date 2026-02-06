import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { logToolExecution } from "../db/audit";

type ToolHandler<Schema extends z.ZodTypeAny, Output> = (
  input: z.infer<Schema>,
) => Promise<Output>;

export function createAuditedTool<Schema extends z.ZodTypeAny, Output>(opts: {
  name: string;
  description: string;
  schema: Schema;
  handler: ToolHandler<Schema, Output>;
}) {
  const { name, description, schema, handler } = opts;

  return tool(
    async (input: z.infer<Schema>, config) => {
      const startedAt = Date.now();
      let success = false;
      let error: any;
      let output: any;

      try {
        output = await handler(input);
        success = true;
        return output;
      } catch (e) {
        error = e;
        throw e;
      } finally {
        const durationMs = Date.now() - startedAt;
        await logToolExecution({
          toolName: name,
          input,
          output: success ? output : undefined,
          error: !success ? String(error) : undefined,
          durationMs,
          // Extract sessionId from config.metadata or config.tags if available
          // LangChain passes config object as second arg
          sessionId: (config?.metadata?.sessionId as string) || undefined,
        });
      }
    },
    {
      name,
      description,
      schema,
    },
  );
}
