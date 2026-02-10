import { webSearchTool, xperienceApiTool } from "./tools-mock.js";

export const agentTools = [
  webSearchTool,
  xperienceApiTool
];

export type AgentToolName = (typeof agentTools)[number]["name"];
