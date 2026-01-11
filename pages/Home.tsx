
import React, { useRef, useState, useEffect } from 'react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const freedomRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeReveals, setActiveReveals] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setActiveReveals(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!freedomRef.current) return;
    const rect = freedomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-20 md:space-y-32 pb-24 pt-4 md:pt-12 px-4 max-w-6xl mx-auto overflow-x-hidden">
      
      {/* Hero Section */}
      <section className={`text-center flex flex-col items-center transition-all duration-1000 ${activeReveals ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 mb-6 md:mb-10 bg-white dark:bg-slate-900 border border-brand-100 dark:border-white/10 rounded-full text-brand-600 dark:text-brand-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-premium">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-glow"></span>
          Statutory Intelligence v4.0
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-950 dark:text-white mb-6 md:mb-8 leading-[1] md:leading-[0.95]">
          Indian Law, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 relative inline-block animate-gradient-x">
            Decoded.
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed font-medium px-4">
          The next generation of legal accessibility. We distill complex Indian statutes into precise, executable roadmaps for every citizen.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-xl px-4">
          <button 
            onClick={() => onNavigate('chat')}
            className="flex-grow h-14 md:h-16 bg-brand-600 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95 flex items-center justify-center gap-3 group"
          >
            Start Intelligence Sync 
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button 
            onClick={() => onNavigate('corruption')}
            className="flex-grow h-14 md:h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all text-slate-700 dark:text-slate-300 shadow-md group"
          >
            Exposure Hub <span className="group-hover:rotate-12 inline-block transition-transform ml-1">🚩</span>
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {[
          { icon: '💎', title: 'Multilingual', desc: 'Seamlessly consult in 10+ regional languages with zero semantic loss.' },
          { icon: '🎯', title: 'Action Maps', desc: 'Precise step-by-step statutory execution paths generated in real-time.' },
          { icon: '🛡️', title: 'Privacy First', desc: 'Bank-grade encryption for all legal queries with local-only storage.' }
        ].map((f, i) => (
          <div key={i} className="p-8 md:p-10 glass rounded-[2.5rem] md:rounded-[3rem] border border-transparent hover:border-brand-500/20 transition-all flex flex-col h-full bg-white/40 group">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-8 shadow-premium group-hover:rotate-6 transition-transform">{f.icon}</div>
            <h3 className="text-lg md:text-xl font-black mb-3 md:mb-4 text-slate-900 dark:text-white tracking-tight uppercase leading-none">{f.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-grow">{f.desc}</p>
            <div className="mt-6 md:mt-8 h-1 w-10 md:w-12 bg-brand-600/20 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </section>

      {/* Interactive Knowledge Section */}
      <section 
        ref={freedomRef}
        onMouseMove={handleMouseMove}
        className="relative py-16 md:py-28 px-6 md:px-8 rounded-[2.5rem] md:rounded-[4rem] bg-slate-950 text-white text-center overflow-hidden shadow-glow transition-all duration-500 cursor-default group/freedom"
      >
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-700 group-hover/freedom:opacity-60"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.4) 0%, transparent 60%)`,
          }}
        ></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-10 md:space-y-12">
          <div className="inline-block px-4 py-1.5 bg-brand-600/20 rounded-full text-brand-400 font-black text-[9px] uppercase tracking-[0.4em] border border-brand-500/20">
            Statutory Mandate 2025
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1] md:leading-[0.9] transition-transform duration-700 group-hover/freedom:scale-[1.02]">
            Knowledge of Law <br className="hidden md:block"/>
            <span className="text-brand-500 italic block mt-2 md:inline">is the Ultimate Freedom.</span>
          </h2>
          
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto px-4">
            In a complex legal architecture, literacy is your strongest shield. NagrikAi provides the cognitive tools to navigate the system with confidence.
          </p>
          
          <div className="pt-8 md:pt-12 grid grid-cols-3 gap-4 md:gap-12 border-t border-white/5">
             <div className="text-center group/stat">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 group-hover/stat:text-brand-500 transition-colors">1.4B+</div>
                <div className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-slate-500">Reach</div>
             </div>
             <div className="text-center group/stat">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 group-hover/stat:text-brand-500 transition-colors">24/7</div>
                <div className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-slate-500">Uptime</div>
             </div>
             <div className="text-center group/stat">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 group-hover/stat:text-brand-500 transition-colors">100%</div>
                <div className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-slate-500">Veracity</div>
             </div>
          </div>
          
          <button 
            onClick={() => onNavigate('guides')}
            className="mt-12 md:mt-16 px-10 md:px-12 h-14 md:h-16 bg-white text-slate-950 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-2xl active:scale-95"
          >
            Explore Action Registry
          </button>
        </div>
      </section>
      
      <div className="text-center opacity-20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] pb-12">
        NagrikAi Intelligence Registry • Secured Bharat Node
      </div>
    </div>
  );
};

export default Home;
