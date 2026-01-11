
import React, { useState } from 'react';
import { UserSettings, Language, Page } from '../types';
import { speakText, stopCurrentSpeech } from '../services/ttsService';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  onNavigate: (p: Page) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onNavigate }) => {
  const [testing, setTesting] = useState<string | null>(null);

  const voices: {id: UserSettings['voiceName'], icon: string, personality: string, desc: string, trait: string, color: string}[] = [
    { id: 'Zephyr', icon: '🌬️', personality: 'Analytical', desc: 'The golden standard. Official, balanced, and perfectly clear for statutes.', trait: 'Objective', color: 'bg-blue-500' },
    { id: 'Aoide', icon: '🎶', personality: 'Melodic', desc: 'Rhythmic delivery designed for digesting long-form legal roadmaps.', trait: 'Flowing', color: 'bg-indigo-500' },
    { id: 'Puck', icon: '⚡', personality: 'High Definition', desc: 'Rapid efficiency and sharp precision for quick consultation summaries.', trait: 'Efficient', color: 'bg-amber-500' },
    { id: 'Charon', icon: '🏛️', personality: 'Resonant', desc: 'Deep solemnity and formal gravity suitable for official proceedings.', trait: 'Formal', color: 'bg-slate-700' },
    { id: 'Eos', icon: '🌅', personality: 'Empowering', desc: 'Bright, inspiring confidence for educating citizens on their rights.', trait: 'Advocacy', color: 'bg-orange-500' },
    { id: 'Kore', icon: '🌸', personality: 'Empathetic', desc: 'Gentle, patient care designed for sensitive legal inquiries.', trait: 'Patient', color: 'bg-pink-500' },
    { id: 'Fenrir', icon: '🌑', personality: 'Focused', desc: 'Direct, brief, and minimalist output profile with minimal inflection.', trait: 'Concise', color: 'bg-gray-900' },
  ];

  const handleAudition = async (id: UserSettings['voiceName']) => {
    if (testing === id) { stopCurrentSpeech(); setTesting(null); return; }
    setTesting(id);
    const sample = `Neural Core ${id} online. Synthesis link calibrated. Ready for statutory audit.`;
    await speakText(sample, id, settings.speechRate, () => setTesting(null));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-20 animate-slide-up pb-32">
      <header className="border-b-2 border-slate-100 dark:border-white/5 pb-10 space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-500/10 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-brand-500/20 shadow-sm">
          Protocol Configuration
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight dark:text-white uppercase leading-none">Interface <span className="text-brand-600 italic">Settings.</span></h1>
        <p className="text-base md:text-xl font-bold text-slate-500 max-w-2xl leading-relaxed">Customize your auditory and semantic experience within the NagrikAi statutory framework.</p>
      </header>

      {/* Identity Profile */}
      <section className="p-10 md:p-14 glass rounded-[4rem] border-2 border-slate-100 dark:border-white/5 space-y-12 shadow-premium relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-brand-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-600/10 transition-colors duration-1000"></div>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-xl">👤</div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Citizen Identity</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personalize Consultation Meta-data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-3">Node Display Name</label>
            <input 
              type="text" value={settings.userName}
              onChange={(e) => onUpdateSettings({...settings, userName: e.target.value})}
              className="w-full h-16 bg-white dark:bg-slate-900/50 rounded-[2rem] px-10 text-base font-black outline-none border-2 border-slate-50 dark:border-white/5 focus:border-brand-600/50 transition-all dark:text-white shadow-inner"
              placeholder="Enter Identity..."
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-3">Primary Language Vector</label>
            <div className="relative">
              <select 
                value={settings.preferredLanguage}
                onChange={(e) => onUpdateSettings({...settings, preferredLanguage: e.target.value as Language})}
                className="w-full h-16 bg-white dark:bg-slate-900/50 rounded-[2rem] px-10 text-base font-black outline-none border-2 border-slate-50 dark:border-white/5 focus:border-brand-600/50 appearance-none transition-all dark:text-white shadow-inner cursor-pointer"
              >
                {Object.values(Language).map(l => <option key={l} value={l} className="bg-white dark:bg-slate-900 font-bold">{l}</option>)}
              </select>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 font-black text-sm">▼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Speech Dynamics - Enhanced */}
      <section className="p-10 md:p-14 glass rounded-[4rem] border-2 border-slate-100 dark:border-white/5 space-y-12 shadow-premium bg-white/40 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-500/5 pointer-events-none"></div>
         <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-shrink-0">
               <div className="w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl">⏲️</div>
            </div>
            <div className="flex-grow w-full space-y-8">
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Speech Dynamics</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjust Auditory Playback Velocity</p>
               </div>
               
               <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
                  <div className="flex justify-between items-end mb-6">
                     <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-px bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">0.5x</span>
                     </div>
                     <div className="flex flex-col items-center">
                         <span className="text-4xl font-black text-brand-600 dark:text-brand-400 tabular-nums">{settings.speechRate.toFixed(1)}x</span>
                         <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Current Velocity</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-px bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">2.0x</span>
                     </div>
                  </div>
                  
                  <input 
                     type="range" min="0.5" max="2.0" step="0.1" 
                     value={settings.speechRate}
                     onChange={(e) => onUpdateSettings({...settings, speechRate: parseFloat(e.target.value)})}
                     className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600 hover:accent-brand-500 transition-all"
                  />
                  
                  <div className="flex justify-between mt-4 px-1">
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Slow & Precise</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Normal</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Rapid Summary</span>
                  </div>
               </div>
               
               <p className="text-sm text-slate-500 font-bold italic border-l-4 border-brand-500 pl-4">
                  "Lower rates (0.8x - 1.0x) are recommended for complex statutory analysis; higher rates for quick consultation summaries."
               </p>
            </div>
         </div>
      </section>

      {/* Voice Selection Matrix - Enhanced */}
      <section className="space-y-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-voice">🎙️</div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Neural Voice Matrix</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Auditory Delivery Profile</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800/30">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse shadow-glow"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">
              {voices.find(v => v.id === settings.voiceName)?.personality} Engine Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {voices.map(v => (
            <div 
              key={v.id} 
              className={`group p-8 rounded-[3rem] border-2 transition-all duration-500 flex flex-col justify-between min-h-[24rem] relative overflow-hidden cursor-pointer ${
                settings.voiceName === v.id 
                  ? 'border-brand-600 bg-brand-600/5 shadow-2xl scale-[1.02] ring-4 ring-brand-500/10' 
                  : 'border-slate-50 dark:border-white/5 bg-white dark:bg-slate-900/40 hover:border-brand-500/30 hover:shadow-xl hover:-translate-y-1'
              }`}
              onClick={() => onUpdateSettings({...settings, voiceName: v.id})}
            >
              {/* Selected Badge */}
              {settings.voiceName === v.id && (
                 <div className="absolute top-0 right-0 bg-brand-600 text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-2xl shadow-lg">
                    Selected
                 </div>
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 ${v.color} text-white rounded-[1.5rem] flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-6 duration-500`}>
                    {v.icon}
                  </div>
                </div>
                
                <h4 className="text-3xl font-black dark:text-white mb-2 uppercase tracking-tighter leading-none">{v.id}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                   <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                     {v.personality}
                   </span>
                   <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                     {v.trait}
                   </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{v.desc}</p>
              </div>

              <div className="flex gap-3 mt-8 relative z-10">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onUpdateSettings({...settings, voiceName: v.id}); }}
                  className={`flex-grow h-12 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md ${
                    settings.voiceName === v.id 
                      ? 'bg-brand-600 text-white shadow-brand-500/30' 
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {settings.voiceName === v.id ? 'Active' : 'Activate'}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAudition(v.id); }} 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                    testing === v.id 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg animate-pulse' 
                      : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 hover:text-brand-600 hover:border-brand-200'
                  }`}
                  title="Audition Persona"
                >
                  {testing === v.id ? '⏹' : '▶'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => onNavigate('chat')} 
          className="group px-16 h-20 bg-brand-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-6"
        >
          Finalize Link Calibration
          <span className="text-2xl group-hover:translate-x-3 transition-transform duration-500">→</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
