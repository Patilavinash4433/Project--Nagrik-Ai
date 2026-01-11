
import { Language, LawCategory } from './types';

export const LANGUAGES = [
  { code: 'en', name: Language.ENGLISH, native: 'English' },
  { code: 'hi', name: Language.HINDI, native: 'हिन्दी' },
  { code: 'gu', name: Language.GUJARATI, native: 'ગુજરાતી' },
  { code: 'mr', name: Language.MARATHI, native: 'मराठी' },
  { code: 'ta', name: Language.TAMIL, native: 'தமிழ்' },
  { code: 'te', name: Language.TELUGU, native: 'తెలుగు' },
  { code: 'bn', name: Language.BENGALI, native: 'বাংলা' },
  { code: 'kn', name: Language.KANNADA, native: 'ಕನ್ನಡ' },
  { code: 'ml', name: Language.MALAYALAM, native: 'മലയാളം' },
  { code: 'pa', name: Language.PUNJABI, native: 'ਪੰਜਾਬੀ' },
];

export const LAW_CATEGORIES: LawCategory[] = [
  // Fix: Added summary, sections, and links to comply with LawCategory interface
  {
    id: 'police',
    title: 'Police & FIR',
    icon: '👮',
    description: 'Understand your rights when dealing with police, filing FIRs, and bail procedures.',
    summary: 'The Code of Criminal Procedure (CrPC) governs how police should interact with citizens, file First Information Reports (FIRs), and conduct investigations.',
    sections: ['Sec 154 CrPC', 'Sec 41 CrPC', 'Sec 46 CrPC'],
    links: [{ label: 'National Police Portal', url: 'https://digitalpolice.gov.in/' }],
    color: 'blue'
  },
  {
    id: 'women',
    title: 'Women Rights',
    icon: '👩',
    description: 'Protection against domestic violence, workplace harassment, and inheritance laws.',
    summary: 'India has specific laws like the PWDVA and POSH Act to protect women from violence and harassment, alongside equal inheritance rights.',
    sections: ['DV Act 2005', 'POSH Act 2013', 'IPC 498A'],
    links: [{ label: 'NCW Official Site', url: 'http://ncw.nic.in/' }],
    color: 'pink'
  },
  {
    id: 'cyber',
    title: 'Cyber Crime',
    icon: '💻',
    description: 'Safety against online fraud, identity theft, and social media abuse.',
    summary: 'The Information Technology Act, 2000 provides the legal framework to deal with cybercrimes including phishing, identity theft, and data breaches.',
    sections: ['Sec 66C IT Act', 'Sec 66D IT Act', 'Sec 67 IT Act'],
    links: [{ label: 'Cyber Crime Reporting', url: 'https://cybercrime.gov.in/' }],
    color: 'indigo'
  },
  {
    id: 'property',
    title: 'Property Law',
    icon: '📜',
    description: 'Registration, inheritance, tenant disputes, and RERA rules.',
    summary: 'Property laws in India cover registration of deeds, inheritance through succession acts, and protection for homebuyers under RERA.',
    sections: ['RERA Act 2016', 'Registration Act 1908', 'Transfer of Property Act'],
    links: [{ label: 'RERA Portal', url: 'https://rera.delhi.gov.in/' }],
    color: 'emerald'
  },
  {
    id: 'consumer',
    title: 'Consumer Rights',
    icon: '🛒',
    description: 'Your rights against unfair trade practices and how to file complaints.',
    summary: 'The Consumer Protection Act, 2019 empowers consumers against defective goods, deficient services, and unfair trade practices.',
    sections: ['Consumer Protection Act 2019', 'Sec 2(7) CPA', 'Sec 35 CPA'],
    links: [{ label: 'Consumer Helpline', url: 'https://consumerhelpline.gov.in/' }],
    color: 'orange'
  },
  {
    id: 'animal',
    title: 'Animal Welfare',
    icon: '🐾',
    description: 'Laws protecting pets and street animals against cruelty.',
    summary: 'The Prevention of Cruelty to Animals Act and various sections of the IPC protect animals from abuse and ensure their welfare.',
    sections: ['PCA Act 1960', 'IPC 428', 'IPC 429'],
    links: [{ label: 'AWBI Website', url: 'http://www.awbi.in/' }],
    color: 'green'
  },
  {
    id: 'traffic',
    title: 'Traffic & Challan',
    icon: '🚦',
    description: 'Rules of the road, fighting false challans, and MVA acts.',
    summary: 'The Motor Vehicles Act sets rules for driving, licensing, and penalties for violations. It also provides for contesting wrongful challans.',
    sections: ['MVA 1988', 'MVA Amendment 2019', 'Sec 185 MVA'],
    links: [{ label: 'Parivahan Sewa', url: 'https://parivahan.gov.in/' }],
    color: 'red'
  },
  {
    id: 'mental',
    title: 'Mental Health Law',
    icon: '🧠',
    description: 'Rights under the Mental Healthcare Act 2017.',
    summary: 'The Mental Healthcare Act, 2017 ensures the rights of persons with mental illness to access mental healthcare and live with dignity.',
    sections: ['MHCA 2017', 'Sec 18 MHCA', 'Sec 115 MHCA'],
    links: [{ label: 'Ministry of Health', url: 'https://main.mohfw.gov.in/' }],
    color: 'purple'
  }
];

export const EMERGENCY_TIPS = [
  "You can record police interactions if they are in public spaces.",
  "A woman cannot be arrested after sunset or before sunrise without a special warrant.",
  "FIR must be registered for cognizable offenses; refusal is a punishable offense for police.",
  "You have the right to a free lawyer if you cannot afford one (Legal Aid)."
];
