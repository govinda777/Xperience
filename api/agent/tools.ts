import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Mock Web Search Tool
export const webSearchTool = tool(
  async ({ query }) => {
    return `Results for ${query}: [Mock Data] This is a mock search result.`;
  },
  {
    name: "web_search",
    description: "Search the web for information",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);

// Mock Xperience API Tool
export const xperienceApiTool = tool(
  async ({ action, data }) => {
    return `Executed ${action} with data ${JSON.stringify(data)}. Success.`;
  },
  {
    name: "xperience_api",
    description: "Interact with the Xperience platform API",
    schema: z.object({
      action: z.string().describe("The action to perform (e.g., 'get_user_info')"),
      data: z.record(z.any()).optional().describe("Data for the action"),
    }),
  }
);

export const tools = [webSearchTool, xperienceApiTool];
