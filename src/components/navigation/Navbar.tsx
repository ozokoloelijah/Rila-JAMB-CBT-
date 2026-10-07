import React from 'react';
import {
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  HelpCircle,
  FileCheck,
  User,
  Sparkles,
  Download,
  FolderArchive,
} from 'lucide-react';
import { RilaLogo } from '../common/RilaLogo';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { CandidateProfile } from '../../types';

export type ActiveView = 'home' | 'mock_setup' | 'subject_practice' | 'novel_study' | 'analytics';

interface Props {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  profile: CandidateProfile;
  onOpenProfile: () => void;
  onOpenKeyHelp: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  onNavigate,
  profile,
  onOpenProfile,
  onOpenKeyHelp,
}) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <RilaLogo size="md" variant="compact" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => onNavigate('mock_setup')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeView === 'mock_setup'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Full UTME Mock</span>
            </button>

            <button
              onClick={() => onNavigate('subject_practice')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeView === 'subject_practice'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Subject Practice</span>
            </button>

            <button
              onClick={() => onNavigate('novel_study')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeView === 'novel_study'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>The Life Changer</span>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeView === 'analytics'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Analytics</span>
            </button>
          </div>

          {/* Right Utility Bar */}
          <div className="flex items-center gap-2.5">
            <OfflineIndicator />
            
            {/* Direct App ZIP Download */}
            <a
              href="/jamb-cbt-offline-app.zip"
              download="jamb-cbt-offline-app.zip"
              title="Download entire application in a ZIP folder"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            <PWAInstallButton compact />

            {/* 8-Key Shortcut Guide */}
            <button
              onClick={onOpenKeyHelp}
              title="8-Key Navigation System Guide"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>8-Key</span>
            </button>

            {/* Profile Avatar / Trigger */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
              title="Edit Candidate Profile & Cutoffs"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                {profile.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-200 truncate max-w-[90px]">
                  {profile.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">Target {profile.targetScore}+</div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-[11px] font-semibold text-slate-300 overflow-x-auto">
          <button
            onClick={() => onNavigate('mock_setup')}
            className={`px-2.5 py-1 rounded-lg ${
              activeView === 'mock_setup' ? 'bg-emerald-600 text-white' : ''
            }`}
          >
            Mock Exam
          </button>
          <button
            onClick={() => onNavigate('subject_practice')}
            className={`px-2.5 py-1 rounded-lg ${
              activeView === 'subject_practice' ? 'bg-emerald-600 text-white' : ''
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => onNavigate('novel_study')}
            className={`px-2.5 py-1 rounded-lg ${
              activeView === 'novel_study' ? 'bg-emerald-600 text-white' : ''
            }`}
          >
            Novel
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`px-2.5 py-1 rounded-lg ${
              activeView === 'analytics' ? 'bg-emerald-600 text-white' : ''
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </nav>
  );
};
