
import React from 'react';
import { IncidentEntry } from '../types';

interface VaultViewProps {
  entries: IncidentEntry[];
  onDelete: (id: string) => void;
}

const VaultView: React.FC<VaultViewProps> = ({ entries, onDelete }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Local Evidence Vault</h1>
        <p className="text-slate-600 mt-2">All data below is stored locally on this device using AES-256 encryption emulation.</p>
      </header>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-slate-300 mb-4 flex justify-center">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <p className="text-slate-500 font-medium">Your vault is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.classifications.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-[10px] font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(entry.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <p className="text-slate-700 text-sm line-clamp-3">
                {entry.redactedContent}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                <button className="text-emerald-600 text-xs font-bold hover:underline">View Full Analysis & Export</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultView;
