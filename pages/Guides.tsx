
import React, { useState, useEffect } from 'react';

const Guides: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'Police', 'Digital', 'Property', 'Women', 'Labor', 'Environment', 'Civil', 'Consumer', 'Health', 'Social Justice'];

  useEffect(() => {
    const target = sessionStorage.getItem('nagrik_active_guide_category');
    if (target && categories.includes(target)) {
      setActiveCategory(target);
      sessionStorage.removeItem('nagrik_active_guide_category');
      
      // Smooth scroll to content
      const contentEl = document.getElementById('guides-content');
      if (contentEl) {
        setTimeout(() => contentEl.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  const guides = [
    {
      id: 'fir',
      title: "FIR: The Mandatory Protocol",
      category: "Police",
      icon: "🚔",
      statute: "Section 154, CrPC (Ref: Lalita Kumari v. Govt. of UP)",
      steps: [
        { text: "Mandatory Registration", subtext: "Police MUST register an FIR for cognizable offenses immediately without preliminary inquiry." },
        { text: "Zero FIR Filing", subtext: "If the crime happened elsewhere, file a 'Zero FIR' at the nearest station; they must transfer it later." },
        { text: "Free Copy Entitlement", subtext: "Under Sec 154(2), you are entitled to a signed copy of the FIR immediately and for free." },
        { text: "Refusal Remedy", subtext: "If refused, send the substance of info to the SP via registered post under Sec 154(3)." },
        { text: "Preliminary Inquiry Limits", subtext: "Inquiry is only permitted in specific cases (e.g. Matrimonial, Commercial) and must not exceed 7 days." },
        { text: "Explaining Filing Delay", subtext: "Reasonable delay due to trauma or distance does not invalidate the FIR if explained to the court's satisfaction." },
        { text: "Judicial Magistrate Power", subtext: "If police fail to act, approach the Magistrate under Sec 156(3) CrPC to order a formal investigation." },
        { text: "The Evidentiary Role", subtext: "FIR is used for corroboration (Sec 157 Evidence Act) or contradiction (Sec 145), not as substantive proof of guilt." },
        { text: "Right Against Self-Incrimination", subtext: "Under Article 20(3), you cannot be compelled to provide information that incriminates yourself in the FIR." },
        { text: "Quashing Malicious FIRs", subtext: "Frivolous FIRs can be quashed by the High Court using its inherent powers under Section 482 CrPC." }
      ]
    },
    {
      id: 'cyber',
      title: "Cyber Slander & Identity Theft",
      category: "Digital",
      icon: "🔒",
      statute: "IT Act Sec 66C, 66D & 67",
      steps: [
        { text: "Digital Preservation", subtext: "Take high-resolution screenshots and save URL links of the offending content immediately." },
        { text: "Metadata Extraction", subtext: "If possible, save 'Email Headers' or 'Message Info' to track IP addresses." },
        { text: "The 24-Hour Rule", subtext: "Report within 24 hours on cybercrime.gov.in to increase the chance of freezing fraudulent accounts." },
        { text: "Bank Notification", subtext: "For financial fraud, notify your bank immediately to invoke the 'Zero Liability' RBI policy." }
      ]
    },
    {
      id: 'consumer-pro',
      title: "E-Daakhil: Consumer Court Filing",
      category: "Consumer",
      icon: "🛒",
      statute: "Consumer Protection Act, 2019",
      steps: [
        { text: "Notice of Grievance", subtext: "Send a formal notice to the company giving them 15 days to resolve the issue." },
        { text: "Online Filing", subtext: "Use the 'E-Daakhil' portal to file complaints without a lawyer for claims up to ₹5 Lakhs." },
        { text: "Territorial Jurisdiction", subtext: "You can now file where YOU reside, not just where the company is based." },
        { text: "Product Liability", subtext: "Hold manufacturers and sellers liable for harm caused by defective products." }
      ]
    },
    {
      id: 'domestic-v',
      title: "Domestic Violence: Exit & Shield",
      category: "Women",
      icon: "🛡️",
      statute: "Protection of Women from DV Act, 2005",
      steps: [
        { text: "Emergency Rescue (181/1091)", subtext: "Call the National Women Helpline for immediate intervention and shelter." },
        { text: "Protection Order", subtext: "Apply to a Magistrate for an order to stop the abuser from entering your workplace/residence." },
        { text: "Residence Rights", subtext: "You have a legal right to reside in the 'shared household' even if you don't own it." },
        { text: "DIR Filing", subtext: "Request a Domestic Incident Report (DIR) from a Protection Officer or NGO." }
      ]
    },
    {
      id: 'rti-pro',
      title: "RTI: Information Mastery",
      category: "Civil",
      icon: "📜",
      statute: "Right to Information Act, 2005",
      steps: [
        { text: "Drafting the Query", subtext: "Be specific. Ask for 'Certified Copies' of documents rather than general questions." },
        { text: "PIO Submission", subtext: "Submit to the Public Information Officer with a ₹10 fee (Free for BPL category)." },
        { text: "The 30-Day Clock", subtext: "The PIO must respond within 30 days (48 hours if it concerns 'Life and Liberty')." },
        { text: "First Appeal", subtext: "If refused or delayed, file the 'First Appeal' to the senior officer within 30 days." }
      ]
    },
    {
      id: 'medical-mal',
      title: "Medical Malpractice Audit",
      category: "Health",
      icon: "🏥",
      statute: "Consumer Act & State Medical Council Rules",
      steps: [
        { text: "Records Acquisition", subtext: "Under the MHC Act, hospitals MUST provide full medical records within 72 hours of request." },
        { text: "Expert Opinion", subtext: "Seek a 'Second Opinion' from a govt hospital to document the negligence." },
        { text: "Medical Council Complaint", subtext: "File a formal complaint with the State Medical Council to suspend the doctor's license." },
        { text: "Civil Damages", subtext: "File for compensation in the Consumer Commission for 'Deficiency in Service'." }
      ]
    },
    {
      id: 'senior-maint',
      title: "Senior Citizen Support Path",
      category: "Civil",
      icon: "👴",
      statute: "Maintenance & Welfare of Parents Act, 2007",
      steps: [
        { text: "Maintenance Tribunal", subtext: "Parents can apply to the SDM-headed tribunal for monthly allowance up to ₹10,000." },
        { text: "Property Reversal", subtext: "If children fail to care for parents after property transfer, the gift can be declared VOID." },
        { text: "No Lawyers Rule", subtext: "The tribunal process is designed to be lawyer-free to prevent intimidation." },
        { text: "Speedy Disposal", subtext: "The tribunal is mandated to decide the case within 90 days of the application." }
      ]
    },
    {
      id: 'animal-cruelty',
      title: "Animal Cruelty: Zero Tolerance",
      category: "Environment",
      icon: "🐾",
      statute: "Prevention of Cruelty to Animals Act, 1960",
      steps: [
        { text: "Evidence Capture", subtext: "Film the act of cruelty. This is the most vital evidence for prosecution." },
        { text: "Police Complaint (Sec 11)", subtext: "Cruelty to animals is a cognizable offense. Filing an FIR is mandatory for police." },
        { text: "Vet Examination", subtext: "Get the animal treated and a medical report issued by a registered veterinarian." },
        { text: "AWBI Notification", subtext: "Inform the Animal Welfare Board of India if the local police refuse to act." }
      ]
    },
    {
      id: 'street-vendor',
      title: "Street Vendor Protection",
      category: "Labor",
      icon: "🧺",
      statute: "Street Vendors Act, 2014",
      steps: [
        { text: "Certificate of Vending", subtext: "Ensure you are registered in the local Town Vending Committee (TVC) survey." },
        { text: "Eviction Notice", subtext: "Authorities must give a 30-day written notice before relocation or eviction." },
        { text: "Seizure Protocol", subtext: "If goods are seized, a detailed receipt (Inventory) must be provided immediately." },
        { text: "Vending Zones", subtext: "Vendors cannot be evicted until the survey is complete and vending zones are marked." }
      ]
    },
    {
      id: 'traffic-contest',
      title: "Traffic Challan: Fair Contest",
      category: "Civil",
      icon: "🚦",
      statute: "Motor Vehicles Amendment Act, 2019",
      steps: [
        { text: "On-Spot Verification", subtext: "Verify the officer's identity. Only an officer above the rank of Sub-Inspector can fine over ₹100." },
        { text: "Dashcam Defense", subtext: "If you have video proof, do not pay the fine on spot. Ask for a 'Court Challan'." },
        { text: "Virtual Courts", subtext: "Use the 'Virtual Court' portal (vcourts.gov.in) to contest or pay minor fines online." },
        { text: "Bodycam Request", subtext: "Citizens have the right to request a review of the officer's bodycam if available." }
      ]
    },
    {
      id: 'transgender-rights',
      title: "Transgender Identity Portal",
      category: "Social Justice",
      icon: "🏳️‍⚧️",
      statute: "Transgender Persons Act, 2019",
      steps: [
        { text: "Identity Application", subtext: "Apply online at the National Portal for Transgender Persons for an ID card." },
        { text: "Self-Perceived Identity", subtext: "No physical examination is allowed for the basic 'Transgender' certificate." },
        { text: "Gender Change", subtext: "For a 'Male' or 'Female' certificate, a proof of gender reassignment surgery is required." },
        { text: "Anti-Discrimination", subtext: "Establishments are legally barred from discriminating in employment or education." }
      ]
    },
    {
      id: 'inheritance-eq',
      title: "Inheritance: Daughter's Rights",
      category: "Property",
      icon: "🏠",
      statute: "Hindu Succession (Amendment) Act, 2005",
      steps: [
        { text: "Coparcenary Right", subtext: "Daughters are now 'Coparceners' (joint legal heirs) by birth, same as sons." },
        { text: "Retrospective Effect", subtext: "Rights apply even if the father died before 2005 (Ref: Vineeta Sharma v. Rakesh Sharma)." },
        { text: "Ancestral Property", subtext: "Daughters have an equal share in the ancestral property of the father." },
        { text: "Will Verification", subtext: "If a Will exists, check if it was 'Registered' to ensure its validity against fraud." }
      ]
    },
    {
      id: 'sc-st-protection',
      title: "SC/ST Atrocities: Immediate Shield",
      category: "Social Justice",
      icon: "⚖️",
      statute: "SC/ST (Prevention of Atrocities) Act, 1989",
      steps: [
        { text: "No Anticipatory Bail", subtext: "Accused cannot get anticipatory bail under this Act (Sec 18)." },
        { text: "Immediate FIR", subtext: "Police must register an FIR immediately for any caste-based insult or violence." },
        { text: "Monetary Relief", subtext: "Victims are entitled to immediate financial compensation from the State Govt." },
        { text: "Special Courts", subtext: "Cases are heard in designated Special Courts for faster disposal." }
      ]
    },
    {
      id: 'rent-eviction',
      title: "Tenant Defense: Unfair Eviction",
      category: "Property",
      icon: "🔑",
      statute: "Rent Control Act (State-Specific)",
      steps: [
        { text: "Agreement Review", subtext: "Ensure your Rent Agreement is registered. Unregistered agreements for >11 months have no legal standing." },
        { text: "Notice Period", subtext: "The landlord MUST give the notice period mentioned in the agreement (usually 30 days)." },
        { text: "Essential Services", subtext: "Landlords cannot cut off water or electricity to force eviction. This is a criminal offense." },
        { text: "Rent Control Court", subtext: "File a petition at the Rent Controller if the landlord refuses to accept rent or harasses you." }
      ]
    },
    {
      id: 'rti-appeal',
      title: "RTI: The Second Appeal",
      category: "Civil",
      icon: "📢",
      statute: "RTI Act Sec 19(3)",
      steps: [
        { text: "FAA Rejection", subtext: "If the First Appellate Authority also denies info, you have 90 days to appeal further." },
        { text: "SIC/CIC Filing", subtext: "File the 'Second Appeal' with the State or Central Information Commission." },
        { text: "Penalty Request", subtext: "Request the Commission to impose a penalty of ₹250/day (max ₹25,000) on the PIO." },
        { text: "Tracking Status", subtext: "Use the online RTI portal to track the progress of your appeals in real-time." }
      ]
    }
  ];

  const filtered = guides.filter(g => 
    (activeCategory === 'All' || g.category === activeCategory) &&
    (g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.statute.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-12 animate-slide-up">
      <header className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/10 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/30">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Indian Statutory Action Maps
        </div>
        <h1 className="text-6xl md:text-8xl font-black dark:text-white uppercase tracking-tighter leading-none">Action <br/><span className="text-blue-600 italic">Roadmaps.</span></h1>
        <p className="text-lg font-bold text-slate-500 max-w-2xl mx-auto">
          Battle-tested legal procedures for common Indian scenarios. Summarized from the latest amendments and judicial precedents.
        </p>

        <div className="max-w-xl mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search statutes or topics (e.g. 'FIR', 'Land')..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl px-8 py-5 font-bold outline-none border-2 border-transparent focus:border-blue-600/30 transition-all dark:text-white"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setActiveCategory(c)} 
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === c 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div id="guides-content" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {filtered.length > 0 ? filtered.map(g => (
          <div key={g.id} className="glass p-10 md:p-14 rounded-[4rem] border border-black/5 dark:border-white/10 hover:shadow-3xl transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
               <div className="text-[12rem] font-black italic -rotate-12">{g.icon}</div>
             </div>
             
             <div className="flex flex-col h-full relative z-10">
               <div className="flex items-center gap-6 mb-10">
                 <div className="text-6xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 drop-shadow-xl">{g.icon}</div>
                 <div>
                   <h3 className="text-3xl font-black dark:text-white uppercase leading-none mb-3 tracking-tighter">{g.title}</h3>
                   <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/30">
                     {g.category}
                   </span>
                 </div>
               </div>
               
               <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-10 tracking-[0.2em] flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
                 Statutory Basis: {g.statute}
               </p>

               <div className="space-y-8 flex-grow">
                  {g.steps.map((s, i) => (
                    <div key={i} className="flex gap-6 items-start group/step">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm shrink-0 shadow-lg group-hover/step:scale-110 transition-transform">
                        {i+1}
                      </div>
                      <div className="pt-1">
                        <p className="font-black dark:text-slate-200 text-lg mb-1 leading-tight">{s.text}</p>
                        <p className="text-sm text-slate-500 font-bold italic leading-relaxed">{s.subtext}</p>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                 <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                   Download Offline Copy
                 </button>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-6 h-2 rounded-full bg-blue-600"></div>
                 </div>
               </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center glass rounded-[4rem]">
             <div className="text-7xl mb-8 opacity-20">📂</div>
             <p className="text-2xl font-black dark:text-white uppercase tracking-tighter opacity-30">No matching roadmaps found.</p>
             <button onClick={() => {setActiveCategory('All'); setSearchQuery('');}} className="mt-6 text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Clear all filters</button>
          </div>
        )}
      </div>

      <footer className="text-center pt-20">
        <div className="inline-block glass px-8 py-5 rounded-[2.5rem] border border-blue-500/10 shadow-xl">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             BH-Statutory Registry v4.2 • Updated Daily • End-to-End Encrypted
           </p>
        </div>
      </footer>
    </div>
  );
};

export default Guides;
