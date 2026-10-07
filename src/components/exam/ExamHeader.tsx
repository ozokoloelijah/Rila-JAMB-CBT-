import React from 'react';
import { Clock, Calculator, Keyboard, Maximize, Minimize, Volume2, VolumeX, Send, AlertTriangle } from 'lucide-react';
import { CandidateProfile } from '../../types';
import { RilaLogo } from '../common/RilaLogo';

interface Props {
  profile: CandidateProfile;
  remainingSeconds: number;
  totalDurationSeconds: number;
  onToggleCalculator: () => void;
  onOpenKeyHelp: () => void;
  onSubmitClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ExamHeader: React.FC<Props> = ({
  profile,
  remainingSeconds,
  totalDurationSeconds,
  onToggleCalculator,
  onOpenKeyHelp,
  onSubmitClick,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = remainingSeconds <= 600; // 10 minutes
  const isMidTime = remainingSeconds <= 1800 && !isLowTime; // 30 minutes

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Candidate Information Bar (Official CBT Style) */}
        <div className="flex items-center gap-3">
          <RilaLogo size="sm" variant="icon" />
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow-sm border border-emerald-400/30">
            {profile.name.charAt(0)}
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">{profile.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {profile.registrationNumber}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>JAMB UTME CBT Engine</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Seat: C-14</span>
            </div>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div className="flex items-center">
          <div
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl border transition-all ${
              isLowTime
                ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse shadow-red-900/30 shadow-md'
                : isMidTime
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-700/40 text-emerald-300'
            }`}
          >
            {isLowTime ? (
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            ) : (
              <Clock className="w-4 h-4 text-emerald-400" />
            )}
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Time Remaining</div>
              <div className="text-lg font-mono font-black tracking-tight leading-none">{formattedTime}</div>
            </div>
          </div>
        </div>

        {/* Action Controls & Submit */}
        <div className="flex items-center gap-2">
          {/* Calculator Button */}
          <button
            onClick={onToggleCalculator}
            title="Open CBT Calculator (C)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Calculator</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-700">
              C
            </kbd>
          </button>

          {/* 8-Key Navigation Help */}
          <button
            onClick={onOpenKeyHelp}
            title="8-Key Navigation Guide"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">8-Key Mode</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio Chimes' : 'Enable Audio Chimes'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            title="Toggle Fullscreen Mode (F)"
            className="hidden sm:flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Submit Exam Button */}
          <button
            onClick={onSubmitClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition active:scale-95 border border-red-400/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-red-800/80 text-[10px] text-red-200">S</kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
