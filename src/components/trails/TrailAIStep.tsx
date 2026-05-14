import React, { useState } from 'react';
import { Step, Trail } from '../../types/trails';
import { Loader2, FileText, CheckCircle2, AlertCircle, ListChecks, PlusCircle } from 'lucide-react';
import { interpolatePrompt } from '../../utils/trailUtils';

interface TrailAIStepProps {
  step: Step;
  trail: Trail;
  allData: Record<string, any>;
  onComplete: (result: any) => void;
  onBack?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

type IntentType = 'dossier' | 'checklist' | 'expand';

const TrailAIStep: React.FC<TrailAIStepProps> = ({
  step,
  trail,
  allData,
  onComplete,
  onBack,
  isFirst,
  isLast
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [intent, setIntent] = useState<IntentType | null>(null);

  const callAI = async (selectedIntent: IntentType) => {
    setLoading(true);
    setError(null);
    setIntent(selectedIntent);

    try {
      // Usamos as informacoes formatadas para enviar ao analista
      const formattedInput = Object.keys(allData).reduce((acc, key) => {
          // Simplifica objectos muito complexos se necessario
          acc[key] = allData[key];
          return acc;
      }, {} as any);

      const response = await fetch('/api/agent/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trailTitle: trail.title,
          userInput: formattedInput,
          intent: selectedIntent
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar os dados com os Agentes de IA');
      }

      const data = await response.json();
      const content = data.result;

      setResult(content);

      if (!step.display) {
        onComplete(content);
        return; // Prevents showing UI if not displayed
      }
    } catch (err: any) {
      console.error('AI Step Error:', err);
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      setIntent(null);
    } finally {
      setLoading(false);
    }
  };

  if (!intent && !loading && !error && !result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Jules processou seus dados!</h3>
            <p className="text-gray-500 max-w-md">
                Nossos agentes analisaram o seu contexto. O que você precisa agora para otimizar sua experiência de negócio?
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <button
                onClick={() => callAI('dossier')}
                className="flex flex-col items-center p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition group"
            >
                <FileText className="w-12 h-12 text-orange-400 group-hover:text-orange-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-800">Gerar Dossiê</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Um relatório analítico e profundo sobre a alma do seu negócio e gargalos.</p>
            </button>
            <button
                onClick={() => callAI('checklist')}
                className="flex flex-col items-center p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition group"
            >
                <ListChecks className="w-12 h-12 text-orange-400 group-hover:text-orange-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-800">Criar Checklist</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Tarefas práticas e acionáveis para tornar sua operação mais enxuta agora.</p>
            </button>
            <button
                onClick={() => callAI('expand')}
                className="flex flex-col items-center p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition group"
            >
                <PlusCircle className="w-12 h-12 text-orange-400 group-hover:text-orange-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-800">Expandir Jornada</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Novos formulários dinâmicos para aprofundar nos seus principais desafios.</p>
            </button>
        </div>

        {!isFirst && (
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-gray-600 font-bold hover:text-gray-800 transition"
            >
              Voltar
            </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <h3 className="text-xl font-bold text-gray-800">
          {intent === 'expand' ? 'Criando novas jornadas dinâmicas...' : 'Os agentes estão discutindo a melhor estratégia...'}
        </h3>
        <p className="text-gray-500 max-w-md text-center">
          Analisando suas respostas focando em unit economics e valor percebido.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-800">Ops! Algo deu errado</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
        <button
          onClick={() => { setError(null); setIntent(null); }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (step.display && result) {
    return (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6 text-orange-700">
            {intent === 'checklist' ? <ListChecks className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            <h3 className="text-xl font-bold">
                {intent === 'checklist' ? 'Seu Checklist Estratégico' : intent === 'expand' ? 'Nova Jornada Pronta' : 'Seu Dossiê'}
            </h3>
          </div>
          <div className="prose prose-orange max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans bg-white p-6 rounded-lg border border-orange-200 shadow-sm">
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button
            onClick={() => { setResult(null); setIntent(null); }}
            className="px-6 py-2.5 text-gray-600 font-bold hover:text-gray-800 transition"
          >
            Escolher Outra Opção
          </button>

          <div className="flex justify-end">
            <button
              onClick={() => onComplete(result)}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              <CheckCircle2 size={20} />
              {intent === 'expand' ? 'Iniciar Nova Jornada' : (isLast ? 'Finalizar Jornada' : 'Continuar')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TrailAIStep;