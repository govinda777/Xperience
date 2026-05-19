import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

// Define the state of our graph
export interface AgentState {
  userInput: Record<string, any>;
  trailTitle: string;
  intent: 'dossier' | 'checklist' | 'expand';
  analysis?: string;
  finalOutput?: any; // String (markdown) or object (for new trail steps)
  messages: any[];
  needsClarification: boolean;
  clarificationCount: number;
}

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const isGemini = !!geminiApiKey;

if (isGemini) {
  console.log("[xperience-graph] Using Gemini (via OpenAI compatibility layer) for LangGraph orchestration");
} else {
  console.log("[xperience-graph] Using OpenAI for LangGraph orchestration");
}

const llm = new ChatOpenAI(
  isGemini
    ? {
        apiKey: geminiApiKey,
        openAIApiKey: geminiApiKey,
        configuration: {
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        },
        modelName: "gemini-2.5-flash",
        temperature: 0.2,
      }
    : {
        apiKey: openaiApiKey,
        openAIApiKey: openaiApiKey,
        modelName: "gpt-4o",
        temperature: 0.2,
      }
);

const jsonLlm = new ChatOpenAI(
  isGemini
    ? {
        apiKey: geminiApiKey,
        openAIApiKey: geminiApiKey,
        configuration: {
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        },
        modelName: "gemini-2.5-flash",
        temperature: 0.2,
        modelKwargs: { response_format: { type: "json_object" } }
      }
    : {
        apiKey: openaiApiKey,
        openAIApiKey: openaiApiKey,
        modelName: "gpt-4o",
        temperature: 0.2,
        modelKwargs: { response_format: { type: "json_object" } }
      }
);

// NODE: The Strategist (Analista)
async function analystNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("-> Running Analyst (Strategist)");

  let prompt = `Você é um Analista Estratégico Especialista em Negócios e Produtos Enxutos (Lean Experiences), focado em otimizar a experiência do usuário, melhorar os "Unit Economics" e aumentar o "Valor Percebido".
Sua função é analisar as respostas brutas de um empreendedor fornecidas no questionário "${state.trailTitle}".
Extraia a "Alma do Negócio", identifique gargalos na operação atual e oportunidades para reduzir fricção e custos.

Dados do Empreendedor:
${JSON.stringify(state.userInput, null, 2)}

Produza uma análise executiva profunda e direta.`;

  if (state.needsClarification && state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];
      prompt += `\n\nATENÇÃO: O Agente Construtor pediu um refinamento da sua análise anterior com o seguinte comentário:\n"${lastMessage.content}"\nPor favor, forneça uma análise melhorada focando nesses pontos.`;
  }

  const response = await llm.invoke([
    new SystemMessage(prompt),
    new HumanMessage("Analise as respostas brutas fornecidas e gere a análise estratégica.")
  ]);

  return {
    analysis: response.content as string,
    needsClarification: false,
    messages: [...state.messages, new AIMessage(`Análise Estratégica Concluída: ${response.content}`)]
  };
}

