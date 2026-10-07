import React, { useState } from 'react';
import { ArrowLeft, Check, X, Bookmark, HelpCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { ExamResult, Question } from '../../types';
import { storage } from '../../utils/storage';

interface Props {
  result: ExamResult;
  initialFilter?: 'all' | 'wrong' | 'correct' | 'bookmarked';
  onBackToResult: () => void;
}

export const QuestionReview: React.FC<Props> = ({
  result,
  initialFilter = 'all',
  onBackToResult,
}) => {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct' | 'bookmarked'>(initialFilter);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(storage.getBookmarks());

  // Filter questions based on criteria
  const filteredQuestions = result.questions.filter((q) => {
    const userAnswer = result.answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    const isBookmarked = bookmarkedIds.includes(q.id);

    if (filter === 'wrong') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    if (filter === 'bookmarked') return isBookmarked;
    return true;
  });

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleToggleBookmark = (id: string) => {
    storage.toggleBookmark(id);
    setBookmarkedIds(storage.getBookmarks());
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl my-8">
        <p className="text-slate-300 text-sm mb-4">No questions found matching the selected filter ({filter}).</p>
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          View All Questions
        </button>
      </div>
    );
  }

  const userAnswer = result.answers[currentQuestion.id];
  const isCorrect = userAnswer === currentQuestion.correctAnswer;
  const isBookmarked = bookmarkedIds.includes(currentQuestion.id);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToResult}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Result Slip</span>
        </button>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({result.questions.length})
          </button>
          <button
            onClick={() => {
              setFilter('wrong');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'wrong' ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wrong ({result.questions.filter((q) => result.answers[q.id] !== q.correctAnswer).length})
          </button>
          <button
            onClick={() => {
              setFilter('correct');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'correct' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Correct ({result.questions.filter((q) => result.answers[q.id] === q.correctAnswer).length})
          </button>
          <button
            onClick={() => {
              setFilter('bookmarked');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'bookmarked' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bookmarked ({result.questions.filter((q) => bookmarkedIds.includes(q.id)).length})
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 font-mono text-xs font-bold">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
              {currentQuestion.topic}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
              JAMB {currentQuestion.year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {isCorrect ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Correct Answer</span>
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Incorrect</span>
                </>
              )}
            </span>

            <button
              onClick={() => handleToggleBookmark(currentQuestion.id)}
              className={`p-2 rounded-lg border text-xs transition ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Section Label */}
        {currentQuestion.section && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
            {currentQuestion.section}
          </div>
        )}

        {/* Passage */}
        {currentQuestion.passage && (
          <div className="mb-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-h-56 overflow-y-auto scrollbar-thin text-slate-300 text-sm leading-relaxed italic">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 not-italic">
              Comprehension Passage:
            </div>
            {currentQuestion.passage}
          </div>
        )}

        {/* Diagram */}
        {currentQuestion.diagramSvg && (
          <div
            className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: currentQuestion.diagramSvg }}
          />
        )}

        {/* Question Text */}
        <div className="text-base sm:text-lg font-medium text-slate-100 mb-6 leading-relaxed whitespace-pre-line">
          {currentQuestion.question}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((opt) => {
            const isUserPick = userAnswer === opt.key;
            const isCorrectOption = currentQuestion.correctAnswer === opt.key;

            let cardStyle = 'bg-slate-800/50 border-slate-700 text-slate-300';
            if (isCorrectOption) {
              cardStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50';
            } else if (isUserPick && !isCorrectOption) {
              cardStyle = 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500/50';
            }

            return (
              <div
                key={opt.key}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isCorrectOption
                        ? 'bg-emerald-600 text-white'
                        : isUserPick
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm">{opt.text}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isUserPick && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      Your Answer
                    </span>
                  )}
                  {isCorrectOption && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                      Correct Key
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Explanation Box */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-600/30 text-slate-200">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <HelpCircle className="w-4 h-4" />
            <span>Official Solution & Explanation:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {currentQuestion.explanation}
          </p>
        </div>

        {/* Review Navigation Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {filteredQuestions.length}
          </span>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Credit */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>JAMB Solution Bank • Powered by: © </span>
          <a
            href="https://rilasolutions.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-bold transition-colors"
          >
            Rila Solutions
          </a>
        </div>
      </div>
    </div>
  );
};
