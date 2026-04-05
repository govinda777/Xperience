import React, { useState, useEffect } from 'react';
import { Step, Trail } from '../../types/trails';
import { Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface TrailAIStepProps {
  step: Step;
  trail: Trail;
  allData: Record<string, any>;
  onComplete: (result: string) => void;
  onBack?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TrailAIStep: React.FC<TrailAIStepProps> = ({
  step,
  trail,
  allData,
  onComplete,
  onBack,
  isFirst,
  isLast
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const interpolatePrompt = (prompt: string, data: Record<string, any>) => {
    let interpolated = prompt;

    // Find all {{stepId}} patterns
    const matches = prompt.match(/{{(.*?)}}/g);

    if (matches) {
      matches.forEach(match => {
        const stepId = match.replace(/{{|}}/g, '');
        const stepValue = data[stepId];

        let replacement = '';
        if (stepValue) {
          if (typeof stepValue === 'object') {
            // Form data - format as "Question: Answer"
            const stepConfig = trail.steps.find(s => s.id === stepId);
            if (stepConfig && stepConfig.fields) {
              replacement = stepConfig.fields.map(field => {
                const val = stepValue[field.id];
                const label = field.label;
                return `${label}: ${Array.isArray(val) ? val.join(', ') : val}`;
              }).join('\n');
            } else {
              replacement = JSON.stringify(stepValue);
            }
          } else {
            replacement = String(stepValue);
          }
        }

        interpolated = interpolated.replace(match, replacement);
      });
    }

    return interpolated;
  };

  useEffect(() => {
    const callAI = async () => {
      setLoading(true);
      setError(null);

      try {
        const prompt = interpolatePrompt(step.prompt || '', allData);

        const response = await fetch('/api/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: step.title || 'Relatório de Trilha',
            agentName: 'Trail Engine',
            conversationHistory: [
              { role: 'user', content: prompt }
            ],
            context: `Você é um assistente especializado em ${trail.title}.`
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao processar o relatório de IA');
        }

        const data = await response.json();
        const content = data.content;

        setResult(content);

        if (!step.display) {
          onComplete(content);
        }
      } catch (err: any) {
        console.error('AI Step Error:', err);
        setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      } finally {
        setLoading(false);
      }
    };

    callAI();
  }, [step.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <h3 className="text-xl font-bold text-gray-800">
          {step.loadingMessage || 'Processando com IA...'}
        </h3>
        <p className="text-gray-500 max-w-md text-center">
          Estamos analisando suas respostas para gerar o melhor resultado personalizado.
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
          onClick={() => window.location.reload()}
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
            <FileText className="w-6 h-6" />
            <h3 className="text-xl font-bold">Seu Resultado</h3>
          </div>
          <div className="prose prose-orange max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans bg-white p-6 rounded-lg border border-orange-200 shadow-sm">
              {result}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          {!isFirst && (
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-gray-600 font-bold hover:text-gray-800 transition"
            >
              Voltar
            </button>
          )}
          <div className={isFirst ? 'w-full flex justify-end' : ''}>
            <button
              onClick={() => onComplete(result)}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              <CheckCircle2 size={20} />
              {isLast ? 'Finalizar Jornada' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TrailAIStep;
