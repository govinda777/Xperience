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
}

const llm = new ChatOpenAI({
  modelName: "gpt-4o", // We use gpt-4o for complex reasoning and structured output
  temperature: 0.2,
});

const jsonLlm = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.2,
  modelKwargs: { response_format: { type: "json_object" } }
});

// NODE: The Strategist (Analista)
async function analystNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("-> Running Analyst (Strategist)");

  const prompt = `Você é um Analista Estratégico Especialista em Negócios e Produtos Enxutos.
Sua função é analisar as respostas brutas de um empreendedor fornecidas no questionário "${state.trailTitle}".
Extraia a "Alma do Negócio", identifique gargalos e problemas na operação atual.

Dados do Empreendedor:
${JSON.stringify(state.userInput, null, 2)}

Produza uma análise executiva focada em "experiências enxutas" (lean experiences) - reduzindo fricção e custos, otimizando o valor percebido.
Sua análise deve ser profunda, direta e servir de insumo para o próximo agente (The Builder).`;

  const response = await llm.invoke([
    new SystemMessage(prompt)
  ]);

  return {
    analysis: response.content as string,
    messages: [...state.messages, new AIMessage(`Análise Estratégica Concluída: ${response.content}`)]
  };
}

// NODE: The Builder (Criador de Artefatos)
async function builderNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("-> Running Builder (Creator) for intent:", state.intent);

  if (!state.analysis) {
    throw new Error("Analysis is missing for the builder.");
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
3. Gargalos Identificados.
4. Plano de Ação para criar uma operação mais enxuta e focar na melhor "experiência" para o cliente.`;
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
Foque em itens imediatos para tornar o negócio mais enxuto e melhorar a experiência.`;
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
- Crie de 1 a 3 steps curtos para focar em "Unit Economics", "Valor Percebido" ou o principal gargalo.`;
  }

  const response = await modelToUse.invoke([
    new SystemMessage(prompt)
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
    messages: [...state.messages, new AIMessage(`Artefato Criado (${state.intent}): ${JSON.stringify(finalOutput).substring(0, 50)}...`)]
  };
}

// Define Graph
import { StateGraphArgs } from "@langchain/langgraph";

const graphChannels: StateGraphArgs<AgentState>["channels"] = {
  userInput: { value: (a, b) => b || a },
  trailTitle: { value: (a, b) => b || a },
  intent: { value: (a, b) => b || a },
  analysis: { value: (a, b) => b || a },
  finalOutput: { value: (a, b) => b || a },
  messages: { value: (x, y) => x.concat(y), default: () => [] }
};

const workflow = new StateGraph<AgentState>({ channels: graphChannels })
  .addNode("analyst", analystNode)
  .addNode("builder", builderNode)
  .addEdge(START, "analyst")
  .addEdge("analyst", "builder")
  .addEdge("builder", END);

export const xperienceGraph = workflow.compile();
