
import React from 'react';
import { AIAnalysisResponse, InjusticeType } from '../types';

interface AnalysisViewProps {
  analysis: AIAnalysisResponse;
  onSave: () => void;
  onCancel: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onSave, onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 animate-fade-in space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Review & Redaction</h1>
          <p className="text-slate-600">AI has processed your entry for privacy and legal context.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Discard</button>
          <button onClick={onSave} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md">Confirm & Store</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Classification & Redaction */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detected Indicators</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.classifications.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  {c}
                </span>
              ))}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Urgency: {analysis.urgency}
              </span>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Redacted Preview</h2>
            <div className="p-4 bg-slate-50 rounded-xl font-mono text-sm text-slate-700 border border-slate-200 leading-relaxed">
              {analysis.redactedText}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              Names and locations have been replaced with generic placeholders to protect identities during potential future exports.
            </p>
          </section>
        </div>

        {/* Right Column: Legal Context */}
        <div className="space-y-6">
          <section className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Kenyan Legal Context</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-emerald-400 font-bold mb-2">What the Law Generally Says</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{analysis.legalGuidance.whatTheLawSays}</p>
              </div>
              
              <div>
                <h3 className="text-emerald-400 font-bold mb-2">Why It Matters</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{analysis.legalGuidance.whyItMatters}</p>
              </div>

              <div>
                <h3 className="text-emerald-400 font-bold mb-2">Recommended Next Steps</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{analysis.legalGuidance.nextSteps}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 text-[10px] text-slate-500 text-center italic">
              Disclaimer: This information is for educational purposes and does not constitute legal advice. JusticeAI is not a legal representative.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
