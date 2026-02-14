import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const webSearchSchema = z.object({
  query: z.string().describe("The search query"),
});

export const webSearchTool = new DynamicStructuredTool({
  name: "web_search",
  description: "Search the web for information.",
  schema: webSearchSchema as any,
  func: async ({ query }: { query: string }) => {
    return `[Mock] Web search results for: ${query}`;
  },
});

const xperienceApiSchema = z.object({
  endpoint: z.string().describe("The API endpoint path"),
  method: z.string().describe("HTTP method"),
  body: z.any().optional().describe("Request body"),
});

export const xperienceApiTool = new DynamicStructuredTool({
  name: "xperience_api",
  description: "Call the Xperience platform API.",
  schema: xperienceApiSchema as any,
  func: async ({ endpoint }: { endpoint: string; method: string; body?: any }) => {
    return `[Mock] API response from ${endpoint}`;
  },
});
