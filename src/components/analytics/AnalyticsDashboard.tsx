import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  Award,
  Bookmark,
  Calendar,
  Download,
  Upload,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ExamResult, SubjectId } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { storage } from '../../utils/storage';

interface Props {
  results: ExamResult[];
  onStartSubjectPractice: (subjectId: SubjectId) => void;
  onClearHistory: () => void;
  onSelectResult: (result: ExamResult) => void;
}

export const AnalyticsDashboard: React.FC<Props> = ({
  results,
  onStartSubjectPractice,
  onClearHistory,
  onSelectResult,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const totalExams = results.length;
  const highestScore = totalExams > 0 ? Math.max(...results.map((r) => r.totalScore)) : 0;
  const averageScore = totalExams > 0 ? Math.round(results.reduce((acc, r) => acc + r.totalScore, 0) / totalExams) : 0;

  // Calculate subject aggregate performance across all exams
  const subjectAggregates: Record<SubjectId, { totalAnswered: number; totalCorrect: number; totalScaled: number; count: number }> = {} as any;

  results.forEach((r) => {
    r.subjectResults.forEach((s) => {
      if (!subjectAggregates[s.subjectId]) {
        subjectAggregates[s.subjectId] = { totalAnswered: 0, totalCorrect: 0, totalScaled: 0, count: 0 };
      }
      subjectAggregates[s.subjectId].totalAnswered += s.totalQuestions;
      subjectAggregates[s.subjectId].totalCorrect += s.correctCount;
      subjectAggregates[s.subjectId].totalScaled += s.scaledScore;
      subjectAggregates[s.subjectId].count += 1;
    });
  });

  // Calculate weak topics from wrong questions
  const weakTopics: Record<string, { topic: string; subjectId: SubjectId; wrongCount: number }> = {};
  results.forEach((r) => {
    r.questions.forEach((q) => {
      const isCorrect = r.answers[q.id] === q.correctAnswer;
      if (!isCorrect) {
        const key = `${q.subjectId}-${q.topic}`;
        if (!weakTopics[key]) {
          weakTopics[key] = { topic: q.topic, subjectId: q.subjectId, wrongCount: 0 };
        }
        weakTopics[key].wrongCount += 1;
      }
    });
  });

  const sortedWeakTopics = Object.values(weakTopics)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 6);

  const handleExportData = () => {
    const dataStr = storage.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jamb-cbt-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importAllData(content);
      if (success) {
        setImportStatus('Data imported successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <span>JAMB CBT Performance Analytics & Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-400">
            Offline progress tracker, speed metrics, and weak topic remediation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            title="Download offline backup of all tests and bookmarks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backup Data</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Restore Data</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
          {importStatus}
        </div>
      )}

      {/* Top Key Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Exams Taken</div>
          <div className="text-3xl font-mono font-black text-white mt-1">{totalExams}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stored in Local Cache</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Highest Score</div>
          <div className="text-3xl font-mono font-black text-emerald-400 mt-1">
            {highestScore}
            <span className="text-sm font-normal text-slate-400 font-sans"> /400</span>
          </div>
          <div className="text-xs text-emerald-300 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Personal Best</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average UTME Aggregate</div>
          <div className="text-3xl font-mono font-black text-blue-400 mt-1">
            {averageScore}
            <span className="text-sm font-normal text-slate-400 font-sans"> /400</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Goal: 280+ for Federal Unis</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bookmarked Questions</div>
          <div className="text-3xl font-mono font-black text-amber-400 mt-1">
            {storage.getBookmarks().length}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved for Revision</span>
          </div>
        </div>
      </div>

      {totalExams === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
          <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Examination Attempts Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Complete your first full JAMB mock exam or single subject practice to generate detailed diagnostics and speed metrics.
          </p>
        </div>
      ) : (
        <>
          {/* Recent Exam History & Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score History Cards */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Recent Exam Attempts</span>
                </h3>
                <span className="text-xs text-slate-400">Click any attempt to inspect Result Slip</span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {results.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectResult(item)}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-950 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm">Attempt #{results.length - index}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {item.mode === 'full_mock' ? 'Mock Exam' : 'Practice'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.examDate} • {Math.round(item.timeUsedSeconds / 60)} mins used • {item.questions.length} questions
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-mono font-black text-emerald-400 group-hover:scale-105 transition">
                        {item.totalScore}
                        <span className="text-xs text-slate-400 font-normal"> /400</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.percentage}% accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Areas & Remediation */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100">Priority Revision Topics</h3>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Topics with the highest error rates identified from your past tests:
                </p>

                <div className="space-y-2.5">
                  {sortedWeakTopics.length === 0 ? (
                    <p className="text-xs text-slate-400">Great job! No weak topics detected yet.</p>
                  ) : (
                    sortedWeakTopics.map((item) => {
                      const sub = SUBJECTS.find((s) => s.id === item.subjectId);
                      return (
                        <div
                          key={`${item.subjectId}-${item.topic}`}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-xs font-semibold text-slate-200 block truncate max-w-[150px]">
                              {item.topic}
                            </span>
                            <span className="text-[10px] text-slate-400">{sub?.name}</span>
                          </div>
                          <button
                            onClick={() => onStartSubjectPractice(item.subjectId)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-semibold transition"
                          >
                            Practice
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={onClearHistory}
                  className="w-full text-center text-xs text-slate-400 hover:text-red-400 transition"
                >
                  Clear Exam History
                </button>
              </div>
            </div>
          </div>

          {/* Subject Mastery Radar */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 mb-4">Subject Mastery & Average Scaled Score</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(subjectAggregates).map(([subId, stats]) => {
                const sub = SUBJECTS.find((s) => s.id === subId);
                const avgScaled = stats.count > 0 ? Math.round(stats.totalScaled / stats.count) : 0;
                const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

                return (
                  <div key={subId} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-200 text-xs">{sub?.name}</span>
                      <span className="font-mono text-emerald-400 text-sm font-bold">{avgScaled}/100</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>{accuracy}% accuracy</span>
                      <span>{stats.count} test(s)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
