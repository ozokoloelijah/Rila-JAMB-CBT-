import { CandidateProfile, ExamResult, SubjectId } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'jamb_cbt_candidate_profile',
  RESULTS: 'jamb_cbt_exam_results',
  BOOKMARKS: 'jamb_cbt_bookmarked_questions',
  SETTINGS: 'jamb_cbt_app_settings',
};

export interface AppSettings {
  eightKeyModeEnabled: boolean;
  soundEnabled: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  autoAdvanceOnSelect: boolean;
  highContrast: boolean;
}

export const DEFAULT_PROFILE: CandidateProfile = {
  name: 'Candidate 2026',
  registrationNumber: '202640829104A',
  preferredInstitution: 'University of Lagos (UNILAG)',
  preferredCourse: 'Medicine & Surgery',
  targetScore: 290,
  subjectCombination: ['english', 'biology', 'chemistry', 'physics'],
};

export const DEFAULT_SETTINGS: AppSettings = {
  eightKeyModeEnabled: true,
  soundEnabled: true,
  fontSize: 'normal',
  autoAdvanceOnSelect: false,
  highContrast: false,
};

export const storage = {
  getProfile(): CandidateProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: CandidateProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // safe ignore
    }
  },

  getResults(): ExamResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveResult(result: ExamResult): void {
    try {
      const existing = this.getResults();
      const updated = [result, ...existing];
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated.slice(0, 50))); // Keep last 50
    } catch {
      // safe ignore
    }
  },

  clearResults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
    } catch {
      // safe ignore
    }
  },

  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(questionId: string): boolean {
    try {
      const existing = this.getBookmarks();
      let updated: string[];
      let isBookmarked: boolean;
      if (existing.includes(questionId)) {
        updated = existing.filter((id) => id !== questionId);
        isBookmarked = false;
      } else {
        updated = [...existing, questionId];
        isBookmarked = true;
      }
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      return isBookmarked;
    } catch {
      return false;
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // safe ignore
    }
  },

  exportAllData(): string {
    const data = {
      profile: this.getProfile(),
      results: this.getResults(),
      bookmarks: this.getBookmarks(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      app: 'JAMB CBT Practice Exam Engine - Offline Pro',
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (Array.isArray(parsed.results)) {
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(parsed.results));
      }
      if (Array.isArray(parsed.bookmarks)) {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(parsed.bookmarks));
      }
      if (parsed.settings) this.saveSettings(parsed.settings);
      return true;
    } catch {
      return false;
    }
  },
};
