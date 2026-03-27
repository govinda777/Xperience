import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { instruction, agentId, agentName, context, history } = req.body;

  if (!instruction) {
    return res.status(400).json({ error: 'Instruction is required' });
  }

  try {
    console.log(`[Report API] Generating Gemini 1.5 Pro report for agent ${agentName} (${agentId})`);

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    // Prepare history for context
    const conversationHistory = (history || [])
      .map((m: any) => `${m.role === 'user' ? 'Usuário' : 'Agente'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `
      Você é um motor de síntese analítica especializado em gerar relatórios estruturados de alta densidade informativa, agindo como o NotebookLM.
      Sua tarefa é analisar o contexto e o histórico completo da conversa para gerar um "Dossiê" profissional.

      DIRETRIZES DE ESTRUTURA (Markdown):
      1. Título do Relatório: Chamativo e Profissional.
      2. Sumário Executivo: Resumo de 2 parágrafos sobre os principais tópicos.
      3. Análise de Correlações: Conecte os pontos discutidos na sessão.
      4. Recomendações Acionáveis: Lista de próximos passos baseados nos dados.
      5. Conclusão Analítica.

      REGRAS TÉCNICAS:
      - Seja objetivo e use tom de consultoria.
      - Utilize apenas os fatos presentes no histórico.
      - Retorne estritamente um objeto JSON com os campos "title" e "content".

      <context>
      ${context || 'Nenhum contexto específico do agente fornecido.'}
      </context>

      HISTÓRICO DA SESSÃO:
      ${conversationHistory || 'Histórico vazio.'}
    `;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const result = await model.generateContent(`${systemPrompt}\n\nSOLICITAÇÃO DO USUÁRIO: ${instruction}`);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText || '{}');

    return res.status(200).json({
      id: `rep_${Date.now()}`,
      title: parsed.title || `Dossiê Analítico: ${agentName}`,
      content: parsed.content || 'Erro ao sintetizar o relatório.',
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
