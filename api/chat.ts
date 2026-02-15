// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, ragMetadata } = req.body;

  try {
    console.log('\n🔵 ═══ REQUISIÇÃO DA API ═══');
    console.log('📊 RAG Metadata:', ragMetadata);
    console.log('💬 Total de mensagens:', messages?.length);

    if (!process.env.OPENAI_API_KEY) {
        console.error("CRITICAL: OPENAI_API_KEY is missing from environment variables.");
        return res.status(500).json({ error: "Service Misconfigured: Missing API Key" });
    }

    const startTime = Date.now();

    // ═══════════════════════════════════════════════════════
    // ENVIA PARA O LLM
    // O contexto RAG já está embutido no system message
    // ═══════════════════════════════════════════════════════
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using gpt-4o as it is generally available and performant
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const processingTime = Date.now() - startTime;
    const response = completion.choices[0].message.content;

    console.log('✅ Resposta gerada em', processingTime, 'ms');
    console.log('🔵 ═══ FIM DA REQUISIÇÃO ═══\n');

    // Retorna resposta
    res.status(200).json({
      response,
      processingTime,
      ragMetadata,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('❌ Erro na API:', error);

    // Check for specific OpenAI errors
    if (error.status === 401) {
        console.error("❌ OpenAI Authentication Error (401). Check API Key.");
    }
    if (error.status === 429) {
         console.error("❌ OpenAI Rate limit exceeded.");
    }

    res.status(500).json({
      error: 'Failed to generate response',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
}
