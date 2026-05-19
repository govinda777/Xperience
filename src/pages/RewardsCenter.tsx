import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  Trophy,
  Calendar,
  FileText,
  Sparkles,
  Compass,
  CheckCircle,
  Timer
} from 'lucide-react';

interface UserXpData {
  xp: number;
  level: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: React.ElementType;
  cooldownKey: string;
}

const MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Check-in Diário',
    description: 'Ganhe XP todos os dias',
    xpReward: 10,
    icon: Calendar,
    cooldownKey: 'daily_checkin'
  },
  {
    id: '2',
    title: 'Completar Onboarding',
    description: 'Responda as perguntas iniciais',
    xpReward: 100,
    icon: FileText,
    cooldownKey: 'complete_onboarding'
  },
  {
    id: '3',
    title: 'Gerar Dossiê de IA',
    description: 'Crie análises de IA para seu negócio',
    xpReward: 50,
    icon: Sparkles,
    cooldownKey: 'generate_dossier'
  },
  {
    id: '4',
    title: 'Explorar Solução',
    description: 'Visite e leia os detalhes de uma solução',
    xpReward: 15,
    icon: Compass,
    cooldownKey: 'explore_solution'
  }
];

const RewardsCenter: React.FC = () => {
  const { getAccessToken } = usePrivy();
  const [xpData, setXpData] = useState<UserXpData>({ xp: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, Date>>({});

  const fetchXpData = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/xp', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setXpData({ xp: data.xp, level: data.level || 1 });
      }
    } catch (err) {
      console.error('Failed to fetch XP data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchXpData();
  }, [getAccessToken]);

  const handleClaimReward = async (mission: Mission) => {
    if (claiming || (cooldowns[mission.cooldownKey] && cooldowns[mission.cooldownKey] > new Date())) return;

    setClaiming(mission.id);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: mission.xpReward,
          reason: mission.title,
          missionKey: mission.cooldownKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setXpData(prev => ({ ...prev, xp: data.xp, level: data.level || prev.level }));
      } else if (res.status === 429) {
        const data = await res.json();
        setCooldowns(prev => ({
          ...prev,
          [mission.cooldownKey]: new Date(data.expiresAt)
        }));
      }
    } catch (err) {
      console.error('Failed to claim reward', err);
    } finally {
      setClaiming(null);
    }
  };

  const calculateLevelProgress = (xp: number, level: number) => {
    // Basic progression: level 1 = 0-500, level 2 = 500-1000, etc.
    const levelSize = 500;
    const nextLevelXp = level * levelSize;
    const currentLevelBaseXp = (level - 1) * levelSize;
    const progress = xp - currentLevelBaseXp;

    return {
      progress,
      nextLevelXp,
      percentage: Math.min(100, Math.max(0, (progress / levelSize) * 100))
    };
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const { progress, nextLevelXp, percentage } = calculateLevelProgress(xpData.xp, xpData.level);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header Widget */}
      <div className="mb-12 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 p-8 text-white shadow-xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-8 flex items-center gap-6 md:mb-0">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)] backdrop-blur-sm">
              <div className="absolute inset-0 animate-ping rounded-full bg-white/20 opacity-75"></div>
              <Trophy size={40} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">Nível {xpData.level}</h1>
              <p className="text-orange-100 opacity-90">Continue explorando para subir de nível!</p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span>Progresso</span>
              <span>{xpData.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-black/20 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Grid */}
      <div className="mb-8 flex items-center gap-3">
        <Sparkles className="text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Missões Disponíveis</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {MISSIONS.map(mission => {
          const expiration = cooldowns[mission.cooldownKey];
          const isOnCooldown = expiration && expiration > new Date();
          const Icon = mission.icon;

          return (
            <div
              key={mission.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className={`rounded-xl p-3 ${isOnCooldown ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform'}`}>
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{mission.title}</h3>
                  <p className="text-sm text-gray-500">{mission.description}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-4">
                <div className="flex h-10 items-center rounded-lg bg-orange-100 px-4 font-bold text-orange-600">
                  +{mission.xpReward} XP
                </div>

                <button
                  onClick={() => handleClaimReward(mission)}
                  disabled={isOnCooldown || claiming === mission.id}
                  className={`flex h-10 flex-1 items-center justify-center rounded-lg font-bold transition-all ${
                    isOnCooldown
                      ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:from-orange-600 hover:to-amber-600 active:scale-95'
                  }`}
                >
                  {claiming === mission.id ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : isOnCooldown ? (
                    <span className="flex items-center gap-2 text-sm">
                      <Timer size={16} /> Em espera
                    </span>
                  ) : (
                    'Resgatar XP'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsCenter;
