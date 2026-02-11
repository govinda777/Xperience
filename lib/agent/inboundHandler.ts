import { kv } from "../../api/lib/kv.js";
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
    // 1) Persist raw message for audit/reprocessing
    const msg = {
      provider: inbound.provider,
      externalId: inbound.externalId,
      fromId: inbound.from,
      toId: inbound.to || null,
      payload: inbound.raw,
      timestamp: new Date().toISOString()
    };
    await kv.lpush('inbound_messages', JSON.stringify(msg));

    // 2) Resolve sessionId (e.g., provider:from)
    const sessionId = inbound.sessionId || `${inbound.provider}:${inbound.from}`;

    // 3) Invoke the agent
    // We pass the message and session ID.
    // The graph logic (Hydration) could be enhanced to load user profile based on this session ID.
    const result = await agentGraph.invoke({
      messages: [new HumanMessage(inbound.text ?? "") as any],
      sessionId,
      // We can pass metadata via state or config if needed,
      // but strictly speaking invoke takes the State object.
      // Current AgentState has sessionId, so that's covered.
    });

    return result;

  } catch (err) {
    console.error("Error handling inbound message:", err);
    throw err;
  }
}
