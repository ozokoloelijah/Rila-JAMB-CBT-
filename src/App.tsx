import React, { useState, useEffect } from 'react';
import { CandidateProfile, ExamConfig, ExamResult, SubjectId } from './types';
import { storage, AppSettings } from './utils/storage';
import { soundEffects } from './utils/audio';
import { Navbar, ActiveView } from './components/navigation/Navbar';
import { HomeView } from './components/home/HomeView';
import { MockSetupScreen } from './components/exam/MockSetupScreen';
import { SubjectPracticeSetup } from './components/exam/SubjectPracticeSetup';
import { ExamSession } from './components/exam/ExamSession';
import { ResultSlip } from './components/results/ResultSlip';
import { QuestionReview } from './components/results/QuestionReview';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { NovelStudyCenter } from './components/novel/NovelStudyCenter';
import { ProfileModal } from './components/profile/ProfileModal';
import { EightKeyHelpModal } from './components/exam/EightKeyHelpModal';

export default function App() {
  const [profile, setProfile] = useState<CandidateProfile>(() => storage.getProfile());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [resultsHistory, setResultsHistory] = useState<ExamResult[]>(() => storage.getResults());

  // Navigation & View state
  const [view, setView] = useState<
    'home' | 'mock_setup' | 'subject_practice' | 'novel_study' | 'analytics' | 'in_exam' | 'result_slip' | 'question_review'
  >('home');

  const [currentExamConfig, setCurrentExamConfig] = useState<ExamConfig | null>(null);
  const [activeResult, setActiveResult] = useState<ExamResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct' | 'bookmarked'>('all');
  const [practiceSubjectId, setPracticeSubjectId] = useState<SubjectId>('english');

  // Modals
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showKeyHelpModal, setShowKeyHelpModal] = useState<boolean>(false);

  // Sync sound settings with audio engine
  useEffect(() => {
    soundEffects.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Launch exam from setup
  const handleLaunchExam = (config: ExamConfig) => {
    setCurrentExamConfig(config);
    setView('in_exam');
  };

  // Exam completed
  const handleFinishExam = (result: ExamResult) => {
    setActiveResult(result);
    setResultsHistory(storage.getResults());
    setView('result_slip');
  };

  const handleStartSubjectPractice = (subId?: SubjectId) => {
    if (subId) {
      setPracticeSubjectId(subId);
    }
    setView('subject_practice');
  };

  const handleStartNovelQuiz = () => {
    handleLaunchExam({
      mode: 'novel_study',
      selectedSubjects: ['english'],
      durationMinutes: 15,
      questionsPerSubject: { english: 10 } as any,
      selectedTopic: 'The Life Changer',
      instantFeedback: true,
      shuffleQuestions: true,
      strictTimer: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Hide Navbar during active exam session to prevent accidental abandonment */}
      {view !== 'in_exam' && (
        <Navbar
          activeView={
            view === 'result_slip' || view === 'question_review'
              ? 'analytics'
              : (view as ActiveView)
          }
          onNavigate={(targetView) => {
            if (targetView === 'subject_practice') {
              setPracticeSubjectId('english');
            }
            setView(targetView);
          }}
          profile={profile}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenKeyHelp={() => setShowKeyHelpModal(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {view === 'home' && (
          <HomeView
            profile={profile}
            onStartMock={() => setView('mock_setup')}
            onStartSubjectPractice={handleStartSubjectPractice}
            onOpenNovelStudy={() => setView('novel_study')}
            onOpenAnalytics={() => setView('analytics')}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenKeyHelp={() => setShowKeyHelpModal(true)}
          />
        )}

        {view === 'mock_setup' && (
          <MockSetupScreen
            profile={profile}
            onLaunchExam={handleLaunchExam}
            onBack={() => setView('home')}
          />
        )}

        {view === 'subject_practice' && (
          <SubjectPracticeSetup
            initialSubjectId={practiceSubjectId}
            onLaunchPractice={handleLaunchExam}
            onBack={() => setView('home')}
          />
        )}

        {view === 'novel_study' && (
          <NovelStudyCenter onStartNovelQuiz={handleStartNovelQuiz} />
        )}

        {view === 'analytics' && (
          <AnalyticsDashboard
            results={resultsHistory}
            onStartSubjectPractice={(subId) => handleStartSubjectPractice(subId)}
            onClearHistory={() => {
              storage.clearResults();
              setResultsHistory([]);
            }}
            onSelectResult={(res) => {
              setActiveResult(res);
              setView('result_slip');
            }}
          />
        )}

        {view === 'in_exam' && currentExamConfig && (
          <ExamSession
            config={currentExamConfig}
            profile={profile}
            onFinishExam={handleFinishExam}
            onAbortExam={() => setView('home')}
          />
        )}

        {view === 'result_slip' && activeResult && (
          <ResultSlip
            result={activeResult}
            onRetake={() => setView('mock_setup')}
            onReviewQuestions={(filter = 'all') => {
              setReviewFilter(filter);
              setView('question_review');
            }}
          />
        )}

        {view === 'question_review' && activeResult && (
          <QuestionReview
            result={activeResult}
            initialFilter={reviewFilter}
            onBackToResult={() => setView('result_slip')}
          />
        )}
      </main>

      {/* Footer on every page */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-400 no-print z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-300">
              JAMB CBT Practice Exam Engine • 100% Offline Pro
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">Windows, macOS & Linux Desktop Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Powered by: ©</span>
            <a
              href="https://rilasolutions.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 tracking-wide text-sm transition-colors"
            >
              Rila Solutions
            </a>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentProfile={profile}
        currentSettings={settings}
        onSave={(newProfile, newSettings) => {
          setProfile(newProfile);
          setSettings(newSettings);
        }}
      />

      <EightKeyHelpModal
        isOpen={showKeyHelpModal}
        onClose={() => setShowKeyHelpModal(false)}
      />
    </div>
  );
}
