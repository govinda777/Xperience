import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const webSearchTool = tool(
  async ({ query }: { query: string }) => {
    return `[Mock] Web search results for: ${query}`;
  },
  {
    name: "web_search",
    description: "Search the web for information.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);

export const xperienceApiTool = tool(
  async ({ endpoint, method, body }: { endpoint: string, method: string, body?: any }) => {
    return `[Mock] API response from ${endpoint}`;
  },
  {
    name: "xperience_api",
    description: "Call the Xperience platform API.",
    schema: z.object({
      endpoint: z.string().describe("The API endpoint path"),
      method: z.string().describe("HTTP method"),
      body: z.any().optional().describe("Request body"),
    }),
  }
);
