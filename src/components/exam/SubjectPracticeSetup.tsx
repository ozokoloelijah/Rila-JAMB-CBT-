import React, { useState } from 'react';
import { BookOpen, Play, Check, Filter, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { SubjectId, ExamConfig } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { getTopicsForSubject, getYearsForSubject } from '../../data/questions';

interface Props {
  initialSubjectId?: SubjectId;
  onLaunchPractice: (config: ExamConfig) => void;
  onBack: () => void;
}

export const SubjectPracticeSetup: React.FC<Props> = ({
  initialSubjectId = 'english',
  onLaunchPractice,
  onBack,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubjectId);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true); // Study mode by default

  const availableTopics = getTopicsForSubject(selectedSubject);
  const availableYears = getYearsForSubject(selectedSubject);

  const handleStart = () => {
    onLaunchPractice({
      mode: 'subject_practice',
      selectedSubjects: [selectedSubject],
      durationMinutes,
      questionsPerSubject: { [selectedSubject]: questionCount } as any,
      selectedYear,
      selectedTopic,
      instantFeedback,
      shuffleQuestions: true,
      strictTimer: !instantFeedback,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Drill & Revision Mode
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
              Custom Subject & Topic Practice
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deep-dive into specific subjects with instant explanations or timed tests.
            </p>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Subject Grid */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
            Select Subject to Practice
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubject(sub.id);
                    setSelectedTopic('all');
                  }}
                  className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{sub.name}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 ml-1 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls: Topic & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Filter by Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Topics (Full Syllabus)</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Filter by Past Question Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
              }
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Available Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  JAMB {year} Past Questions
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Count & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 40].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setQuestionCount(num);
                    setDurationMinutes(Math.round(num * 1.0)); // 1 min per question default
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                    questionCount === num
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Allotted Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 45].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDurationMinutes(m)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                    durationMinutes === m
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {m} mins
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Practice Mode Choice */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Feedback & Study Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInstantFeedback(true)}
              className={`p-3.5 rounded-xl border text-left transition ${
                instantFeedback
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Instant Explanation Mode</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Reveal the correct answer and comprehensive step-by-step reasoning immediately upon choosing an option.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setInstantFeedback(false)}
              className={`p-3.5 rounded-xl border text-left transition ${
                !instantFeedback
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-blue-400 mb-1">
                <Play className="w-4 h-4" />
                <span>Standard Test Drill</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Simulate test conditions without interruptions; reveal score, diagnostics, and full solutions at the end.
              </p>
            </button>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Practice Drill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
