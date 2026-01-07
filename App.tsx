
import React, { useState, useEffect } from 'react';
import { AppState, IncidentEntry, AIAnalysisResponse } from './types';
import CalculatorCloak from './components/CalculatorCloak';
import DisclosureForm from './components/DisclosureForm';
import AnalysisView from './components/AnalysisView';
import VaultView from './components/VaultView';
import PanicButton from './components/PanicButton';
import AICompanion from './components/AICompanion';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('cloak');
  const [entries, setEntries] = useState<IncidentEntry[]>([]);
  const [currentDraft, setCurrentDraft] = useState<{ analysis: AIAnalysisResponse; raw: string } | null>(null);
  const [prefilledRaw, setPrefilledRaw] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('justice_vault');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load vault");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('justice_vault', JSON.stringify(entries));
  }, [entries]);

  const handlePanic = () => {
    setView('cloak');
    setCurrentDraft(null);
    setPrefilledRaw('');
  };

  const handleAnalysisComplete = (analysis: AIAnalysisResponse, raw: string) => {
    setCurrentDraft({ analysis, raw });
    setView('redaction');
  };

  const handleProceedFromListening = (summary: string) => {
    setPrefilledRaw(summary);
    setView('disclosure');
  };

  const handleSaveEntry = () => {
    if (!currentDraft) return;
    
    const newEntry: IncidentEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      rawContent: currentDraft.raw,
      redactedContent: currentDraft.analysis.redactedText,
      classifications: currentDraft.analysis.classifications,
      urgency: currentDraft.analysis.urgency,
      legalContext: currentDraft.analysis.legalGuidance.whatTheLawSays,
      placeholders: currentDraft.analysis.placeholders,
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentDraft(null);
    setPrefilledRaw('');
    setView('vault');
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Permanently delete this entry from your device?")) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  if (view === 'cloak') {
    return <CalculatorCloak onUnlock={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">J</div>
            <span className="font-bold text-slate-800 tracking-tight">JusticeAI</span>
          </div>
          <div className="flex space-x-6 text-sm font-medium text-slate-500">
            <button onClick={() => setView('listening')} className={`hover:text-emerald-600 ${view === 'listening' ? 'text-emerald-600' : ''}`}>Support</button>
            <button onClick={() => setView('disclosure')} className={`hover:text-emerald-600 ${view === 'disclosure' ? 'text-emerald-600' : ''}`}>Document</button>
            <button onClick={() => setView('vault')} className={`hover:text-emerald-600 ${view === 'vault' ? 'text-emerald-600' : ''}`}>Vault ({entries.length})</button>
            <button onClick={() => setView('cloak')} className="hover:text-slate-800 transition-colors">Lock</button>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {view === 'dashboard' && (
          <div className="max-w-2xl mx-auto px-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">You are safe here.</h1>
              <p className="text-slate-500 leading-relaxed mb-8">
                How would you like to start today? You can talk to a supportive companion or go straight to documentation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setView('listening')}
                  className="flex flex-col items-start p-6 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:border-teal-500 transition-all group"
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <span className="font-bold text-teal-800 text-lg">Talk it Through</span>
                  <p className="text-xs text-teal-600 mt-1">A soft touch for when you just need to be heard.</p>
                </button>

                <button 
                  onClick={() => setView('disclosure')}
                  className="flex flex-col items-start p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <span className="font-bold text-emerald-800 text-lg">Document Entry</span>
                  <p className="text-xs text-emerald-600 mt-1">Directly record facts for your private local vault.</p>
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Quick Legal Tips (Kenya)</h2>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-3 shrink-0"></span>Document incidents as soon as possible.</li>
                <li className="flex items-start"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-3 shrink-0"></span>Use observable facts.</li>
              </ul>
            </div>
          </div>
        )}

        {view === 'listening' && (
          <AICompanion 
            onProceed={handleProceedFromListening} 
            onExit={() => setView('dashboard')} 
          />
        )}

        {view === 'disclosure' && (
          <DisclosureForm initialContent={prefilledRaw} onAnalyze={handleAnalysisComplete} />
        )}

        {view === 'redaction' && currentDraft && (
          <AnalysisView analysis={currentDraft.analysis} onSave={handleSaveEntry} onCancel={() => setView('disclosure')} />
        )}

        {view === 'vault' && (
          <VaultView entries={entries} onDelete={handleDeleteEntry} />
        )}
      </main>

      <PanicButton onPanic={handlePanic} />
    </div>
  );
};

export default App;
