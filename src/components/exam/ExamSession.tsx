import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExamConfig, CandidateProfile, ExamResult, Question, SubjectId, SubjectResult } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { generateExamQuestions } from '../../data/questions';
import { soundEffects } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ExamHeader } from './ExamHeader';
import { SubjectTabs } from './SubjectTabs';
import { QuestionView } from './QuestionView';
import { QuestionPalette } from './QuestionPalette';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { EightKeyHelpModal } from './EightKeyHelpModal';
import { JambCalculator } from '../calculator/JambCalculator';

interface Props {
  config: ExamConfig;
  profile: CandidateProfile;
  onFinishExam: (result: ExamResult) => void;
  onAbortExam: () => void;
}

export const ExamSession: React.FC<Props> = ({
  config,
  profile,
  onFinishExam,
  onAbortExam,
}) => {
  // Generate question pool for this exam session
  const [questions, setQuestions] = useState<Question[]>(() => {
    return generateExamQuestions(config.selectedSubjects, config.questionsPerSubject, {
      year: config.selectedYear,
      topic: config.selectedTopic,
      shuffle: config.shuffleQuestions,
    });
  });

  // Active state
  const [activeSubject, setActiveSubject] = useState<SubjectId>(config.selectedSubjects[0]);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [reviewMarks, setReviewMarks] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(storage.getBookmarks());

  // Timer state
  const totalDurationSeconds = config.durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalDurationSeconds);
  const timeUsedSecondsRef = useRef<number>(0);

  // Modals & Tools
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showKeyHelpModal, setShowKeyHelpModal] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(storage.getSettings().soundEnabled);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filter questions for currently active subject
  const currentSubjectQuestions = questions.filter((q) => q.subjectId === activeSubject);
  const currentQuestion = currentSubjectQuestions[activeSubjectIndex] || currentSubjectQuestions[0];

  // Sound effects initialization
  useEffect(() => {
    soundEffects.enabled = soundEnabled;
    soundEffects.playExamStart();
  }, [soundEnabled]);

  // Exam completion calculation
  const calculateFinalResults = useCallback(
    (forcedTimeUp: boolean = false): ExamResult => {
      const timeSpent = forcedTimeUp ? totalDurationSeconds : timeUsedSecondsRef.current;

      const subjectResults: SubjectResult[] = config.selectedSubjects.map((subId) => {
        const info = SUBJECTS.find((s) => s.id === subId);
        const subQuestions = questions.filter((q) => q.subjectId === subId);
        let correctCount = 0;
        let wrongCount = 0;
        let unansweredCount = 0;
        const topicBreakdown: Record<string, { correct: number; total: number }> = {};

        subQuestions.forEach((q) => {
          if (!topicBreakdown[q.topic]) {
            topicBreakdown[q.topic] = { correct: 0, total: 0 };
          }
          topicBreakdown[q.topic].total += 1;

          const userAns = answers[q.id];
          if (userAns === null || userAns === undefined) {
            unansweredCount += 1;
          } else if (userAns === q.correctAnswer) {
            correctCount += 1;
            topicBreakdown[q.topic].correct += 1;
          } else {
            wrongCount += 1;
          }
        });

        const rawScore = correctCount;
        const totalSubQuestions = subQuestions.length;
        const percentage = totalSubQuestions > 0 ? (correctCount / totalSubQuestions) * 100 : 0;
        // Standard UTME scale: each subject scaled to 100
        const scaledScore = totalSubQuestions > 0 ? Math.round((correctCount / totalSubQuestions) * 100) : 0;

        return {
          subjectId: subId,
          subjectName: info?.name || subId,
          score: rawScore,
          totalQuestions: totalSubQuestions,
          scaledScore,
          percentage: Math.round(percentage),
          correctCount,
          wrongCount,
          unansweredCount,
          timeSpentSeconds: Math.round(timeSpent / config.selectedSubjects.length),
          topicBreakdown,
        };
      });

      // Total aggregate score out of 400
      let totalAggregate = 0;
      if (config.mode === 'full_mock' && subjectResults.length === 4) {
        totalAggregate = subjectResults.reduce((acc, s) => acc + s.scaledScore, 0);
      } else {
        // Scaled to 400 for practice drills
        const avgPercentage =
          subjectResults.reduce((acc, s) => acc + s.percentage, 0) / subjectResults.length;
        totalAggregate = Math.round((avgPercentage / 100) * 400);
      }

      const totalCorrectAll = subjectResults.reduce((acc, s) => acc + s.correctCount, 0);
      const overallPercentage =
        questions.length > 0 ? Math.round((totalCorrectAll / questions.length) * 100) : 0;

      const finalResult: ExamResult = {
        id: `exam-${Date.now()}`,
        candidateName: profile.name,
        registrationNumber: profile.registrationNumber,
        examDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        mode: config.mode,
        totalScore: totalAggregate,
        maxScore: 400,
        percentage: overallPercentage,
        timeUsedSeconds: timeSpent,
        totalAllowedSeconds: totalDurationSeconds,
        subjectResults,
        answers,
        questions,
        passedThreshold: totalAggregate >= 200,
      };

      storage.saveResult(finalResult);
      return finalResult;
    },
    [config, questions, answers, totalDurationSeconds, profile]
  );

  // Timer countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        timeUsedSecondsRef.current += 1;

        // Warnings at exactly 30 mins (1800s) and 10 mins (600s)
        if (prev === 1800 || prev === 600 || prev === 300) {
          soundEffects.playWarningAlert();
        }

        if (prev <= 1) {
          clearInterval(timer);
          soundEffects.playTimeUp();
          const finalResult = calculateFinalResults(true);
          onFinishExam(finalResult);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateFinalResults, onFinishExam]);

  // Answer selection handler
  const handleSelectOption = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optKey,
    }));
  };

  const handleClearOption = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: null,
    }));
  };

  const handleToggleMarkReview = () => {
    if (!currentQuestion) return;
    setReviewMarks((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleToggleBookmark = () => {
    if (!currentQuestion) return;
    storage.toggleBookmark(currentQuestion.id);
    setBookmarkedIds(storage.getBookmarks());
  };

  const handleNext = () => {
    if (activeSubjectIndex < currentSubjectQuestions.length - 1) {
      setActiveSubjectIndex((prev) => prev + 1);
    } else {
      // Switch to next subject if at end of current subject questions
      const currentSubIdx = config.selectedSubjects.indexOf(activeSubject);
      if (currentSubIdx < config.selectedSubjects.length - 1) {
        const nextSub = config.selectedSubjects[currentSubIdx + 1];
        setActiveSubject(nextSub);
        setActiveSubjectIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    if (activeSubjectIndex > 0) {
      setActiveSubjectIndex((prev) => prev - 1);
    } else {
      // Switch to previous subject if at beginning
      const currentSubIdx = config.selectedSubjects.indexOf(activeSubject);
      if (currentSubIdx > 0) {
        const prevSub = config.selectedSubjects[currentSubIdx - 1];
        setActiveSubject(prevSub);
        const prevSubQuestions = questions.filter((q) => q.subjectId === prevSub);
        setActiveSubjectIndex(prevSubQuestions.length - 1);
      }
    }
  };

  const handleJumpToNextUnanswered = () => {
    const unansIdx = currentSubjectQuestions.findIndex(
      (q) => answers[q.id] === null || answers[q.id] === undefined
    );
    if (unansIdx !== -1) {
      setActiveSubjectIndex(unansIdx);
      return;
    }
    // Check other subjects
    for (const subId of config.selectedSubjects) {
      const subQs = questions.filter((q) => q.subjectId === subId);
      const subUnansIdx = subQs.findIndex((q) => answers[q.id] === null || answers[q.id] === undefined);
      if (subUnansIdx !== -1) {
        setActiveSubject(subId);
        setActiveSubjectIndex(subUnansIdx);
        break;
      }
    }
  };

  // Switch subject tab
  const handleSelectSubject = (subId: SubjectId) => {
    setActiveSubject(subId);
    setActiveSubjectIndex(0);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Confirm submit finalization
  const handleConfirmSubmit = () => {
    soundEffects.playSuccessFanfare();
    setShowSubmitModal(false);
    const finalResult = calculateFinalResults(false);
    onFinishExam(finalResult);
  };

  // 8-KEY KEYBOARD NAVIGATION LISTENER (A, B, C, D, P, N, S, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if active element is an input or modal is open
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = e.key.toUpperCase();

      if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        // If calculator is open, 'C' is clear on calculator so handle specially
        if (key === 'C' && showCalculator) {
          return;
        }
        // If 'C' key pressed without calculator, toggle calculator or select C based on key
        if (key === 'C' && e.altKey) {
          setShowCalculator((prev) => !prev);
          return;
        }

        e.preventDefault();
        handleSelectOption(key as 'A' | 'B' | 'C' | 'D');
        return;
      }

      if (key === 'P') {
        e.preventDefault();
        handlePrevious();
        return;
      }

      if (key === 'N') {
        e.preventDefault();
        handleNext();
        return;
      }

      if (key === 'R') {
        e.preventDefault();
        handleToggleMarkReview();
        return;
      }

      if (key === 'S') {
        e.preventDefault();
        setShowSubmitModal(true);
        return;
      }

      // Extras
      if (key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const currentSubIdx = config.selectedSubjects.indexOf(activeSubject);
        const nextSubIdx = (currentSubIdx + 1) % config.selectedSubjects.length;
        handleSelectSubject(config.selectedSubjects[nextSubIdx]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeSubject,
    activeSubjectIndex,
    currentQuestion,
    currentSubjectQuestions,
    config.selectedSubjects,
    showCalculator,
  ]);

  // Count answered questions by subject for tabs
  const answeredCountBySubject: Record<SubjectId, number> = {} as any;
  const totalCountBySubject: Record<SubjectId, number> = {} as any;
  config.selectedSubjects.forEach((subId) => {
    const subQs = questions.filter((q) => q.subjectId === subId);
    totalCountBySubject[subId] = subQs.length;
    answeredCountBySubject[subId] = subQs.filter(
      (q) => answers[q.id] !== null && answers[q.id] !== undefined
    ).length;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Exam Header Bar */}
        <ExamHeader
          profile={profile}
          remainingSeconds={remainingSeconds}
          totalDurationSeconds={totalDurationSeconds}
          onToggleCalculator={() => setShowCalculator((prev) => !prev)}
          onOpenKeyHelp={() => setShowKeyHelpModal(true)}
          onSubmitClick={() => setShowSubmitModal(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundEffects.enabled = next;
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Subject Switcher Tabs */}
        <SubjectTabs
          subjects={config.selectedSubjects}
          activeSubject={activeSubject}
          onSelectSubject={handleSelectSubject}
          answeredCountBySubject={answeredCountBySubject}
          totalCountBySubject={totalCountBySubject}
        />

        {/* Main Examination Workspace */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Active Question Viewer */}
            {currentQuestion ? (
              <QuestionView
                question={currentQuestion}
                questionNumber={activeSubjectIndex + 1}
                totalQuestions={currentSubjectQuestions.length}
                selectedOption={answers[currentQuestion.id] || null}
                onSelectOption={handleSelectOption}
                onClearOption={handleClearOption}
                isMarkedForReview={!!reviewMarks[currentQuestion.id]}
                onToggleMarkReview={handleToggleMarkReview}
                isBookmarked={bookmarkedIds.includes(currentQuestion.id)}
                onToggleBookmark={handleToggleBookmark}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={activeSubjectIndex > 0 || config.selectedSubjects.indexOf(activeSubject) > 0}
                hasNext={
                  activeSubjectIndex < currentSubjectQuestions.length - 1 ||
                  config.selectedSubjects.indexOf(activeSubject) < config.selectedSubjects.length - 1
                }
                instantFeedback={config.instantFeedback}
              />
            ) : (
              <div className="flex-1 p-8 text-center text-slate-400">Loading questions...</div>
            )}

            {/* Right: Question Navigation Palette Grid */}
            <QuestionPalette
              questions={currentSubjectQuestions}
              currentIndex={activeSubjectIndex}
              onSelectIndex={(idx) => setActiveSubjectIndex(idx)}
              answers={answers}
              reviewMarks={reviewMarks}
              onJumpToNextUnanswered={handleJumpToNextUnanswered}
            />
          </div>
        </div>

        {/* Exam Session Bottom Bar */}
        <div className="border-t border-slate-800 bg-slate-900/60 py-2.5 px-4 text-xs text-slate-400 no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official JAMB UTME Examination Session • 8-Key CBT Mode Active</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <span className="text-slate-400">Powered by: ©</span>
              <a
                href="https://rilasolutions.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 tracking-wide transition-colors"
              >
                Rila Solutions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* On-Screen JAMB CBT Floating Calculator */}
      <JambCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />

      {/* 8-Key Mode Help Guide */}
      <EightKeyHelpModal isOpen={showKeyHelpModal} onClose={() => setShowKeyHelpModal(false)} />

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleConfirmSubmit}
        subjects={config.selectedSubjects}
        questions={questions}
        answers={answers}
        reviewMarks={reviewMarks}
        remainingSeconds={remainingSeconds}
      />
    </div>
  );
};
