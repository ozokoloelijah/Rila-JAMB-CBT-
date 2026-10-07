import React from 'react';
import { SubjectId } from '../../types';
import { SUBJECTS } from '../../data/subjects';

interface Props {
  subjects: SubjectId[];
  activeSubject: SubjectId;
  onSelectSubject: (subId: SubjectId) => void;
  answeredCountBySubject: Record<SubjectId, number>;
  totalCountBySubject: Record<SubjectId, number>;
}

export const SubjectTabs: React.FC<Props> = ({
  subjects,
  activeSubject,
  onSelectSubject,
  answeredCountBySubject,
  totalCountBySubject,
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 sticky top-[57px] z-30 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {subjects.map((subId) => {
          const info = SUBJECTS.find((s) => s.id === subId);
          if (!info) return null;
          const isActive = activeSubject === subId;
          const answered = answeredCountBySubject[subId] || 0;
          const total = totalCountBySubject[subId] || 0;
          const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

          return (
            <button
              key={subId}
              onClick={() => onSelectSubject(subId)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <span className="font-bold tracking-wide">{info.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-emerald-800/80 text-emerald-100' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {answered}/{total} ({pct}%)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
