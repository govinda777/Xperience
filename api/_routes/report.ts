import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { instruction, agentId, agentName, context, history } = req.body;

  if (!instruction) {
    return res.status(400).json({ error: 'Instruction is required' });
  }

  try {
    console.log(`[Report API] Generating report for agent ${agentName} (${agentId})`);

    // Prepare history for context
    const conversationHistory = (history || [])
      .map((m: any) => `${m.role === 'user' ? 'Usuário' : 'Agente'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `
      Você é um motor de síntese analítica especializado em gerar relatórios estruturados, agindo como o NotebookLM.
      Sua tarefa é analisar o contexto e o histórico da conversa e gerar um relatório profissional.

      REGRAS:
      1. Use Markdown para formatar o relatório.
      2. Seja objetivo, analítico e profissional.
      3. O relatório deve ter um título claro e seções bem definidas.
      4. Focado apenas nas informações fornecidas no histórico e contexto.

      CONTEXTO DO AGENTE:
      ${context || 'Nenhum contexto adicional fornecido.'}

      HISTÓRICO DA CONVERSA:
      ${conversationHistory || 'Nenhuma conversa anterior.'}
    `;

    const userPrompt = `Comando: ${instruction}\n\nGere o relatório solicitado em formato JSON com os campos "title" e "content" (Markdown).`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using a fast, cheap model for reports as an orchestrator
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return res.status(200).json({
      id: `rep_${Date.now()}`,
      title: result.title || `Relatório ${agentName}`,
      content: result.content || 'Erro ao gerar conteúdo do relatório.',
      agentId,
      agentName
    });

  } catch (error: any) {
    console.error('[Report API] Error generating report:', error);
    return res.status(500).json({
      error: 'Failed to generate report',
      message: error.message
    });
  }
}
