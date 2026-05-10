import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Zap, Trophy } from "lucide-react";

/**
 * Component to display User XP (Internal Token/Points)
 */
export const UserXPBadge: React.FC = () => {
  const { user, authenticated } = useAuth();
  const [xp, setXp] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchXP = async () => {
      if (!authenticated || !user) return;

      try {
        setLoading(true);
        // We need to get the token from Privy for authenticated requests
        // This assumes a helper to get the session token exists or we use window.localStorage
        const token = window.localStorage.getItem('privy:token');

        const response = await fetch('/api/xp', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setXp(data.xp);
        }
      } catch (error) {
        console.error("Failed to fetch XP:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchXP();
  }, [authenticated, user]);

  if (!authenticated) return null;

  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all">
      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white">
        <Zap size={14} fill="white" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-amber-600 uppercase leading-none">Status XP</span>
        <span className="text-sm font-black text-amber-900 leading-none mt-0.5">
          {loading ? '...' : (xp !== null ? xp.toLocaleString() : '0')}
        </span>
      </div>
      <Trophy size={14} className="text-amber-400 ml-1" />
    </div>
  );
};