// NODE: The Builder (Criador de Artefatos)
async function builderNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("-> Running Builder (Creator) for intent:", state.intent);

  if (!state.analysis) {
    throw new Error("Analysis is missing for the builder.");
  }

  // Verifica se a análise precisa de refinamento (só permite até 1 refinamento para evitar loops)
  if (state.clarificationCount < 1) {
      const evaluationPrompt = `Você é um avaliador rigoroso. Leia a seguinte análise estratégica:
<analise>
${state.analysis}
</analise>
Esta análise tem profundidade suficiente para gerar um artefato do tipo "${state.intent}" com foco em "experiências enxutas", "unit economics" e "valor percebido"?
Responda APENAS "SIM" se for suficiente, ou "NÃO: [motivo]" se estiver vaga ou carecer de foco nesses pilares.`;

      const evalResponse = await llm.invoke([
        new SystemMessage(evaluationPrompt),
        new HumanMessage("Avalie se a análise possui profundidade suficiente para o artefato desejado.")
      ]);
      const evalText = evalResponse.content as string;

      if (evalText.toUpperCase().startsWith("NÃO")) {
          console.log("-> Builder requesting clarification from Analyst.");
          return {
              needsClarification: true,
              clarificationCount: state.clarificationCount + 1,
              messages: [...state.messages, new AIMessage(`Clarification requested: ${evalText}`)]
          };
      }
  }

  let prompt = "";
  let modelToUse = llm;

  if (state.intent === 'dossier') {
    prompt = `Você é um Agente Produtor focado em otimização de experiências de negócios e serviços.
Com base na análise estratégica a seguir:
<analise>
${state.analysis}
</analise>

Crie um "Dossiê Executivo" (Relatório) estruturado em Markdown.
O relatório deve ter:
1. Título chamativo.
2. Sumário Executivo.
3. Gargalos Identificados (com foco em unit economics e fricção).
4. Plano de Ação para criar uma operação mais enxuta e focar na melhor "experiência" para o cliente, otimizando o valor percebido.`;
  } else if (state.intent === 'checklist') {
    prompt = `Você é um Agente Produtor focado em otimização de experiências de negócios e serviços.
Com base na análise estratégica a seguir:
<analise>
${state.analysis}
</analise>

Crie um Checklist acionável e direto ao ponto estruturado em Markdown.
Formato esperado (exemplo):
- [ ] Tarefa 1: ...
- [ ] Tarefa 2: ...
Foque estritamente em itens imediatos para tornar o negócio mais enxuto, melhorar os "unit economics" e otimizar a experiência do cliente reduzindo fricções.`;
  } else if (state.intent === 'expand') {
    modelToUse = jsonLlm;
    prompt = `Você é um Agente Criador de Jornadas de Produto focado em otimização de experiências de negócios e serviços.
Com base na análise estratégica a seguir:
<analise>
${state.analysis}
</analise>

Você precisa criar uma "Mini Jornada" (Novos Formulários) para o usuário se aprofundar no principal gargalo identificado.
RETORNE UM JSON VÁLIDO no seguinte formato:
{
  "newSteps": [
    {
      "id": "step_id_unico",
      "type": "form",
      "title": "Título da Etapa",
      "fields": [
        { "id": "field_1", "type": "text", "label": "Pergunta 1" }
      ]
    }
  ]
}

Regras para os campos (fields):
- 'type' pode ser 'text', 'textarea', ou 'radio' (se for radio, incluir array de 'options' com { label, value }).
- Crie de 1 a 3 steps curtos e focados para investigar a fundo os "Unit Economics", "Valor Percebido" ou o principal gargalo de experiência.`;
  }

  const response = await modelToUse.invoke([
    new SystemMessage(prompt),
    new HumanMessage("Por favor, crie o artefato solicitado.")
  ]);

  let finalOutput = response.content;
  if (state.intent === 'expand' && typeof finalOutput === 'string') {
     try {
       finalOutput = JSON.parse(finalOutput);
     } catch(e) {
       console.error("Failed to parse JSON for expand intent", e);
     }
  }

  return {
    finalOutput,
    needsClarification: false,
    messages: [...state.messages, new AIMessage(`Artefato Criado (${state.intent}): ${JSON.stringify(finalOutput).substring(0, 50)}...`)]
  };
}

// Define conditional edge logic
const shouldContinue = (state: AgentState) => {
    if (state.needsClarification && state.clarificationCount <= 1) {
        return "analyst";
    }
    return END;
};

// Define Graph
import { StateGraphArgs } from "@langchain/langgraph";

const graphChannels: StateGraphArgs<AgentState>["channels"] = {
  userInput: { value: (a, b) => b || a },
  trailTitle: { value: (a, b) => b || a },
  intent: { value: (a, b) => b || a },
  analysis: { value: (a, b) => b || a },
  finalOutput: { value: (a, b) => b || a },
  messages: { value: (x, y) => x.concat(y), default: () => [] },
  needsClarification: { value: (a, b) => b !== undefined ? b : a, default: () => false },
  clarificationCount: { value: (a, b) => b !== undefined ? b : a, default: () => 0 }
};

const workflow = new StateGraph<AgentState>({ channels: graphChannels })
  .addNode("analyst", analystNode)
  .addNode("builder", builderNode)
  .addEdge(START, "analyst")
  .addEdge("analyst", "builder")
  .addConditionalEdges("builder", shouldContinue);

export const xperienceGraph = workflow.compile();
