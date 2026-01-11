
import React, { useState } from 'react';
import { analyzeCorruptionRisk } from '../services/geminiService';
import { CorruptionAnalysis, CaseStudy } from '../types';

const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: "Bengaluru Trap Operation",
    outcome: "Success",
    description: "Citizen used a structured legal roadmap to trap a bribery attempt in a land revenue case involving ₹50,000.",
    lawUsed: "POCA Sec 7"
  },
  {
    id: '2',
    title: "PDS Leakage Exposure",
    outcome: "License Revoked",
    description: "RTI exposed diversion of grains in a Ration Shop. License cancelled by District Supply Officer.",
    lawUsed: "RTI Act 2005"
  }
];

// Simple Radar Chart Component
const RiskRadarChart: React.FC<{ data: { factor: string; score: number }[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = (d.score / 100) * radius;
    return `${center + value * Math.cos(angle)},${center + value * Math.sin(angle)}`;
  }).join(' ');

  const axes = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const labelX = center + (radius + 20) * Math.cos(angle);
    const labelY = center + (radius + 20) * Math.sin(angle);
    return { x, y, labelX, labelY, label: d.factor };
  });

  return (
    <div className="relative w-full max-w-[300px] mx-auto aspect-square">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Background Circles */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <circle key={r} cx={center} cy={center} r={radius * r} fill="none" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-700" />
        ))}
        {/* Axes */}
        {axes.map((axis, i) => (
          <line key={i} x1={center} y1={center} x2={axis.x} y2={axis.y} stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-600" />
        ))}
        {/* Data Polygon */}
        <polygon points={points} fill="rgba(220, 38, 38, 0.2)" stroke="#dc2626" strokeWidth="2" />
        {/* Labels */}
        {axes.map((axis, i) => (
          <text 
            key={i} x={axis.labelX} y={axis.labelY} 
            textAnchor="middle" dominantBaseline="middle" 
            className="text-[8px] font-bold fill-slate-500 dark:fill-slate-400 uppercase"
            style={{ fontSize: '8px' }}
          >
            {axis.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

const Corruption: React.FC = () => {
  const [report, setReport] = useState('');
  const [incidentType, setIncidentType] = useState('Bribery');
  const [analysis, setAnalysis] = useState<CorruptionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!report.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeCorruptionRisk(`Type: ${incidentType}\nDetails: ${report}`);
      setAnalysis(result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 pt-12 px-4">
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-900/10 rounded-full text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
          Malpractice Terminal
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight dark:text-white leading-tight">
          Audit <span className="text-red-600">Exposure.</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Audit systemic malpractice through Indian Statutes. Mapping enforcement channels with zero-latency intelligence.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="glass p-8 rounded-3xl border border-slate-100 dark:border-white/5 shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-fit">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Select Incident Protocol</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {['Bribery', 'Extortion', 'Favoritism', 'Embezzlement'].map(type => (
              <button 
                key={type} onClick={() => setIncidentType(type)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  incidentType === type 
                    ? 'bg-red-600 text-white border-red-500 shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <textarea
            value={report} onChange={(e) => setReport(e.target.value)}
            placeholder="Describe the incident precisely. Include dates, departments, and specific demands..."
            className="w-full h-48 bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-base font-medium focus:border-red-600 transition-all outline-none dark:text-white resize-none"
          />
          
          <button 
            onClick={handleAnalyze} disabled={loading || !report.trim()} 
            className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-base uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-md"
          >
            {loading ? "Analyzing..." : "Analyze Statutory Risk 🛡️"}
          </button>
        </section>

        {/* Results Area */}
        <div className="space-y-6">
          {analysis ? (
            <div className="animate-slide-up space-y-6">
              <div className="p-6 glass rounded-3xl border-t-8 border-red-600 shadow-lg text-center bg-white dark:bg-slate-900">
                 <div className="flex items-center justify-between mb-4">
                   <div className="text-left">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-red-600">Total Risk Score</div>
                     <div className="text-5xl font-extrabold text-slate-900 dark:text-white">{analysis.riskScore}/100</div>
                   </div>
                   <div className="text-right">
                     <span className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold uppercase">
                       {analysis.riskLevel} Risk
                     </span>
                   </div>
                 </div>
                 
                 {/* Custom Radar Chart */}
                 {analysis.riskFactors && <RiskRadarChart data={analysis.riskFactors} />}
                 
                 <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">"{analysis.summary}"</p>
              </div>

              <div className="p-6 glass rounded-3xl shadow-lg bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold mb-4 uppercase tracking-widest dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Recommended Strategy</h4>
                <ul className="space-y-3">
                  {analysis.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium dark:text-slate-300">
                      <span className="text-red-600 font-bold shrink-0">{i+1}.</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 glass rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center opacity-50">
               <div className="text-6xl mb-4 grayscale">⚖️</div>
               <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Awaiting Incident Data</p>
            </div>
          )}
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-black dark:text-white mb-8 text-center uppercase tracking-tight">Community <span className="text-red-600">Wins</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASE_STUDIES.map(story => (
            <div key={story.id} className="p-8 glass rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-md hover:shadow-xl transition-all group bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  {story.outcome}
                </span>
                <span className="text-2xl group-hover:scale-125 transition-transform">🏆</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-3">{story.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium italic mb-6 leading-relaxed">"{story.description}"</p>
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-brand-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                {story.lawUsed}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Corruption;
