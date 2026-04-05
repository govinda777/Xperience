import React, { useEffect, useState } from 'react';
import { Trail } from '../../types/trails';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, Clock, Map, ClipboardList, Zap, ChevronRight } from 'lucide-react';
import { TrailStorageService } from '../../services/trailStorageService';

interface TrailListProps {
  hideHeader?: boolean;
}

const TrailList: React.FC<TrailListProps> = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
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
    if (trailId.includes('onboarding')) return <Zap size={24} />;
    if (trailId.includes('business')) return <Map size={24} />;
    return <ClipboardList size={24} />;
  };

  const getColors = (trailId: string) => {
    if (trailId.includes('onboarding')) return 'bg-orange-100 text-orange-600 group-hover:bg-orange-500';
    if (trailId.includes('business')) return 'bg-blue-100 text-blue-600 group-hover:bg-blue-500';
    return 'bg-purple-100 text-purple-600 group-hover:bg-purple-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={hideHeader ? '' : 'max-w-5xl mx-auto px-4 py-8'}>
      {!hideHeader && (
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Minha Jornada</h1>
          <p className="text-gray-500 text-lg">
            Siga as trilhas para desenvolver seu negócio e dominar as ferramentas Xperience.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trails.map((trail) => {
          const status = getStatus(trail.trailId);
          const state = TrailStorageService.getTrailState(trail.trailId);
          const progress = Math.round(((state.completed ? trail.steps.length : state.currentStepIndex) / trail.steps.length) * 100);

          return (
            <div
              key={trail.trailId}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col group"
              onClick={() => navigate(`/trails/${trail.trailId}`)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:text-white ${getColors(trail.trailId)}`}>
                  {getIcon(trail.trailId)}
                </div>
                {status === 'completed' ? (
                  <span className="flex items-center gap-1.5 text-xs font-black bg-green-100 text-green-700 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <CheckCircle2 size={14} /> Concluída
                  </span>
                ) : status === 'in_progress' ? (
                  <span className="flex items-center gap-1.5 text-xs font-black bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <Clock size={14} /> {progress}%
                  </span>
                ) : null}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                {trail.title}
              </h3>
              <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">
                {trail.description}
              </p>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {trail.steps.length} PASSOS
                </span>
                <button className="flex items-center gap-2 text-sm font-black text-orange-500 group-hover:gap-3 transition-all">
                  {status === 'not_started' ? 'Começar' : 'Continuar'} <ChevronRight size={18} />
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
