import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AgentState } from "./state";
import { tools } from "./tools";

// Initialize the model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini", // Efficient model for this task
  temperature: 0,
});

// Bind tools to the model
const modelWithTools = model.bindTools(tools);

// --- Nodes ---

// 1. Hydration: Resolve user identity and load session
const hydrationNode = async (state: typeof AgentState.State) => {
  const auditEntry = {
    step: "Hydration",
    timestamp: new Date().toISOString(),
    details: "Session hydrated",
  };
  return { auditLog: [auditEntry] };
};

// 2. Perception: Detect intent and extract entities
const perceptionNode = async (state: typeof AgentState.State) => {
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
const retrievalNode = async (state: typeof AgentState.State) => {
  // Mock retrieval logic
  const auditEntry = {
    step: "Retrieval",
    timestamp: new Date().toISOString(),
    details: "Retrieved 0 documents (Mock)",
  };
  return { context: [], auditLog: [auditEntry] };
};

// 4. Reasoning: Decide on actions (call LLM)
const reasoningNode = async (state: typeof AgentState.State) => {
  const { messages, context } = state;

  // Construct system prompt with context
  const systemMessage = new SystemMessage(
    `You are the Xperience Super Agent. Use the available tools if needed.
    Context: ${JSON.stringify(context)}`
  );

  const response = await modelWithTools.invoke([systemMessage, ...messages]);

  const auditEntry = {
    step: "Reasoning",
    timestamp: new Date().toISOString(),
    details: "LLM generated response/action",
  };

  return { messages: [response], auditLog: [auditEntry] };
};

// 5. Tool Execution is handled by ToolNode

// 6. Response: Final formatting (if needed, otherwise Reasoning output is enough)
const responseNode = async (state: typeof AgentState.State) => {
   const auditEntry = {
    step: "Response",
    timestamp: new Date().toISOString(),
    details: "Response ready",
  };
  return { auditLog: [auditEntry] };
};

// 7. State Update: Persist state (mock for now)
const stateUpdateNode = async (state: typeof AgentState.State) => {
  // In a real app, save to DB here
  const auditEntry = {
    step: "StateUpdate",
    timestamp: new Date().toISOString(),
    details: "State persisted",
  };
  return { auditLog: [auditEntry] };
};

// --- Graph Construction ---

const workflow = new StateGraph(AgentState)
  .addNode("hydration", hydrationNode)
  .addNode("perception", perceptionNode)
  .addNode("retrieval", retrievalNode)
  .addNode("reasoning", reasoningNode)
  .addNode("tools", new ToolNode(tools))
  .addNode("response", responseNode)
  .addNode("stateUpdate", stateUpdateNode)

  // Edges
  .addEdge("__start__", "hydration")
  .addEdge("hydration", "perception")
  .addEdge("perception", "retrieval")
  .addEdge("retrieval", "reasoning")
  .addConditionalEdges(
    "reasoning",
    (state) => {
      const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "tools";
      }
      return "response";
    }
  )
  .addEdge("tools", "reasoning") // Loop back to reasoning after tools
  .addEdge("response", "stateUpdate")
  .addEdge("stateUpdate", END);

export const agentGraph = workflow.compile();
