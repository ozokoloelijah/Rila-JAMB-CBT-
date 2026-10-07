import React, { useState } from 'react';
import { Play, Check, Clock, Settings, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';
import { CandidateProfile, ExamConfig, SubjectId } from '../../types';
import { SUBJECTS } from '../../data/subjects';

interface Props {
  profile: CandidateProfile;
  onLaunchExam: (config: ExamConfig) => void;
  onBack: () => void;
}

export const MockSetupScreen: React.FC<Props> = ({ profile, onLaunchExam, onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(profile.subjectCombination);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [strictTimer, setStrictTimer] = useState<boolean>(true);

  const toggleSubject = (subId: SubjectId) => {
    if (subId === 'english') return; // Compulsory
    if (selectedSubjects.includes(subId)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subId));
    } else {
      if (selectedSubjects.length < 4) {
        setSelectedSubjects([...selectedSubjects, subId]);
      }
    }
  };

  const handleStart = () => {
    const questionsPerSubject: Record<SubjectId, number> = {} as any;
    selectedSubjects.forEach((subId) => {
      questionsPerSubject[subId] = subId === 'english' ? 60 : 40;
    });

    onLaunchExam({
      mode: 'full_mock',
      selectedSubjects,
      durationMinutes,
      questionsPerSubject,
      instantFeedback: false,
      shuffleQuestions,
      strictTimer,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Official Simulation Mode
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
            Configure Full UTME Mock Examination
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard examination conditions: 4 subjects, 180 questions, 120-minute timer with JAMB 8-key mode.
          </p>
        </div>

        {/* 4-Subject Confirmation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Exam Subject Combination ({selectedSubjects.length}/4 Selected)
            </label>
            <span className="text-xs text-emerald-400 font-medium">Use of English is compulsory</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubjects.includes(sub.id);
              const isCompulsory = sub.id === 'english';

              return (
                <button
                  key={sub.id}
                  type="button"
                  disabled={isCompulsory}
                  onClick={() => toggleSubject(sub.id)}
                  className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate">
                    <span className="block font-bold">{sub.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {sub.id === 'english' ? '60 Questions' : '40 Questions'}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          {selectedSubjects.length < 4 && (
            <div className="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Please select exactly 4 subjects to proceed with standard UTME simulation.</span>
            </div>
          )}
        </div>

        {/* Timer Duration Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
            Exam Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: '120 Minutes', value: 120, desc: 'Real UTME' },
              { label: '90 Minutes', value: 90, desc: 'Accelerated' },
              { label: '60 Minutes', value: 60, desc: 'Speed Mode' },
              { label: '30 Minutes', value: 30, desc: 'Express Drill' },
            ].map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDurationMinutes(d.value)}
                className={`p-3 rounded-xl border text-xs transition text-center ${
                  durationMinutes === d.value
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">{d.label}</div>
                <div className="text-[10px] opacity-75">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 text-xs">Strict Examination Timer</span>
              <p className="text-[11px] text-slate-400">
                Exam automatically finalizes and calculates scores when the countdown timer hits 00:00
              </p>
            </div>
            <input
              type="checkbox"
              checked={strictTimer}
              onChange={(e) => setStrictTimer(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 text-xs">Shuffle Questions Order</span>
              <p className="text-[11px] text-slate-400">
                Randomize the order of questions across each subject like real CBT examination centers
              </p>
            </div>
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </div>
        </div>

        {/* Candidate Rules Notice */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-emerald-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Instructions to Candidate:</span>
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
            <li>Ensure you submit your examination before the allotted time lapses.</li>
            <li>You can navigate back and forth between subjects and question numbers at any time.</li>
            <li>Use the 8 keys (<kbd className="text-emerald-400">A, B, C, D, P, N, S, R</kbd>) on your keyboard for maximum speed.</li>
            <li>The built-in on-screen calculator is accessible via the "C" key.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
          >
            Cancel & Return Home
          </button>

          <button
            onClick={handleStart}
            disabled={selectedSubjects.length !== 4}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm shadow-xl transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Mock Examination</span>
          </button>
        </div>
      </div>
    </div>
  );
};
