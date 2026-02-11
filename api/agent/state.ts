// Define the state schema for our agent using simple object definition
// instead of Annotation.Root to avoid excessive stack depth errors in TypeScript

export const AgentState = {
  // The conversation history
  messages: {
    value: (x: any[], y: any[]) => x.concat(y),
    default: () => [],
  },
  // The detected intent of the user
  intent: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  // The security level of the conversation (0-5)
  securityLevel: {
    value: (x: number, y: number) => y ?? x,
    default: () => 0,
  },
  // The session ID
  sessionId: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  // Audit logs for tracking agent actions
  auditLog: {
    value: (x: any[], y: any[]) => x.concat(y),
    default: () => [],
  },
  // Context retrieved from knowledge base
  context: {
    value: (x: string[], y: string[]) => y ?? x,
    default: () => [],
  },
  // The system instructions/persona for the agent
  instructions: {
    value: (x: string, y: string) => y ?? x,
    default: () => "You are the Xperience Super Agent. Use the available tools if needed.",
  },
};
