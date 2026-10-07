import React from 'react';
import { X, Keyboard, CheckCircle, ArrowLeft, ArrowRight, Flag, Send, Calculator } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EightKeyHelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const keyMap = [
    { key: 'A', desc: 'Select Option A', icon: CheckCircle, color: 'border-emerald-500 text-emerald-400' },
    { key: 'B', desc: 'Select Option B', icon: CheckCircle, color: 'border-emerald-500 text-emerald-400' },
    { key: 'C', desc: 'Select Option C', icon: CheckCircle, color: 'border-emerald-500 text-emerald-400' },
    { key: 'D', desc: 'Select Option D', icon: CheckCircle, color: 'border-emerald-500 text-emerald-400' },
    { key: 'P', desc: 'Previous Question', icon: ArrowLeft, color: 'border-blue-500 text-blue-400' },
    { key: 'N', desc: 'Next Question', icon: ArrowRight, color: 'border-blue-500 text-blue-400' },
    { key: 'R', desc: 'Reverse / Mark for Review', icon: Flag, color: 'border-amber-500 text-amber-400' },
    { key: 'S', desc: 'Submit Examination', icon: Send, color: 'border-red-500 text-red-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">JAMB 8-Key CBT Navigation Mode</h3>
              <p className="text-xs text-slate-400">Official keyboard mode used in Nigerian JAMB test centres</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            In standard JAMB Computer Based Tests, candidates are not required to use a computer mouse. You can complete the entire examination using only these 8 keyboard keys:
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {keyMap.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <kbd
                  className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center font-mono font-black text-sm bg-slate-900 shadow-sm ${item.color}`}
                >
                  {item.key}
                </kbd>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 mb-2">Extra Desktop Shortcuts:</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                <kbd className="font-mono text-emerald-400">C</kbd> Toggle Calculator
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                <kbd className="font-mono text-emerald-400">Tab</kbd> Switch Subject Tab
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                <kbd className="font-mono text-emerald-400">F</kbd> Fullscreen Mode
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition shadow"
        >
          Close & Resume Exam
        </button>
      </div>
    </div>
  );
};
