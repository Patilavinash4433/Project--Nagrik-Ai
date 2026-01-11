
import React, { useState } from 'react';
import { DirectoryItem } from '../types';

const MOCK_DIRECTORY: DirectoryItem[] = [
  { id: '1', name: 'National Cyber Crime Reporting', type: 'CyberCell', city: 'National', contact: '1930', address: 'Online Portal: cybercrime.gov.in' },
  { id: '2', name: 'DLSA Legal Aid Clinic', type: 'NGO', city: 'Delhi', contact: '1516', address: 'Patiala House Courts, New Delhi' },
  { id: '3', name: 'Anti-Corruption Bureau', type: 'Police', city: 'Mumbai', contact: '1064', address: 'Worli, Mumbai' },
  { id: '4', name: 'Women Helpline', type: 'NGO', city: 'National', contact: '1091', address: '24/7 Emergency Service' },
  { id: '5', name: 'Consumer Mediation Cell', type: 'Court', city: 'Bengaluru', contact: '1800-11-4000', address: 'Shantinagar, Bengaluru' },
];

const LegalDirectory: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_DIRECTORY.filter(d => 
    (filter === 'All' || d.type === filter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 pb-32 animate-slide-up">
      <header className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter">Resource <span className="text-brand-600">Directory.</span></h1>
        <p className="text-slate-500 font-medium">Verified contact points for Legal Aid, Police, and Cyber Cells.</p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
           {['All', 'Police', 'CyberCell', 'Court', 'NGO'].map(t => (
             <button 
               key={t} onClick={() => setFilter(t)}
               className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap ${
                 filter === t ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
               }`}
             >
               {t}
             </button>
           ))}
        </div>
        <input 
          type="text" placeholder="Search city or agency..." 
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none font-bold text-sm dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-brand-500 transition-colors group">
             <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.type} • {item.city}</div>
               <h3 className="text-lg font-bold dark:text-white mb-2">{item.name}</h3>
               <p className="text-sm text-slate-500">{item.address}</p>
             </div>
             <div className="text-right">
               <div className="text-xl font-black text-brand-600">{item.contact}</div>
               <button className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-brand-600">Call Now</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalDirectory;
