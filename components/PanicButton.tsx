
import React from 'react';

interface PanicButtonProps {
  onPanic: () => void;
}

const PanicButton: React.FC<PanicButtonProps> = ({ onPanic }) => {
  return (
    <button
      onClick={onPanic}
      className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 transition-all active:scale-95 z-50 border-4 border-white"
      title="Instant Exit"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  );
};

export default PanicButton;
