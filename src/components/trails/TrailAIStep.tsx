import React, { useState } from 'react';
import { Step, Trail } from '../../types/trails';
import { Loader2, FileText, CheckCircle2, AlertCircle, ListChecks, PlusCircle } from 'lucide-react';

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
  const [results, setResults] = useState<Record<IntentType, any>>({
    dossier: null,
    checklist: null,
    expand: null,
  });
  const [activeTab, setActiveTab] = useState<IntentType>('dossier');

  const callAI = async (selectedIntent: IntentType) => {
    setLoading(true);
    setError(null);
    setActiveTab(selectedIntent);

    try {
      const formattedInput = Object.keys(allData).reduce((acc, key) => {
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

      setResults(prev => ({
        ...prev,
        [selectedIntent]: content
      }));

      if (!step.display) {
        onComplete(content);
        return;
      }
    } catch (err: any) {
      console.error('AI Step Error:', err);
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults({
      dossier: null,
      checklist: null,
      expand: null,
    });
    setActiveTab('dossier');
    setError(null);
  };

  const parseInline = (text: string) => {
    const parts = text.split(/\*\*([^\*]+)\*\*/g);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-semibold text-orange-950 bg-orange-100/50 px-1.5 py-0.5 rounded">{part}</strong>;
      }
      
      const codeParts = part.split(/`([^`]+)`/g);
      return codeParts.map((subpart, subidx) => {
        if (subidx % 2 === 1) {
          return <code key={subidx} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">{subpart}</code>;
        }
        return subpart;
      });
    });
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const blocks = text.split(/\n\n+/);
    return blocks.map((block, blockIdx) => {
      block = block.trim();
      if (!block) return null;

      if (block === '---' || block === '***') {
        return <hr key={blockIdx} className="my-6 border-orange-200" />;
      }

      if (block.startsWith('# ')) {
        return (
          <h1 key={blockIdx} className="text-3xl font-extrabold text-gray-900 border-b border-orange-100 pb-2 mb-4 mt-6">
            {parseInline(block.substring(2))}
          </h1>
        );
      }
      if (block.startsWith('## ')) {
        return (
          <h2 key={blockIdx} className="text-2xl font-bold text-gray-800 mb-3 mt-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
            {parseInline(block.substring(3))}
          </h2>
        );
      }
      if (block.startsWith('### ')) {
        return (
          <h3 key={blockIdx} className="text-xl font-bold text-orange-700 mb-2 mt-4">
            {parseInline(block.substring(4))}
          </h3>
        );
      }

      if (block.startsWith('* ') || block.startsWith('- ')) {
        const lines = block.split('\n');
        return (
          <ul key={blockIdx} className="list-none space-y-2 mb-4 pl-1">
            {lines.map((line, lineIdx) => {
              const cleanLine = line.replace(/^[\*\-]\s+/, '');
              const isCheckbox = cleanLine.startsWith('[ ]') || cleanLine.startsWith('[-]') || cleanLine.startsWith('[x]') || cleanLine.startsWith('[X]');
              if (isCheckbox) {
                const isChecked = cleanLine.startsWith('[x]') || cleanLine.startsWith('[X]');
                const taskText = cleanLine.substring(3).trim();
                return (
                  <li key={lineIdx} className="flex items-start gap-3 text-gray-700">
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      readOnly 
                      className="mt-1 rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4" 
                    />
                    <span>{parseInline(taskText)}</span>
                  </li>
                );
              }
              return (
                <li key={lineIdx} className="flex items-start gap-2.5 text-gray-700">
                  <span className="text-orange-500 mt-1.5 text-xs">◆</span>
                  <span>{parseInline(cleanLine)}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={blockIdx} className="text-gray-700 leading-relaxed mb-4 text-base font-sans">
          {parseInline(block)}
        </p>
      );
    });
  };

  const hasAnyResult = !!(results.dossier || results.checklist || results.expand);
  const currentResult = results[activeTab];

  if (!hasAnyResult && !loading && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-fadeIn">
        <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Jules processou seus dados!</h3>
            <p className="text-gray-500 max-w-md">
                Nossos agentes analisaram o seu contexto. O que você precisa agora para otimizar sua experiência de negócio?
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <button
                onClick={() => callAI('dossier')}
                className="flex flex-col items-center p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition group text-left"
            >
                <FileText className="w-12 h-12 text-orange-400 group-hover:text-orange-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-800">Gerar Dossiê</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Um relatório analítico e profundo sobre a alma do seu negócio e gargalos.</p>
            </button>
            <button
                onClick={() => callAI('checklist')}
                className="flex flex-col items-center p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition group text-left"
            >
                <ListChecks className="w-12 h-12 text-orange-400 group-hover:text-orange-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-800">Criar Checklist</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Tarefas práticas e acionáveis para tornar sua operação mais enxuta agora.</p>
            </button>
            <button
                onClick={() => callAI('expand')}
                className="flex flex-col items-center p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition group text-left"
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sleek top tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('dossier')}
          className={`px-4 py-3 font-bold text-sm rounded-t-lg border-b-2 transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'dossier' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <FileText className="w-4 h-4" />
          Dossiê
          {results.dossier && <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>}
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-3 font-bold text-sm rounded-t-lg border-b-2 transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'checklist' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <ListChecks className="w-4 h-4" />
          Checklist
          {results.checklist && <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>}
        </button>
        <button
          onClick={() => setActiveTab('expand')}
          className={`px-4 py-3 font-bold text-sm rounded-t-lg border-b-2 transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'expand' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <PlusCircle className="w-4 h-4" />
          Jornada Dinâmica
          {results.expand && <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>}
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-orange-50/10 border border-orange-100 rounded-2xl p-6 md:p-8 min-h-[250px] flex flex-col justify-between">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 my-auto">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <h3 className="text-xl font-bold text-gray-800">
              {activeTab === 'expand' ? 'Criando novas jornadas dinâmicas...' : 'Os agentes estão discutindo a melhor estratégia...'}
            </h3>
            <p className="text-gray-500 max-w-md text-center text-sm">
              Analisando suas respostas focando em unit economics e valor percebido.
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center space-y-4 my-auto">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-800">Ops! Algo deu errado</h3>
              <p className="text-red-600 mt-1 text-sm">{error}</p>
            </div>
            <button
              onClick={() => { setError(null); }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
            >
              Tentar Novamente
            </button>
          </div>
        ) : !currentResult ? (
          /* Generate Prompt for ungenerated tab */
          <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-orange-200 rounded-xl bg-white shadow-sm my-auto">
            <h4 className="text-lg font-bold text-gray-800 mb-2">Este artefato ainda não foi gerado</h4>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
              Nossos agentes de IA podem gerar este material complementar com base nas informações coletadas no questionário.
            </p>
            <button
              onClick={() => callAI(activeTab)}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {activeTab === 'dossier' && <FileText className="w-5 h-5" />}
              {activeTab === 'checklist' && <ListChecks className="w-5 h-5" />}
              {activeTab === 'expand' && <PlusCircle className="w-5 h-5" />}
              Gerar com IA
            </button>
          </div>
        ) : (
          /* Render Active Tab's Result */
          <div className="prose prose-orange max-w-none">
            {activeTab === 'expand' ? (
              /* Beautiful Step Preview for Expand Intent */
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900 text-lg">Novas jornadas prontas para início!</h4>
                    <p className="text-sm text-green-700 mt-1">
                      O agente analisou seu principal gargalo e criou novos formulários direcionados. Clique em "Iniciar Nova Jornada" abaixo para prosseguir.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  {((currentResult?.newSteps) || []).map((s: any, i: number) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-orange-300 transition">
                      <h5 className="font-bold text-gray-800 text-base flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center justify-center font-bold">{i+1}</span>
                        {s.title}
                      </h5>
                      {s.fields && (
                        <div className="mt-3 pl-8 border-l-2 border-orange-100 space-y-2">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Perguntas criadas pelo agente:</p>
                          {s.fields.map((f: any, fi: number) => (
                            <div key={fi} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="text-orange-400">•</span>
                              <span>{f.label} <span className="text-xs text-gray-400 font-mono">({f.type})</span></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Sleek rendered Markdown for Dossier or Checklist */
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans bg-white p-6 md:p-8 rounded-xl border border-orange-100 shadow-sm">
                {typeof currentResult === 'string' ? renderMarkdown(currentResult) : JSON.stringify(currentResult, null, 2)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Actions Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100">
        <button
          onClick={handleReset}
          className="px-6 py-2.5 text-gray-500 font-bold hover:text-gray-800 hover:bg-gray-50 rounded-lg transition"
        >
          Limpar e Voltar
        </button>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          {activeTab !== 'expand' && results.expand && (
            <button
              onClick={() => setActiveTab('expand')}
              className="px-6 py-3 border border-orange-200 text-orange-600 hover:bg-orange-50 font-bold rounded-lg transition text-sm flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Ver Novas Jornadas
            </button>
          )}
          
          {currentResult && (
            <button
              onClick={() => onComplete(currentResult)}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <CheckCircle2 size={20} />
              {activeTab === 'expand' ? 'Iniciar Nova Jornada' : (isLast ? 'Finalizar Jornada' : 'Continuar')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailAIStep;