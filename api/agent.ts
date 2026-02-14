import type { VercelRequest, VercelResponse } from '@vercel/node';
import { agentGraph } from './agent/graph.js';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, sessionId, instructions, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Basic validation for environment variables
  if (!process.env.OPENAI_API_KEY) {
      console.error("CRITICAL: OPENAI_API_KEY is missing from environment variables.");
      return res.status(500).json({ error: "Service Misconfigured: Missing API Key" });
  }

  try {
    console.log(`[Agent API] Processing request. Session: ${sessionId || 'new'}, Message length: ${message.length}`);

    // Map history to LangChain messages
    let historyMessages: any[] = [];
    try {
        historyMessages = (history || []).map((m: any) => {
        const content = m.content || "";
        if (m.role === 'user') return new HumanMessage(content);
        if (m.role === 'assistant') return new AIMessage(content);
        return new SystemMessage(content);
        });
    } catch (err) {
        console.error('[Agent API] Error parsing history:', err);
        // Fallback to empty history if parsing fails
        historyMessages = [];
    }

    const input = {
      messages: [...historyMessages, new HumanMessage(message)],
      sessionId: sessionId || `session_${Date.now()}`,
      instructions: instructions || "You are a helpful assistant."
    };

    // Invoke the graph
    console.log('[Agent API] Invoking agent graph...');
    const result = await agentGraph.invoke(input);
    console.log('[Agent API] Graph invocation complete.');

    const lastMessage = result.messages[result.messages.length - 1];
    const responseContent = lastMessage.content;

    res.status(200).json({
      message: responseContent,
      state: result // Return the full state for the Inspector
    });
  } catch (error: any) {
    console.error('[Agent API] Unhandled Error:', error);
    if (error.stack) {
      console.error('[Agent API] Stack Trace:', error.stack);
    }

    // Check for specific OpenAI errors
    if (error.message?.includes("401")) {
        console.error("[Agent API] OpenAI Authentication Error (401). Check API Key.");
    }

    res.status(500).json({
        error: error.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
