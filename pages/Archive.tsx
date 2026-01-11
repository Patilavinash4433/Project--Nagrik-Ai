
import React, { useState, useEffect } from 'react';
import { Page, SavedSession } from '../types';

interface ArchiveProps {
  onNavigate: (p: Page) => void;
}

const Archive: React.FC<ArchiveProps> = ({ onNavigate }) => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nagrikai_saved_sessions');
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  const deleteSession = (id: string) => {
    if (window.confirm("Purge archived sync?")) {
      const updated = sessions.filter(s => s.id !== id);
      setSessions(updated);
      localStorage.setItem('nagrikai_saved_sessions', JSON.stringify(updated));
    }
  };

  const loadSession = (session: SavedSession) => {
    localStorage.setItem('nagrikai_chat_history', JSON.stringify(session.messages));
    onNavigate('chat');
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4 space-y-20 animate-slide-up">
      <header className="text-center space-y-6">
        <h1 className="text-6xl font-black dark:text-white tracking-tighter uppercase">Statutory <span className="text-brand-600">Archives.</span></h1>
        <p className="text-lg font-medium text-slate-500 max-w-xl mx-auto italic">Immutable records of your previously executed statutory consultations.</p>
      </header>

      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sessions.map((session) => {
            const userMessages = session.messages.filter(m => m.role === 'user').slice(0, 4);
            const hasMedia = session.messages.some(m => !!m.imageUrl || !!m.videoUrl);
            
            return (
              <div key={session.id} className="reveal glass p-10 rounded-[3.5rem] border border-transparent hover-lift flex flex-col h-full bg-white/40 group">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-[9px] font-black uppercase text-brand-600 tracking-[0.3em] bg-brand-500/10 px-4 py-1.5 rounded-full border border-brand-500/20">
                    {new Date(session.timestamp).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                  {hasMedia && (
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 shadow-inner" title="Media Rich Sync">
                       🖼️
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black dark:text-white mb-6 line-clamp-1 tracking-tight uppercase leading-none">{session.name}</h3>
                
                <div className="flex-grow space-y-4 mb-10">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Consultation Snippets</p>
                  <div className="space-y-3">
                    {userMessages.map((m, idx) => (
                      <div key={idx} className="flex gap-3 items-start group/snippet">
                        <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-2 group-hover/snippet:scale-150 transition-transform"></div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed italic">"{m.content}"</p>
                      </div>
                    ))}
                    {session.messages.length > userMessages.length && (
                      <p className="text-[9px] font-black text-brand-600/50 mt-4 ml-5">+{session.messages.length - userMessages.length} statutory parts encrypted</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => loadSession(session)}
                    className="flex-grow h-14 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all shadow-premium active:scale-95"
                  >
                    Load Intelligence
                  </button>
                  <button 
                    onClick={() => deleteSession(session.id)}
                    className="w-14 h-14 flex items-center justify-center bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all border border-red-500/20 active:scale-90"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-40 text-center glass rounded-[4rem] border border-dashed border-slate-300 dark:border-white/10 group">
          <div className="text-8xl mb-8 opacity-10 group-hover:opacity-30 transition-opacity duration-700">📂</div>
          <p className="text-3xl font-black text-slate-400 uppercase tracking-tighter">Archive terminal empty.</p>
          <button onClick={() => onNavigate('chat')} className="mt-10 px-8 py-3 bg-brand-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-110 transition-transform shadow-glow">Initialize New Ask Consult →</button>
        </div>
      )}
    </div>
  );
};

export default Archive;
