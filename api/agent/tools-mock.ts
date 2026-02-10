import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const webSearchTool = new DynamicStructuredTool({
  name: "web_search",
  description: "Search the web for information.",
  schema: z.object({
    query: z.string().describe("The search query"),
  }),
  func: async ({ query }) => {
    return `[Mock] Web search results for: ${query}`;
  },
});

export const xperienceApiTool = new DynamicStructuredTool({
  name: "xperience_api",
  description: "Call the Xperience platform API.",
  schema: z.object({
    endpoint: z.string().describe("The API endpoint path"),
    method: z.string().describe("HTTP method"),
    body: z.any().optional().describe("Request body"),
  }),
  func: async ({ endpoint }) => {
    return `[Mock] API response from ${endpoint}`;
  },
});
