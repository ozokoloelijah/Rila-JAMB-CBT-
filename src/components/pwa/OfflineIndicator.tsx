import React from 'react';
import { useOnlineStatus } from '../../utils/pwa/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2">
      {!isOnline ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Active (All CBT local)</span>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Offline Ready</span>
        </div>
      )}
    </div>
  );
};
