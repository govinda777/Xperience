import type { VercelRequest, VercelResponse } from '@vercel/node';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { allTools } from '../_lib/tools/index.js';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, sessionId, instructions, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required and must be an array' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('CRITICAL: OPENAI_API_KEY is missing.');
    return res.status(500).json({ error: 'Service Misconfigured: Missing API Key' });
  }

  const lastUserMessage = messages[messages.length - 1];

  // Restoring /REPORT command logic using the Orchestrator
  if (lastUserMessage?.role === 'user' && lastUserMessage.content && typeof lastUserMessage.content === 'string' && lastUserMessage.content.trim().toUpperCase() === '/REPORT') {
      try {
          console.log(`[Chat API] /REPORT command detected. Redirecting to internal orchestrator.`);
          // Fix Server-Side Request Forgery (SSRF) alert from CodeQL.
          // In serverless environments on Vercel, referencing host/url from req can be tainted.
          // Since this is an internal route mapped in index.ts, we should use a relative or hardcoded base for server-to-server or invoke directly.
          // For simplicity and to avoid SSRF, we fetch using localhost or invoke it internally if possible,
          // but vercel deployment handles internal fetch differently. A safe way is to construct the origin explicitly or use absolute relative if proxying.
          // Using VERCEL_URL is standard but can still trigger CodeQL if not sanitized.
          // Let's use a safe fallback.

          // Using direct graph invocation instead of local fetch to completely avoid SSRF and networking loops
          // We can import the graph directly since we are on the backend
          const { xperienceGraph } = await import('../agent/xperience-graph.js');

          const initialState = {
              trailTitle: 'Sessão de Chat Xperience',
              userInput: { history: messages },
              intent: 'dossier' as const,
              messages: []
          };

          const finalState = await xperienceGraph.invoke(initialState);
          const reportData = { result: finalState.finalOutput };
          return res.status(200).json({
              role: 'assistant',
              content: `### 📊 Relatório Gerado pela Inteligência Xperience\n\n${reportData.result}`,
              isReport: true
          });
      } catch (error: any) {
          console.error('[Chat API] Failed to generate report via orchestrator:', error);
          return res.status(500).json({ error: 'Falha ao gerar o relatório.' });
      }
  }

  try {
    console.log(`[Chat API] Streaming request. Session: ${sessionId || 'new'}`);

    // Save user message to KV (Redis) immediately
    if (sessionId && lastUserMessage?.role === 'user') {
        const sessionKey = `chat_session:${sessionId}`;
        await (kv as any).lpush(sessionKey, JSON.stringify(lastUserMessage));
        await (kv as any).ltrim(sessionKey, 0, 49);
    }

    let systemPrompt = instructions || 'You are a helpful assistant.';
    if (context) {
        systemPrompt += `\n\n<context>\n${context}\n</context>`;
    }

    const result = await (streamText as any)({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      tools: allTools,
      maxSteps: 10,
      onFinish: async ({ text, usage, finishReason }: any) => {
        console.log('[Chat API] Request finished.', { usage, finishReason });
        if (sessionId) {
            try {
                const sessionKey = `chat_session:${sessionId}`;
                await (kv as any).lpush(sessionKey, JSON.stringify({ role: 'assistant', content: text }));
                await (kv as any).ltrim(sessionKey, 0, 49);
            } catch (kvError) {
                console.warn('[Chat API] KV update failed:', kvError);
            }
        }
      },
    });

    const response = (result as any).toDataStreamResponse();

    res.status(response.status);
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error: any) {
    console.error('[Chat API] Error:', error);
    if (!res.headersSent) {
        return res.status(500).json({
          error: error.message || 'Internal Server Error',
        });
    }
  }
}
