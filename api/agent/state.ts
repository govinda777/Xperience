import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

// Define the state schema for our agent
// This state will be passed between all nodes in the graph
export const AgentState = Annotation.Root({
  // The conversation history
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  // The detected intent of the user
  intent: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
    default: () => undefined,
  }),
  // The security level of the conversation (0-5)
  securityLevel: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
  // The session ID
  sessionId: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  // Audit logs for tracking agent actions
  auditLog: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  // Context retrieved from knowledge base
  context: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  // The system instructions/persona for the agent
  instructions: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "You are the Xperience Super Agent. Use the available tools if needed.",
  }),
});
