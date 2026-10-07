import React from 'react';
import {
  FileCheck,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  School,
  CheckCircle2,
  Clock,
  Keyboard,
  ShieldCheck,
  Download,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CandidateProfile, SubjectId } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { RilaLogo } from '../common/RilaLogo';

interface Props {
  profile: CandidateProfile;
  onStartMock: () => void;
  onStartSubjectPractice: (subId?: SubjectId) => void;
  onOpenNovelStudy: () => void;
  onOpenAnalytics: () => void;
  onOpenProfile: () => void;
  onOpenKeyHelp: () => void;
}

export const HomeView: React.FC<Props> = ({
  profile,
  onStartMock,
  onStartSubjectPractice,
  onOpenNovelStudy,
  onOpenAnalytics,
  onOpenProfile,
  onOpenKeyHelp,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-600/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                JAMB 2026/2027 CBT ENGINE
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                100% Offline Ready
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Master the JAMB UTME with Authentic CBT Simulation
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Practice real past questions, authentic 8-key keyboard navigation (<kbd className="text-emerald-400 font-mono">A, B, C, D, P, N, S, R</kbd>), exam countdown timers, and in-depth performance diagnostics for Windows, macOS, and Linux.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartMock}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition active:scale-95"
              >
                <FileCheck className="w-5 h-5" />
                <span>Launch Full UTME Mock</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStartSubjectPractice()}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750 font-semibold text-sm transition"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Single Subject Practice</span>
              </button>

              <PWAInstallButton buttonStyle="primary" />

              <a
                href="/jamb-cbt-offline-app.zip"
                download="jamb-cbt-offline-app.zip"
                title="Download entire application in a ZIP file"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-sm transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download ZIP Folder</span>
              </a>
            </div>
          </div>

          {/* Rila Solutions Official Emblem Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md text-center shrink-0 w-52">
            <RilaLogo size="xl" variant="icon" />
            <span className="mt-3 font-black text-xs tracking-wider text-slate-100">
              RILA SOLUTIONS
            </span>
            <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">
              ICT & Tech Systems
            </span>
            <span className="mt-2 text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800">
              Official CBT Engine
            </span>
          </div>
        </div>
      </div>

      {/* Target & Institution Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Your UTME Target</div>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span>{profile.targetScore} / 400</span>
              <span className="text-xs font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Aim High
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.preferredInstitution} • {profile.preferredCourse}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Edit Goals & Subjects
          </button>
          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold transition"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Progress</span>
          </button>
        </div>
      </div>

      {/* Practice Modes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-100">Practice Modes & Examination Features</h2>
          <span className="text-xs text-slate-400">Fully available offline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Full Mock */}
          <div
            onClick={onStartMock}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition">
                Simulated 4-Subject Mock
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Realistic exam conditions: Use of English (60 questions) + 3 chosen electives (40 questions each) with real 120-minute countdown and official grading.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>Start Mock Exam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Subject Drills */}
          <div
            onClick={() => onStartSubjectPractice()}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition">
                Targeted Subject & Topic Practice
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Select any of the 11 JAMB subjects. Filter by year (2024–2018) or topic (Calculus, Genetics, Organic Chemistry, etc.) with instant step-by-step explanations.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <span>Explore Subject Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Novel Study */}
          <div
            onClick={onOpenNovelStudy}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition">
                "The Life Changer" Study Guide
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Comprehensive chapter-by-chapter summaries (Chapters 1–9), character profiles (Salma, Doctor Kabir, Habib), and targeted past questions for the compulsory text.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Open Novel Study Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 8-Key CBT Navigation Highlight */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Authentic JAMB 8-Key Keyboard Navigation
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Real JAMB test centers use the 8-key mode so students do not need a computer mouse. Use <kbd className="text-emerald-400 font-mono">A, B, C, D</kbd> to pick answers, <kbd className="text-blue-400 font-mono">P</kbd> for Previous, <kbd className="text-blue-400 font-mono">N</kbd> for Next, <kbd className="text-amber-400 font-mono">R</kbd> for Review, and <kbd className="text-red-400 font-mono">S</kbd> to Submit.
          </p>
        </div>

        <button
          onClick={onOpenKeyHelp}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition"
        >
          View Keyboard Shortcuts Guide
        </button>
      </div>

      {/* Available Subjects Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-100">All 11 JAMB UTME Subjects</h2>
          <span className="text-xs text-slate-400">Click any to drill</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onStartSubjectPractice(sub.id)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-left transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                  {sub.code}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">{sub.category}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition truncate">
                {sub.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {sub.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
