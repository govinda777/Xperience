import { sql } from "../../db/postgres";
import { agentGraph } from "../../../api/agent/graph";
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
    await sql`
      INSERT INTO inbound_messages (provider, external_id, from_id, to_id, payload)
      VALUES (
        ${inbound.provider},
        ${inbound.externalId},
        ${inbound.from},
        ${inbound.to || null},
        ${JSON.stringify(inbound.raw)}
      )
    `;

    // 2) Resolve sessionId (e.g., provider:from)
    const sessionId = inbound.sessionId || `${inbound.provider}:${inbound.from}`;

    // 3) Invoke the agent
    // We pass the message and session ID.
    // The graph logic (Hydration) could be enhanced to load user profile based on this session ID.
    const result = await agentGraph.invoke({
      messages: [new HumanMessage(inbound.text ?? "")],
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
