
import React, { useEffect, useState } from 'react';
import { fetchLegalNews } from '../services/geminiService';
import { NewsItem } from '../types';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const items = await fetchLegalNews();
    setNews(items);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 pb-32 animate-slide-up">
      <header className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-900/10 rounded-full text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Live Intelligence Feed
        </div>
        <h1 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter">Legal <span className="text-brand-600">Newsroom.</span></h1>
        <p className="text-slate-500 font-medium">Real-time updates on Corruption crackdowns, Cybercrime, and Court verdicts.</p>
        <button onClick={loadNews} className="text-sm font-bold text-brand-600 hover:underline">Refresh Feed ↻</button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
           ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <a 
              key={idx} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  item.category === 'Corruption' ? 'bg-red-50 text-red-600' : 
                  item.category === 'Cybercrime' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{item.date}</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-3 line-clamp-3 group-hover:text-brand-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-4 flex-grow mb-6">
                {item.snippet}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                 <span>{item.source}</span>
                 <span className="flex-grow h-px bg-slate-100 dark:bg-slate-800"></span>
                 <span className="group-hover:translate-x-1 transition-transform">Read ↗</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
           <p className="text-slate-400 font-bold">Unable to fetch news stream. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default News;
