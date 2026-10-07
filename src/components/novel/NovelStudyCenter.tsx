import React, { useState } from 'react';
import { BookOpen, User, ListOrdered, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { NOVEL_INFO } from '../../data/novelGuide';

interface Props {
  onStartNovelQuiz: () => void;
}

export const NovelStudyCenter: React.FC<Props> = ({ onStartNovelQuiz }) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'characters' | 'themes'>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  const currentChapterData = NOVEL_INFO.chapters.find((c) => c.chapter === selectedChapter) || NOVEL_INFO.chapters[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-600/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Compulsory JAMB UTME Literature Reading Text
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-2 mb-2">
            The Life Changer
          </h1>
          <p className="text-xs text-emerald-400 font-semibold mb-3">
            Author: {NOVEL_INFO.author} • Tested in Use of English
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            {NOVEL_INFO.overview}
          </p>

          <button
            onClick={onStartNovelQuiz}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice Novel Past Questions</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'chapters'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Chapter Summaries (1–9)</span>
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'characters'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Key Character Profiles</span>
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'themes'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Major Themes & Lessons</span>
        </button>
      </div>

      {/* Chapter Breakdown View */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chapter Selector Sidebar */}
          <div className="space-y-1.5 md:col-span-1 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            {NOVEL_INFO.chapters.map((chap) => (
              <button
                key={chap.chapter}
                onClick={() => setSelectedChapter(chap.chapter)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition flex items-center justify-between ${
                  selectedChapter === chap.chapter
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>Chapter {chap.chapter}</span>
                <span className="truncate max-w-[130px] font-normal opacity-80">{chap.title}</span>
              </button>
            ))}
          </div>

          {/* Active Chapter Details */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Chapter {currentChapterData.chapter}
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">{currentChapterData.title}</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Detailed Synopsis:</h4>
              <p>{currentChapterData.summary}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Exam Key Points & Trivia:
              </h4>
              <div className="space-y-2">
                {currentChapterData.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Characters View */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NOVEL_INFO.characters.map((char) => (
            <div
              key={char.name}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  {char.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{char.name}</h4>
                  <span className="text-[11px] text-emerald-400 font-medium">{char.role}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/60">
                {char.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Themes View */}
      {activeTab === 'themes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400">1. Moral Uprightness vs Peer Pressure</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Salma gets lured away from her conservative upbringing by university vanity, luxury cars, and materialism, ultimately demonstrating that moral compromises lead to disgrace and expulsion.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400">2. The Dangers of Examination Malpractice</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cheating in exams carries devastating consequences. Both Salma and Kolawole face the Examination Malpractice Committee (EMC) and forfeit their university degrees.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400">3. National Unity & Inter-Ethnic Harmony</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Room 37 (Queen Amina Hall) portrays peaceful coexistence among Nigeria's diverse cultures: Tomiwa (Yoruba), Ada (Middle Belt), Ngozi (Igbo), and Salma (Northern).
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400">4. Greed, Gambling and Fraud</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Doctor Kabir personifies the deceitful conman who exploits the desperation of students. His immediate loss of the bribe money at a gambling house illustrates that ill-gotten wealth is fleeting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
