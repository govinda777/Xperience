import type { VercelRequest, VercelResponse } from '@vercel/node';
import { xperienceGraph } from '../agent/xperience-graph.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { trailTitle, userInput, intent } = req.body;

  if (!intent || !['dossier', 'checklist', 'expand'].includes(intent)) {
    return res.status(400).json({ error: 'Invalid or missing intent. Must be dossier, checklist, or expand.' });
  }

  try {
    console.log(`[TrailAgent API] Running workflow for intent: ${intent}`);

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    const initialState = {
      trailTitle: trailTitle || 'Jornada Xperience',
      userInput: userInput || {},
      intent: intent as 'dossier' | 'checklist' | 'expand',
      messages: []
    };

    const finalState = await xperienceGraph.invoke(initialState);

    return res.status(200).json({
      intent,
      result: finalState.finalOutput,
      analysis: finalState.analysis // Optional, we can return the strategist analysis if we want to show it
    });

  } catch (error: any) {
    console.error('[TrailAgent API] Error running graph:', error);
    return res.status(500).json({
      error: 'Failed to execute agent workflow',
      message: error.message
    });
  }
}
