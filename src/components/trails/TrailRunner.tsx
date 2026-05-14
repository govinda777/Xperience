import React, { useState, useEffect } from 'react';
import { Trail, Step, TrailState } from '../../types/trails';
import TrailForm from './TrailForm';
import TrailAIStep from './TrailAIStep';
import TrailProgress from './TrailProgress';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';

interface TrailRunnerProps {
  trail: Trail;
  onComplete?: (state: TrailState) => void;
}

const TRAILS_SESSION_KEY = 'xperience_trails_session';

const TrailRunner: React.FC<TrailRunnerProps> = ({ trail: initialTrail, onComplete }) => {
  const navigate = useNavigate();
  const [trailsSession, setTrailsSession] = useStorage<Record<string, TrailState>>(
    TRAILS_SESSION_KEY,
    {},
    'session'
  );

  const defaultState: TrailState = {
    currentStepIndex: 0,
    data: {},
    completed: false,
    dynamicSteps: []
  };

  const state = trailsSession[initialTrail.trailId] || defaultState;

  // A trail atual é a original + qualquer step dinâmico gerado pelo agente salvos no estado
  const activeSteps = [...initialTrail.steps, ...(state.dynamicSteps || [])];
  const currentStep = activeSteps[state.currentStepIndex];

  const updateState = (newState: TrailState) => {
    setTrailsSession(prev => ({
      ...prev,
      [initialTrail.trailId]: newState
    }));
  };

  const handleNextStep = (stepData?: any) => {
    const newState = { ...state };
    let totalSteps = activeSteps.length;

    // Se o stepData conter 'newSteps' (vindo do AI Step - expand), nós injetamos na jornada (no estado persistido)
    if (stepData && typeof stepData === 'object' && stepData.newSteps && Array.isArray(stepData.newSteps)) {
      newState.dynamicSteps = [...(newState.dynamicSteps || []), ...stepData.newSteps];
      totalSteps += stepData.newSteps.length;

      // O dado salvo desse step não precisa ser os 'newSteps', guardamos que a expansão foi solicitada
      newState.data = {
        ...newState.data,
        [currentStep.id]: { expanded: true, timestamp: Date.now() }
      };
    } else if (stepData !== undefined) {
      // Save data from current step if provided
      newState.data = {
        ...newState.data,
        [currentStep.id]: stepData
      };
    }

    // Check if it's the last step
    if (state.currentStepIndex === totalSteps - 1) {
      newState.completed = true;
      updateState(newState);
      if (onComplete) onComplete(newState);
    } else {
      newState.currentStepIndex += 1;
      updateState(newState);
    }
  };

  const handleBackStep = () => {
    if (state.currentStepIndex > 0) {
      updateState({
        ...state,
        currentStepIndex: state.currentStepIndex - 1
      });
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const currentStepData = state.data[currentStep.id] || {};
    const updatedStepData = { ...currentStepData, [fieldId]: value };

    updateState({
      ...state,
      data: {
        ...state.data,
        [currentStep.id]: updatedStepData
      }
    });
  };

  if (state.completed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8 max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">Parabéns!</h2>
          <p className="text-xl text-gray-600">
            Você completou a jornada <strong>{initialTrail.title}</strong> com sucesso.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            Voltar ao Dashboard
          </button>
          <button
            onClick={() => {
              setTrailsSession(prev => {
                const newSession = { ...prev };
                delete newSession[trail.trailId];
                return newSession;
              });
            }}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow-md flex items-center justify-center gap-2"
          >
            Refazer Jornada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
            <button
                onClick={() => navigate('/dashboard')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                title="Sair da Jornada"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{initialTrail.title}</h1>
        </div>
        <p className="text-gray-500">{initialTrail.description}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="px-8 pt-8">
            <TrailProgress
                currentStep={state.currentStepIndex + 1}
          totalSteps={activeSteps.length}
            />
        </div>

        {/* Step Content */}
        <div className="p-8 pt-4">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{currentStep.title}</h3>
                {currentStep.description && (
                    <p className="text-gray-600">{currentStep.description}</p>
                )}
            </div>

            {currentStep.type === 'form' ? (
                <TrailForm
                    fields={currentStep.fields || []}
                    data={state.data[currentStep.id] || {}}
                    onChange={handleFieldChange}
                    onSubmit={handleNextStep}
                    onBack={handleBackStep}
                    isFirst={state.currentStepIndex === 0}
                    isLast={state.currentStepIndex === activeSteps.length - 1}
                />
            ) : (
                <TrailAIStep
                    step={currentStep}
                    trail={initialTrail}
                    allData={state.data}
                    onComplete={handleNextStep}
                    onBack={handleBackStep}
                    isFirst={state.currentStepIndex === 0}
                    isLast={state.currentStepIndex === activeSteps.length - 1}
                />
            )}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        Seu progresso é salvo automaticamente em cada passo.
      </div>
    </div>
  );
};

export default TrailRunner;
