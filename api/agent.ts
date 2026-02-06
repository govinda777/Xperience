import type { VercelRequest, VercelResponse } from '@vercel/node';
import { agentGraph } from './agent/graph';
import { HumanMessage } from '@langchain/core/messages';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const input = {
      messages: [new HumanMessage(message)],
      sessionId: sessionId || `session_${Date.now()}`,
    };

    // Invoke the graph
    // For a real-time streaming experience, we would use .stream() and SSE
    // For this MVP, we'll use .invoke() and return the final state
    const result = await agentGraph.invoke(input);

    const lastMessage = result.messages[result.messages.length - 1];
    const responseContent = lastMessage.content;

    res.status(200).json({
      message: responseContent,
      state: result // Return the full state for the Inspector
    });
  } catch (error: any) {
    console.error('Agent Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
