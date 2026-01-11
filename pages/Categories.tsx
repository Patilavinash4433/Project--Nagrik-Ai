
import React from 'react';
import { Page } from '../types';
import { LAW_CATEGORIES } from '../constants';

const GUIDE_MAPPING: Record<string, string> = {
  'police': 'Police',
  'women': 'Women',
  'cyber': 'Digital',
  'property': 'Property',
  'consumer': 'Consumer',
  'animal': 'Environment',
  'traffic': 'Civil',
  'mental': 'Health'
};

const Categories: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  
  const handleGuideNavigation = (id: string) => {
    const targetCategory = GUIDE_MAPPING[id] || 'All';
    sessionStorage.setItem('nagrik_active_guide_category', targetCategory);
    onNavigate('guides');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 py-6 md:py-10 px-4 animate-slide-up">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter uppercase leading-[1]">Law <br className="hidden md:block"/><span className="text-blue-600">Directory.</span></h1>
        <p className="text-base md:text-lg font-bold text-slate-500 px-4">Statutory index for the modern citizen. Summarized, indexed, and linked.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {LAW_CATEGORIES.map((cat) => (
          <div key={cat.id} className="glass p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-b-[8px] md:border-b-[10px] transition-all active:scale-[0.98] md:hover:-translate-y-2 group" style={{ borderColor: cat.color }}>
            <div className="text-5xl md:text-6xl mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
            <h3 className="text-2xl md:text-3xl font-black dark:text-white mb-3 md:mb-4 uppercase tracking-tighter">{cat.title}</h3>
            <p className="text-sm md:text-base text-slate-500 font-bold mb-6 italic leading-snug">{cat.description}</p>
            
            <div className="space-y-5">
               <div>
                 <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Key Sections</p>
                 <div className="flex flex-wrap gap-2">
                   {cat.sections.map((s, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-[8px] md:text-[9px] font-bold dark:text-slate-300 border border-slate-200 dark:border-white/5">{s}</span>
                   ))}
                 </div>
               </div>
               
               <div>
                 <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Resources</p>
                 <div className="space-y-2">
                   {cat.links.map((l, i) => (
                     <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="block text-[10px] md:text-[11px] font-black text-blue-600 hover:underline">↗ {l.label}</a>
                   ))}
                 </div>
               </div>
            </div>

            <button 
              onClick={() => handleGuideNavigation(cat.id)}
              className="w-full mt-8 py-3.5 md:py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md hover:bg-brand-600 dark:hover:bg-brand-400 hover:text-white"
            >
              View Action Guide
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
