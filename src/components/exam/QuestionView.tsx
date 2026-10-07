import React from 'react';
import { Bookmark, Flag, ChevronLeft, ChevronRight, HelpCircle, Check, X, RotateCcw } from 'lucide-react';
import { Question } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  onClearOption: () => void;
  isMarkedForReview: boolean;
  onToggleMarkReview: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  instantFeedback?: boolean; // In study/practice mode
}

export const QuestionView: React.FC<Props> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onClearOption,
  isMarkedForReview,
  onToggleMarkReview,
  isBookmarked,
  onToggleBookmark,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  instantFeedback = false,
}) => {
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <main className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl flex flex-col justify-between">
      {/* Question Header & Meta */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-mono font-black text-sm shadow-sm">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700 font-medium">
              {question.topic}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 font-mono">
              JAMB {question.year}
            </span>
          </div>

          {/* Action Flags */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question for revision'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={onToggleMarkReview}
              title="Mark for review (R)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isMarkedForReview
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isMarkedForReview ? 'fill-slate-950' : ''}`} />
              <span>{isMarkedForReview ? 'Marked (R)' : 'Review (R)'}</span>
            </button>
          </div>
        </div>

        {/* Section Label */}
        {question.section && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
            {question.section}
          </div>
        )}

        {/* Comprehension Passage (if applicable) */}
        {question.passage && (
          <div className="mb-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-h-56 overflow-y-auto scrollbar-thin text-slate-300 text-sm leading-relaxed italic">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 not-italic">
              Read the passage below and answer the following question:
            </div>
            {question.passage}
          </div>
        )}

        {/* Diagram (if applicable) */}
        {question.diagramSvg && (
          <div
            className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: question.diagramSvg }}
          />
        )}

        {/* Question Text */}
        <div className="text-base sm:text-lg font-medium text-slate-100 mb-6 leading-relaxed whitespace-pre-line">
          {question.question}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectAnswer = opt.key === question.correctAnswer;

            let cardStyle = 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600';

            if (instantFeedback && isAnswered) {
              if (isCorrectAnswer) {
                cardStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle = 'bg-red-950/60 border-red-500 text-red-200 ring-1 ring-red-500';
              }
            } else if (isSelected) {
              cardStyle = 'bg-emerald-900/40 border-emerald-500 text-emerald-100 shadow-sm ring-1 ring-emerald-500';
            }

            return (
              <button
                key={opt.key}
                onClick={() => {
                  soundEffects.playOptionClick();
                  onSelectOption(opt.key);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 group active:scale-[0.99] ${cardStyle}`}
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm border transition ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-200'
                    }`}
                  >
                    {opt.key}
                  </div>
                  <span className="text-sm sm:text-base font-normal">{opt.text}</span>
                </div>

                {/* Instant Feedback indicator icon */}
                {instantFeedback && isAnswered && isCorrectAnswer && (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {instantFeedback && isAnswered && isSelected && !isCorrectAnswer && (
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Clear Option Button */}
        {selectedOption && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onClearOption}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Choice</span>
            </button>
          </div>
        )}

        {/* Instant Study Mode Explanation Box */}
        {instantFeedback && isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-700/80 mb-6 animate-in fade-in">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <HelpCircle className="w-4 h-4" />
              <span>Detailed Explanation:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Toolbar */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            soundEffects.playNavBeep();
            onPrevious();
          }}
          disabled={!hasPrevious}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs sm:text-sm font-semibold transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
          <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-700">
            P
          </kbd>
        </button>

        <div className="text-xs text-slate-400 hidden sm:block">
          Use keys <kbd className="text-emerald-400 font-mono">A, B, C, D</kbd> to choose • <kbd className="text-emerald-400 font-mono">P/N</kbd> to navigate
        </div>

        <button
          onClick={() => {
            soundEffects.playNavBeep();
            onNext();
          }}
          disabled={!hasNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-950"
        >
          <span>Next</span>
          <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-emerald-800 text-[10px] text-emerald-200">
            N
          </kbd>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
};
