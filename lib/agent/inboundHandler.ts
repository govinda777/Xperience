import { agentGraph } from "../../api/agent/graph.js";
import { HumanMessage } from "@langchain/core/messages";

export type InboundMessage = {
  provider: "whatsapp" | "telegram" | "x" | "email" | "calendar";
  externalId: string;
  from: string;
  to?: string;
  text?: string;
  raw: unknown;
  sessionId?: string;
};

export async function handleInboundMessage(inbound: InboundMessage) {
  try {
    // 1) Log raw message for audit/reprocessing instead of Redis/KV persistence
    console.log(`[Inbound Message] Received ${inbound.provider} message:`, {
      provider: inbound.provider,
      externalId: inbound.externalId,
      from: inbound.from,
      timestamp: new Date().toISOString()
    });

    // 2) Resolve sessionId (e.g., provider:from)
    const sessionId = inbound.sessionId || `${inbound.provider}:${inbound.from}`;

    // 3) Invoke the agent
    const result = await agentGraph.invoke({
      messages: [new HumanMessage(inbound.text ?? "") as any],
      sessionId,
    });

    return result;

  } catch (err) {
    console.error("Error handling inbound message:", err);
    throw err;
  }
}
