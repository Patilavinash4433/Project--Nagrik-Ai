
import React, { useState } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onToggleDark: () => void;
  isDarkMode: boolean;
  onOpenKeyPicker?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  onToggleDark, 
  isDarkMode,
  onOpenKeyPicker
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: '🏠' },
    { id: 'chat', label: 'Consult', icon: '🎙️' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'categories', label: 'Laws', icon: '📚' },
    { id: 'directory', label: 'Directory', icon: '📞' },
  ];

  return (
    <nav className="sticky top-0 md:top-4 z-[100] px-0 md:px-6 mb-4 md:mb-8 max-w-6xl mx-auto w-full" aria-label="Main Navigation">
      <div className="glass rounded-none md:rounded-2xl px-4 md:px-6 py-3 flex justify-between items-center shadow-lg bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b md:border-b-0 border-slate-200 dark:border-white/10">
        
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0" 
          onClick={() => onNavigate('home')}
        >
          {/* Dynamic 3D Holographic Logo */}
          <div className="relative w-12 h-12 flex items-center justify-center [perspective:1000px] group-hover:scale-110 transition-transform duration-500">
             <div className="relative w-10 h-10 [transform-style:preserve-3d] animate-[float_6s_ease-in-out_infinite]">
                {/* Core Sphere */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-700 rounded-full opacity-20 animate-pulse"></div>
                
                {/* Rotating Ring */}
                <div className="absolute inset-0 border-2 border-brand-500 rounded-full [transform:rotateX(70deg)] animate-[spin_4s_linear_infinite]"></div>
                
                {/* 3D Pillar / Scales Abstract */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand-600 dark:text-white drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] [transform:translateZ(10px)]" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                   {/* Central Pillar */}
                   <path d="M50 20v60 M40 80h20 M35 85h30" className="text-slate-800 dark:text-white" />
                   {/* Scales Arms */}
                   <path d="M25 35h50" className="text-brand-500" />
                   {/* Scale Plates (Animated) */}
                   <path d="M25 35v15a5 5 0 0 0 10 0V35" className="animate-[wave_3s_ease-in-out_infinite]" />
                   <path d="M75 35v15a5 5 0 0 1-10 0V35" className="animate-[wave_3s_ease-in-out_infinite_reverse]" />
                </svg>
             </div>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter dark:text-white leading-none drop-shadow-sm">
              Nagrik<span className="text-brand-600 inline-block animate-[pulse-slow_4s_ease-in-out_infinite]">Ai</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 leading-none mt-1">
              Know Your Rights
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={`text-xs font-bold py-2 px-3 rounded-xl transition-all uppercase tracking-wide ${
                currentPage === item.id 
                  ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' 
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          <button 
            onClick={() => onNavigate('corruption')}
            className={`hidden sm:block px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
              currentPage === 'corruption'
                ? 'bg-red-600 text-white border-red-500 shadow-md'
                : 'bg-white dark:bg-slate-800 text-red-600 border-red-100 dark:border-red-900/30'
            }`}
          >
            Exposure 🚩
          </button>

          <button 
            onClick={onToggleDark}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
          >
            <span className="text-base md:text-lg">{isDarkMode ? '🌙' : '☀️'}</span>
          </button>

          <button 
            onClick={() => onNavigate('settings')}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            title="Settings"
          >
            ⚙️
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-900 dark:text-white active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[90] bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass rounded-b-3xl md:rounded-2xl p-6 space-y-3 shadow-2xl border-t border-slate-200 dark:border-white/10 animate-in slide-in-from-top-4 duration-300 bg-white/95 dark:bg-slate-900/95 z-[100]">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4 mb-2">Protocol Access</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id as Page); setIsMenuOpen(false); }}
              className={`flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 ${
                currentPage === item.id 
                  ? 'bg-brand-600 text-white shadow-glow' 
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
          
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5">
            <button 
              onClick={() => { onNavigate('corruption'); setIsMenuOpen(false); }}
              className={`flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20`}
            >
              <span className="text-lg">🚩</span>
              Exposure Hub
            </button>
            <button 
              onClick={() => { onNavigate('settings'); setIsMenuOpen(false); }}
              className="w-full mt-3 p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Settings & Language ⚙️
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
