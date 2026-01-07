
import React, { useState, useEffect, useRef } from 'react';
import { createSupportiveChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AICompanionProps {
  onProceed: (summary: string) => void;
  onExit: () => void;
}

const AICompanion: React.FC<AICompanionProps> = ({ onProceed, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "I'm here. This is a quiet, safe space for you to speak your truth. Take your time." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createSupportiveChat();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        
        // Dynamic distress check (simple heuristic)
        if (fullText.toLowerCase().includes("breathe") || fullText.toLowerCase().includes("pause")) {
          setShowBreathing(true);
        }

        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = fullText;
          return newMsgs;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having a hard time connecting right now. But I am still here with you." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[85vh] animate-fade-in relative">
      <header className="mb-6 flex justify-between items-center px-2">
        <div>
          <h1 className="text-xl font-medium text-slate-700">Safe Space</h1>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Encrypted Listening Mode</span>
          </div>
        </div>
        <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 px-2 mb-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl leading-relaxed transition-all duration-500 ${
              m.role === 'user' 
                ? 'bg-slate-800 text-slate-100 rounded-tr-none shadow-lg' 
                : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex space-x-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {showBreathing && (
        <div className="flex justify-center mb-4 animate-fade-in">
           <button 
            onClick={() => setShowBreathing(false)}
            className="group flex items-center space-x-3 bg-teal-50 border border-teal-100 px-6 py-3 rounded-2xl text-teal-800 transition-all hover:bg-teal-100"
          >
            <div className="w-6 h-6 bg-teal-400 rounded-full animate-ping opacity-75"></div>
            <span className="text-sm font-medium">Click to breathe with me...</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-2 flex items-center transition-all focus-within:ring-2 focus-within:ring-teal-200">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak freely, there's no rush..."
          className="flex-1 p-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-300"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            !input.trim() || isTyping ? 'bg-slate-100 text-slate-300' : 'bg-teal-600 text-white shadow-lg active:scale-90'
          }`}
        >
          <svg className="w-5 h-5 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center space-y-3">
        <button 
          onClick={() => onProceed(messages.filter(m => m.role === 'user').map(m => m.text).join('\n'))}
          className="text-teal-700 text-xs font-bold bg-teal-50 px-8 py-3 rounded-full hover:bg-teal-100 transition-all border border-teal-200 flex items-center uppercase tracking-widest shadow-sm"
        >
          I feel ready to document these facts
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
        <p className="text-[10px] text-slate-400">Everything spoken here remains ephemeral until you choose to document.</p>
      </div>
    </div>
  );
};

export default AICompanion;
