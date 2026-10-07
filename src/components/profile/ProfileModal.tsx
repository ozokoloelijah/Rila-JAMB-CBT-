import React, { useState } from 'react';
import { X, User, Target, School, BookOpen, Check, Settings } from 'lucide-react';
import { CandidateProfile, SubjectId } from '../../types';
import { SUBJECTS, POPULAR_COMBINATIONS } from '../../data/subjects';
import { UNIVERSITY_CUTOFFS } from '../../data/cutoffs';
import { storage, AppSettings } from '../../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: CandidateProfile;
  currentSettings: AppSettings;
  onSave: (profile: CandidateProfile, settings: AppSettings) => void;
}

export const ProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentProfile,
  currentSettings,
  onSave,
}) => {
  const [profile, setProfile] = useState<CandidateProfile>(currentProfile);
  const [settings, setSettings] = useState<AppSettings>(currentSettings);

  if (!isOpen) return null;

  const handleElectiveToggle = (subId: SubjectId) => {
    if (subId === 'english') return; // English is compulsory
    const electives = profile.subjectCombination.filter((s) => s !== 'english');

    if (electives.includes(subId)) {
      // Remove
      setProfile({
        ...profile,
        subjectCombination: ['english', ...electives.filter((s) => s !== subId)] as any,
      });
    } else {
      // Add if under 4 total
      if (profile.subjectCombination.length < 4) {
        setProfile({
          ...profile,
          subjectCombination: [...profile.subjectCombination, subId] as any,
        });
      }
    }
  };

  const handleSelectPopularCombo = (subs: readonly SubjectId[]) => {
    setProfile({
      ...profile,
      subjectCombination: [subs[0], subs[1], subs[2], subs[3]],
    });
  };

  const handleSave = () => {
    storage.saveProfile(profile);
    storage.saveSettings(settings);
    onSave(profile, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Candidate Profile & Target Goals</h3>
              <p className="text-xs text-slate-400">Personalize your UTME subject combination & cutoff target</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-xs sm:text-sm">
          {/* Name & Reg Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-100 text-xs sm:text-sm font-medium"
                placeholder="e.g. Emmanuel Chukwuma"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">JAMB Registration Number</label>
              <input
                type="text"
                value={profile.registrationNumber}
                onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-100 font-mono text-xs sm:text-sm"
                placeholder="202640829104A"
              />
            </div>
          </div>

          {/* Target Score & Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target UTME Score (Max 400)</label>
              <input
                type="number"
                min="100"
                max="400"
                value={profile.targetScore}
                onChange={(e) => setProfile({ ...profile, targetScore: parseInt(e.target.value) || 280 })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-emerald-400 font-mono font-bold text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Institution</label>
              <select
                value={profile.preferredInstitution}
                onChange={(e) => setProfile({ ...profile, preferredInstitution: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
              >
                {UNIVERSITY_CUTOFFS.map((uni) => (
                  <option key={uni.university} value={uni.university}>
                    {uni.university}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Course */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Course of Study</label>
            <input
              type="text"
              value={profile.preferredCourse}
              onChange={(e) => setProfile({ ...profile, preferredCourse: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
              placeholder="e.g. Medicine & Surgery, Law, Computer Science"
            />
          </div>

          {/* Subject Combination Setup (1 Compulsory English + 3 Electives) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-200">
                Your 4-Subject Combination ({profile.subjectCombination.length}/4 selected)
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">Use of English is Compulsory</span>
            </div>

            {/* Quick Popular Combinations */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
              {POPULAR_COMBINATIONS.map((combo) => (
                <button
                  key={combo.title}
                  type="button"
                  onClick={() => handleSelectPopularCombo(combo.subjects)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium whitespace-nowrap transition"
                >
                  {combo.faculty}
                </button>
              ))}
            </div>

            {/* Electives Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUBJECTS.map((sub) => {
                const isSelected = profile.subjectCombination.includes(sub.id);
                const isCompulsory = sub.id === 'english';

                return (
                  <button
                    key={sub.id}
                    type="button"
                    disabled={isCompulsory}
                    onClick={() => handleElectiveToggle(sub.id)}
                    className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Settings className="w-4 h-4" />
              <span>Offline App Settings</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 text-xs">JAMB 8-Key Keyboard Navigation</span>
                <p className="text-[11px] text-slate-400">Enable A, B, C, D, P, N, S, R shortcuts by default</p>
              </div>
              <input
                type="checkbox"
                checked={settings.eightKeyModeEnabled}
                onChange={(e) => setSettings({ ...settings, eightKeyModeEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 text-xs">Offline Audio Alerts & Timer Warning Bells</span>
                <p className="text-[11px] text-slate-400">Synthesized audio cues using browser Web Audio API</p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition"
          >
            Save Profile & Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
