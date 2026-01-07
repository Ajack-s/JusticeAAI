
import React, { useState } from 'react';
import { CLOAK_CODE } from '../constants';

interface CalculatorCloakProps {
  onUnlock: () => void;
}

const CalculatorCloak: React.FC<CalculatorCloakProps> = ({ onUnlock }) => {
  const [display, setDisplay] = useState('0');

  const handleInput = (val: string) => {
    setDisplay(prev => {
      const newVal = prev === '0' ? val : prev + val;
      if (newVal === CLOAK_CODE) {
        onUnlock();
        return '0';
      }
      return newVal.slice(-10); // Keep display small
    });
  };

  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '='];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-slate-900 w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="bg-slate-800 text-right text-4xl p-6 rounded-xl text-white font-mono mb-6 h-20 flex items-end justify-end overflow-hidden">
          {display}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => btn === 'C' ? setDisplay('0') : handleInput(btn)}
              className="h-16 bg-slate-700 text-white rounded-xl text-xl font-bold active:bg-slate-600 transition-colors shadow-sm"
            >
              {btn}
            </button>
          ))}
        </div>
        <div className="mt-6 text-slate-500 text-xs text-center uppercase tracking-widest font-medium">
          Standard Utility
        </div>
      </div>
    </div>
  );
};

export default CalculatorCloak;
