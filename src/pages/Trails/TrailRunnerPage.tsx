import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trail } from '../../types/trails';
import TrailRunner from '../../components/trails/TrailRunner';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

const TrailRunnerPage = () => {
  const { trailId } = useParams<{ trailId: string }>();
  const navigate = useNavigate();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrail = async () => {
      if (!trailId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/trails/${trailId}.json`);
        if (!response.ok) {
          throw new Error('Jornada não encontrada ou indisponível no momento.');
        }
        const data = await response.json();
        setTrail(data);
      } catch (err: any) {
        console.error('Failed to load trail', err);
        setError(err.message || 'Ocorreu um erro ao carregar a jornada.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrail();
  }, [trailId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-xl font-medium text-gray-700">Carregando jornada...</p>
      </div>
    );
  }

  if (error || !trail) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-12 flex flex-col items-center space-y-6 max-w-xl text-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-800">Ops! Tivemos um problema</h2>
                <p className="text-red-600">{error || 'Jornada não disponível.'}</p>
            </div>
            <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-md"
            >
                Voltar ao Dashboard
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TrailRunner trail={trail} />
    </div>
  );
};

export default TrailRunnerPage;
