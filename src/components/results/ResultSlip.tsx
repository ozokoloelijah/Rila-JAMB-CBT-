import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  School,
  FileText,
  Share2,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from 'lucide-react';
import { ExamResult, Question } from '../../types';
import { UNIVERSITY_CUTOFFS } from '../../data/cutoffs';
import { storage } from '../../utils/storage';
import { RilaLogo } from '../common/RilaLogo';

interface Props {
  result: ExamResult;
  onRetake: () => void;
  onReviewQuestions: (filter?: 'all' | 'wrong' | 'correct' | 'bookmarked') => void;
}

export const ResultSlip: React.FC<Props> = ({ result, onRetake, onReviewQuestions }) => {
  const [showCutoffs, setShowCutoffs] = useState(true);

  // Eligible universities based on aggregate score
  const eligibleInstitutions = UNIVERSITY_CUTOFFS.filter(
    (uni) => result.totalScore >= uni.generalCutoff
  );

  const handlePrint = () => {
    window.print();
  };

  const getGradeAssessment = (score: number) => {
    if (score >= 300) return { title: 'Exceptional (Elite Tier)', color: 'text-emerald-400', desc: 'Outstanding score! Highly competitive for top-tier courses like Medicine & Surgery, Law, and Software Engineering at UNILAG, UI, and OAU.' };
    if (score >= 260) return { title: 'Very Good (Competitive)', color: 'text-blue-400', desc: 'Strong performance! Eligible for most competitive university courses across Federal and State universities in Nigeria.' };
    if (score >= 200) return { title: 'Good (Qualified)', color: 'text-amber-400', desc: 'Above the national minimum cutoff of 140-200. Eligible for many university degree programs.' };
    return { title: 'Needs Improvement', color: 'text-red-400', desc: 'Targeting higher marks is recommended. Practice weak topics and time management to boost your aggregate score.' };
  };

  const assessment = getGradeAssessment(result.totalScore);
  const totalCorrect = result.subjectResults.reduce((acc, s) => acc + s.correctCount, 0);
  const totalQuestions = result.questions.length;
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(result.timeUsedSeconds / totalQuestions) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            <span>JAMB UTME CBT Official Result Slip</span>
          </h2>
          <p className="text-xs text-slate-400">Computer Based Test Examination Performance Certificate</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take New Exam</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="rounded-3xl bg-slate-900 border-2 border-emerald-600/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden print:border-emerald-700 print:text-black print:bg-white">
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none text-9xl font-black font-mono">
          JAMB
        </div>

        {/* Certificate Header */}
        <div className="border-b-2 border-emerald-600/60 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <RilaLogo size="lg" variant="icon" />
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Joint Admissions and Matriculation Board (JAMB)
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Unified Tertiary Matriculation Examination (UTME)
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Examination Result & Diagnostic Performance Assessment Slip
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-3 text-center sm:text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Candidate Reg No</div>
                <div className="text-base font-mono font-bold text-emerald-400">{result.registrationNumber}</div>
                <div className="text-[11px] text-slate-400 mt-1">{result.examDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate & Score Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Candidate Info Box */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800/80">
              Candidate Information
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Full Name:</span>
                <p className="font-bold text-slate-100 text-sm">{result.candidateName}</p>
              </div>
              <div>
                <span className="text-slate-400">Exam Mode:</span>
                <p className="font-semibold text-emerald-400 uppercase font-mono">
                  {result.mode === 'full_mock' ? 'Official UTME Mock' : 'Practice Drill'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Time Spent:</span>
                <p className="font-mono text-slate-200">
                  {Math.floor(result.timeUsedSeconds / 60)}m {result.timeUsedSeconds % 60}s (Avg {avgTimePerQuestion}s/question)
                </p>
              </div>
              <div>
                <span className="text-slate-400">Overall Accuracy:</span>
                <p className="font-mono text-slate-200">
                  {totalCorrect} / {totalQuestions} ({Math.round((totalCorrect / totalQuestions) * 100)}%)
                </p>
              </div>
            </div>
          </div>

          {/* Big Aggregate Score Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-950 border-2 border-emerald-500/50 flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">UTME Aggregate Score</span>
            <div className="text-5xl font-mono font-black text-white tracking-tight my-1">
              {result.totalScore}
              <span className="text-xl font-normal text-slate-400 font-sans">/400</span>
            </div>
            <div className={`text-xs font-bold mt-1 ${assessment.color}`}>
              {assessment.title}
            </div>
          </div>
        </div>

        {/* Subject Score Breakdown Table */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Subject-by-Subject Score Breakdown
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5 text-center">Correct</th>
                  <th className="p-3.5 text-center">Wrong</th>
                  <th className="p-3.5 text-center">Unanswered</th>
                  <th className="p-3.5 text-center">Raw Score</th>
                  <th className="p-3.5 text-right">Scaled Score (/100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {result.subjectResults.map((sub) => (
                  <tr key={sub.subjectId} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5 font-sans font-semibold text-slate-200">{sub.subjectName}</td>
                    <td className="p-3.5 text-center text-emerald-400 font-bold">{sub.correctCount}</td>
                    <td className="p-3.5 text-center text-red-400">{sub.wrongCount}</td>
                    <td className="p-3.5 text-center text-slate-400">{sub.unansweredCount}</td>
                    <td className="p-3.5 text-center text-slate-300">
                      {sub.score}/{sub.totalQuestions}
                    </td>
                    <td className="p-3.5 text-right font-black text-emerald-300 text-base">
                      {sub.scaledScore}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-emerald-950/40 border-t-2 border-emerald-600/50 font-bold">
                <tr>
                  <td className="p-3.5 text-slate-200">TOTAL AGGREGATE</td>
                  <td className="p-3.5 text-center text-emerald-400 font-mono">{totalCorrect}</td>
                  <td className="p-3.5 text-center text-red-400 font-mono">
                    {result.subjectResults.reduce((acc, s) => acc + s.wrongCount, 0)}
                  </td>
                  <td className="p-3.5 text-center text-slate-400 font-mono">
                    {result.subjectResults.reduce((acc, s) => acc + s.unansweredCount, 0)}
                  </td>
                  <td className="p-3.5 text-center font-mono">
                    {totalCorrect}/{totalQuestions}
                  </td>
                  <td className="p-3.5 text-right text-emerald-400 font-mono text-lg font-black">
                    {result.totalScore} / 400
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Assessment Commentary */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 text-xs text-slate-300 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-100">Performance Assessment: </span>
            {assessment.desc}
          </div>
        </div>

        {/* University Cutoff Eligibility Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div
            onClick={() => setShowCutoffs(!showCutoffs)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                Nigerian University Admission Cutoff Eligibility Matcher ({eligibleInstitutions.length} Institutions)
              </h4>
            </div>
            <button className="text-slate-400 hover:text-white">
              {showCutoffs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showCutoffs && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-400">
                Based on your score of <strong className="text-emerald-400">{result.totalScore}</strong>, here is how you rank against real Nigerian university general and competitive course cutoffs:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {UNIVERSITY_CUTOFFS.map((uni) => {
                  const meetsGeneral = result.totalScore >= uni.generalCutoff;
                  return (
                    <div
                      key={uni.university}
                      className={`p-3 rounded-xl border text-xs ${
                        meetsGeneral
                          ? 'bg-slate-900/90 border-emerald-500/40'
                          : 'bg-slate-900/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-bold text-slate-100">{uni.university}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            meetsGeneral ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {meetsGeneral ? 'Eligible' : 'Below Cutoff'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        General Cutoff: <span className="font-mono text-slate-200">{uni.generalCutoff}</span> • State: {uni.state}
                      </div>
                      <div className="mt-2 text-[10px] space-y-1">
                        {uni.competitiveCoursesCutoff.slice(0, 3).map((c) => {
                          const meetsCourse = result.totalScore >= c.meritCutoff;
                          return (
                            <div key={c.course} className="flex justify-between items-center text-slate-300">
                              <span className="truncate max-w-[140px]">{c.course}:</span>
                              <span className={`font-mono ${meetsCourse ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                                {c.meritCutoff} {meetsCourse ? '✓' : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Certificate Footer / Endorsement */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Official Unified Tertiary Matriculation Examination Candidate Diagnostic Report • </span>
          <span className="font-semibold text-slate-300">
            Powered by: ©{' '}
            <a
              href="https://rilasolutions.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-bold transition-colors"
            >
              Rila Solutions
            </a>
          </span>
        </div>
      </div>

      {/* Review Questions Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Step-by-Step Question Review</h4>
          <p className="text-xs text-slate-400">
            Review answers, detailed solutions, and explanations • Powered by: ©{' '}
            <a
              href="https://rilasolutions.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-semibold transition-colors"
            >
              Rila Solutions
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onReviewQuestions('wrong')}
            className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold transition"
          >
            Review Corrections ({result.subjectResults.reduce((acc, s) => acc + s.wrongCount, 0)} Incorrect)
          </button>
          <button
            onClick={() => onReviewQuestions('all')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Review All Questions ({totalQuestions})
          </button>
        </div>
      </div>
    </div>
  );
};
