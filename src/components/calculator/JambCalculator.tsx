import React, { useState } from 'react';
import { X, Delete, Minus, Plus, Divide, X as Multiply, CornerDownLeft } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const JambCalculator: React.FC<Props> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    soundEffects.playCalcClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    soundEffects.playCalcClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    soundEffects.playCalcClick();
    setDisplay('0');
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    soundEffects.playCalcClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleSquareRoot = () => {
    soundEffects.playCalcClick();
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Math.sqrt(val)));
      setWaitingForOperand(true);
    } else {
      setDisplay('Error');
    }
  };

  const handlePercent = () => {
    soundEffects.playCalcClick();
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const handleToggleSign = () => {
    soundEffects.playCalcClick();
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const handleOperation = (nextOp: string) => {
    soundEffects.playCalcClick();
    const inputValue = parseFloat(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operation) {
      const current = storedValue || 0;
      let newValue = current;
      if (operation === '+') newValue = current + inputValue;
      else if (operation === '-') newValue = current - inputValue;
      else if (operation === '*') newValue = current * inputValue;
      else if (operation === '/') newValue = inputValue !== 0 ? current / inputValue : 0;

      setStoredValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleEquals = () => {
    soundEffects.playCalcClick();
    const inputValue = parseFloat(display);

    if (storedValue !== null && operation) {
      const current = storedValue;
      let newValue = current;
      if (operation === '+') newValue = current + inputValue;
      else if (operation === '-') newValue = current - inputValue;
      else if (operation === '*') newValue = current * inputValue;
      else if (operation === '/') newValue = inputValue !== 0 ? current / inputValue : 0;

      setDisplay(String(newValue));
      setStoredValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl p-4 text-slate-100 select-none animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">JAMB CBT Calculator</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen */}
      <div className="bg-slate-950/80 rounded-xl p-3 mb-3 border border-slate-800/80 text-right">
        <div className="text-[10px] text-slate-400 h-4 truncate">
          {storedValue !== null ? `${storedValue} ${operation || ''}` : ''}
        </div>
        <div className="text-2xl font-mono font-bold tracking-tight text-emerald-300 truncate">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1.5 text-sm font-semibold">
        <button
          onClick={handleClear}
          className="p-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition active:scale-95"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition active:scale-95 flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={handleSquareRoot}
          className="p-2.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 transition active:scale-95 font-mono"
        >
          √
        </button>
        <button
          onClick={() => handleOperation('/')}
          className={`p-2.5 rounded-lg transition active:scale-95 ${
            operation === '/' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
          }`}
        >
          ÷
        </button>

        <button
          onClick={() => handleDigit('7')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          9
        </button>
        <button
          onClick={() => handleOperation('*')}
          className={`p-2.5 rounded-lg transition active:scale-95 ${
            operation === '*' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
          }`}
        >
          ×
        </button>

        <button
          onClick={() => handleDigit('4')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          6
        </button>
        <button
          onClick={() => handleOperation('-')}
          className={`p-2.5 rounded-lg transition active:scale-95 ${
            operation === '-' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
          }`}
        >
          -
        </button>

        <button
          onClick={() => handleDigit('1')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          3
        </button>
        <button
          onClick={() => handleOperation('+')}
          className={`p-2.5 rounded-lg transition active:scale-95 ${
            operation === '+' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
          }`}
        >
          +
        </button>

        <button
          onClick={handleToggleSign}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-300 hover:bg-slate-750 transition active:scale-95"
        >
          ±
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="p-2.5 rounded-lg bg-slate-800/90 text-slate-100 hover:bg-slate-750 transition active:scale-95"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="p-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition active:scale-95 shadow"
        >
          =
        </button>
      </div>
    </div>
  );
};
