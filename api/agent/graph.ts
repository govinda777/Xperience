import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AgentState } from "./state.js";
import { agentTools } from "./tools.js";

// Initialize the model lazily to avoid top-level side effects
let modelWithTools: any;

const getModel = () => {
  if (!modelWithTools) {
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Efficient model for this task
      temperature: 0,
    });
    modelWithTools = model.bindTools(agentTools as any);
  }
  return modelWithTools;
};

// --- Nodes ---

// 1. Hydration: Resolve user identity and load session
const hydrationNode = async (state: any) => {
  const auditEntry = {
    step: "Hydration",
    timestamp: new Date().toISOString(),
    details: "Session hydrated",
  };
  return { auditLog: [auditEntry] };
};

// 2. Perception: Detect intent and extract entities
const perceptionNode = async (state: any) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = lastMessage.content as string;

  // Simple heuristic for intent (replace with LLM classification in future)
  let intent = "general_chat";
  if (content.toLowerCase().includes("search")) intent = "search";
  if (content.toLowerCase().includes("api")) intent = "api_call";

  const auditEntry = {
    step: "Perception",
    timestamp: new Date().toISOString(),
    details: `Intent detected: ${intent}`,
  };

  return { intent, auditLog: [auditEntry] };
};

// 3. Retrieval: Fetch relevant context
const retrievalNode = async (state: any) => {
  // Mock retrieval logic
  const auditEntry = {
    step: "Retrieval",
    timestamp: new Date().toISOString(),
    details: "Retrieved 0 documents (Mock)",
  };
  return { context: [], auditLog: [auditEntry] };
};

// 4. Reasoning: Decide on actions (call LLM)
const reasoningNode = async (state: any) => {
  const { messages, context, instructions } = state;

  // Construct system prompt with context
  const systemMessage = new SystemMessage(
    `${instructions}
    Context: ${JSON.stringify(context)}`
  );

  const model = getModel();
  const response = await model.invoke([systemMessage, ...messages]);

  const auditEntry = {
    step: "Reasoning",
    timestamp: new Date().toISOString(),
    details: "LLM generated response/action",
  };

  return { messages: [response], auditLog: [auditEntry] };
};

// 5. Tool Execution is handled by ToolNode

// 6. Response: Final formatting (if needed, otherwise Reasoning output is enough)
const responseNode = async (state: any) => {
   const auditEntry = {
    step: "Response",
    timestamp: new Date().toISOString(),
    details: "Response ready",
  };
  return { auditLog: [auditEntry] };
};

// 7. State Update: Persist state (mock for now)
const stateUpdateNode = async (state: any) => {
  // In a real app, save to DB here
  const auditEntry = {
    step: "StateUpdate",
    timestamp: new Date().toISOString(),
    details: "State persisted",
  };
  return { auditLog: [auditEntry] };
};

// --- Graph Construction ---

const workflow = new StateGraph<any>(AgentState as any);

workflow.addNode("hydration", hydrationNode);
workflow.addNode("perception", perceptionNode);
workflow.addNode("retrieval", retrievalNode);
workflow.addNode("reasoning", reasoningNode);
workflow.addNode("tools", new ToolNode(agentTools as any));
workflow.addNode("response", responseNode);
workflow.addNode("stateUpdate", stateUpdateNode);

// Edges
workflow.addEdge("__start__" as any, "hydration" as any);
workflow.addEdge("hydration" as any, "perception" as any);
workflow.addEdge("perception" as any, "retrieval" as any);
workflow.addEdge("retrieval" as any, "reasoning" as any);

workflow.addConditionalEdges(
  "reasoning" as any,
  (state: any) => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return "response";
  }
);

workflow.addEdge("tools" as any, "reasoning" as any); // Loop back to reasoning after tools
workflow.addEdge("response" as any, "stateUpdate" as any);
workflow.addEdge("stateUpdate" as any, END as any);

export const agentGraph = workflow.compile();
