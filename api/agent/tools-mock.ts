import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const webSearchSchema = z.object({
  query: z.string().describe("The search query"),
});

// Use explicit <any> generic to prevent TypeScript from attempting deep inference on the schema
export const webSearchTool = new DynamicStructuredTool<any>({
  name: "web_search",
  description: "Search the web for information.",
  schema: webSearchSchema,
  func: async (input: any) => {
    const query = input.query;
    return `[Mock] Web search results for: ${query}`;
  },
});

const xperienceApiSchema = z.object({
  endpoint: z.string().describe("The API endpoint path"),
  method: z.string().describe("HTTP method"),
  body: z.any().optional().describe("Request body"),
});

// Use explicit <any> generic to prevent TypeScript from attempting deep inference on the schema
export const xperienceApiTool = new DynamicStructuredTool<any>({
  name: "xperience_api",
  description: "Call the Xperience platform API.",
  schema: xperienceApiSchema,
  func: async (input: any) => {
    const { endpoint } = input;
    return `[Mock] API response from ${endpoint}`;
  },
});
