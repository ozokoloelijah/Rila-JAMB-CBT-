import React from 'react';
import { Flag, CheckCircle2, Circle, Eye, ArrowDownRight } from 'lucide-react';
import { Question } from '../../types';

interface Props {
  questions: Question[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  reviewMarks: Record<string, boolean>;
  onJumpToNextUnanswered: () => void;
}

export const QuestionPalette: React.FC<Props> = ({
  questions,
  currentIndex,
  onSelectIndex,
  answers,
  reviewMarks,
  onJumpToNextUnanswered,
}) => {
  const answeredCount = questions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length;
  const markedCount = questions.filter((q) => reviewMarks[q.id]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <aside className="w-full lg:w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-fit">
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Question Palette</h4>
        <span className="text-xs font-mono text-emerald-400 font-bold">
          {answeredCount}/{questions.length} Answered
        </span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800/80 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-emerald-600 border border-emerald-400" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
          <span>Pending ({unansweredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-amber-500 border border-amber-300" />
          <span>Review ({markedCount})</span>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="py-3">
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-60 sm:max-h-72 lg:max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;
            const isMarked = reviewMarks[q.id];
            const isCurrent = idx === currentIndex;

            let bgClass = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700';
            if (isMarked) {
              bgClass = 'bg-amber-500/90 text-slate-950 font-bold border-amber-300 shadow-sm';
            } else if (isAnswered) {
              bgClass = 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm';
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectIndex(idx)}
                className={`relative h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${bgClass} ${
                  isCurrent ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-105 z-10 font-black' : ''
                }`}
              >
                {idx + 1}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border border-slate-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Jump Action */}
      {unansweredCount > 0 && (
        <button
          onClick={onJumpToNextUnanswered}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
          <span>Jump to Next Unanswered</span>
        </button>
      )}
    </aside>
  );
};
