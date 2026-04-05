import React, { useEffect, useState } from 'react';
import { Trail } from '../../types/trails';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, Clock, Map, ClipboardList, Zap } from 'lucide-react';
import { TrailStorageService } from '../../services/trailStorageService';

const TrailList = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        // Fetch trail list - for now we'll hardcode the list of files to fetch
        const trailFiles = ['onboarding.json', 'business-map.json'];
        const trailData = await Promise.all(
          trailFiles.map(async (file) => {
            const res = await fetch(`/trails/${file}`);
            return res.json();
          })
        );
        setTrails(trailData);
      } catch (e) {
        console.error('Failed to load trails', e);
      } finally {
        setLoading(false);
      }
    };

    fetchTrails();
  }, []);

  const getStatus = (trailId: string) => {
    const state = TrailStorageService.getTrailState(trailId);
    if (state.completed) return 'completed';
    if (state.currentStepIndex > 0 || Object.keys(state.data).length > 0) return 'in_progress';
    return 'not_started';
  };

  const getIcon = (trailId: string) => {
    if (trailId.includes('onboarding')) return <Zap className="text-orange-500" />;
    if (trailId.includes('business')) return <Map className="text-blue-500" />;
    return <ClipboardList className="text-purple-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Minha Jornada</h1>
        <p className="text-gray-500">
          Siga as trilhas para desenvolver seu negócio e dominar as ferramentas Xperience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trails.map((trail) => {
          const status = getStatus(trail.trailId);
          const state = TrailStorageService.getTrailState(trail.trailId);
          const progress = Math.round(((state.completed ? trail.steps.length : state.currentStepIndex) / trail.steps.length) * 100);

          return (
            <div
              key={trail.trailId}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col group"
              onClick={() => navigate(`/trails/${trail.trailId}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-orange-50 transition-colors">
                  {getIcon(trail.trailId)}
                </div>
                {status === 'completed' ? (
                  <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Concluída
                  </span>
                ) : status === 'in_progress' ? (
                  <span className="flex items-center gap-1 text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    <Clock size={12} /> {progress}%
                  </span>
                ) : null}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                {trail.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                {trail.description}
              </p>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {trail.steps.length} PASSOS
                </span>
                <button className="flex items-center gap-2 text-sm font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                  {status === 'not_started' ? 'Começar' : 'Continuar'} <Play size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrailList;
