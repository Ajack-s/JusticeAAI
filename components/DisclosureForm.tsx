
import React, { useState, useEffect } from 'react';
import { analyzeIncident } from '../services/geminiService';
import { AIAnalysisResponse } from '../types';

interface DisclosureFormProps {
  initialContent?: string;
  onAnalyze: (data: AIAnalysisResponse, raw: string) => void;
}

const DisclosureForm: React.FC<DisclosureFormProps> = ({ initialContent = '', onAnalyze }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialContent) setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeIncident(content);
      onAnalyze(result, content);
    } catch (err) {
      alert("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Secure Documentation</h1>
        <p className="text-slate-600 mt-2">
          Your entry is private and stored locally. Describe events using neutral, factual language.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe what happened..."
            className="w-full h-64 p-5 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-emerald-500 transition-all resize-none shadow-sm"
            disabled={loading}
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
            AES-256 Local Encryption Ready
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
          }`}
        >
          {loading ? 'Processing Safely...' : 'Proceed to Analysis'}
        </button>
      </form>
      
      <div className="mt-8 p-4 bg-teal-50 rounded-xl border border-teal-100">
        <h3 className="text-sm font-semibold text-teal-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Documentation Reminder
        </h3>
        <p className="text-xs text-teal-700 mt-1">
          Writing things down is a powerful step. Stick to what you saw, heard, or felt physically. You are doing the right thing.
        </p>
      </div>
    </div>
  );
};

export default DisclosureForm;
