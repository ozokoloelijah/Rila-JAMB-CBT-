import React from 'react';
import { AlertCircle, CheckCircle2, Clock, X, Send } from 'lucide-react';
import { SubjectId, Question } from '../../types';
import { SUBJECTS } from '../../data/subjects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  subjects: SubjectId[];
  questions: Question[];
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  reviewMarks: Record<string, boolean>;
  remainingSeconds: number;
}

export const SubmitConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  subjects,
  questions,
  answers,
  reviewMarks,
  remainingSeconds,
}) => {
  if (!isOpen) return null;

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length;
  const unansweredCount = totalQuestions - answeredCount;
  const markedCount = questions.filter((q) => reviewMarks[q.id]).length;

  const minutesRemaining = Math.floor(remainingSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Confirm Exam Submission</h3>
              <p className="text-xs text-slate-400">Verify your question status before final grading</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning banner if unanswered questions exist */}
        {unansweredCount > 0 ? (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Attention Candidate: </span>
              You have <span className="font-bold text-amber-300">{unansweredCount} unanswered questions</span> remaining. You still have <strong>{minutesRemaining} minutes</strong> left on the clock.
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex gap-2.5 items-center">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Outstanding work! You have answered all <strong>{totalQuestions} questions</strong>.
            </span>
          </div>
        )}

        {/* Breakdown by Subject */}
        <div className="mt-4 space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Subject Status Breakdown
          </div>
          {subjects.map((subId) => {
            const info = SUBJECTS.find((s) => s.id === subId);
            const subQuestions = questions.filter((q) => q.subjectId === subId);
            const subAnswered = subQuestions.filter(
              (q) => answers[q.id] !== null && answers[q.id] !== undefined
            ).length;
            const subUnanswered = subQuestions.length - subAnswered;

            return (
              <div
                key={subId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
              >
                <span className="font-semibold text-slate-200">{info?.name || subId}</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">{subAnswered} answered</span>
                  {subUnanswered > 0 ? (
                    <span className="text-amber-400">{subUnanswered} pending</span>
                  ) : (
                    <span className="text-slate-500">All done</span>
                  )}
                  <span className="text-slate-500 font-mono">({subQuestions.length})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs sm:text-sm transition"
          >
            Return to Exam
          </button>
          <button
            onClick={onConfirmSubmit}
            className="w-full sm:w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Yes, Submit Examination</span>
          </button>
        </div>
      </div>
    </div>
  );
};
