
export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  GUJARATI = 'Gujarati',
  MARATHI = 'Marathi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  BENGALI = 'Bengali',
  KANNADA = 'Kannada',
  MALAYALAM = 'Malayalam',
  PUNJABI = 'Punjabi'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imageMimeType?: string;
  videoUrl?: string;
  fileName?: string;
  fileUrl?: string;
  fileMimeType?: string;
  isThinking?: boolean;
  isProcessing?: boolean;
  groundingSources?: GroundingSource[];
}

export interface SavedSession {
  id: string;
  name: string;
  timestamp: number;
  messages: ChatMessage[];
}

export interface UserSettings {
  userName: string;
  preferredLanguage: Language;
  voiceName: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoide' | 'Eos';
  speechRate: number;
  autoSearch: boolean;
  deepThinkingDefault: boolean;
  themeColor: string;
}

export interface LawCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  summary: string;
  sections: string[];
  links: { label: string; url: string }[];
  color: string;
}

export interface CorruptionAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number; // 0-100
  summary: string;
  steps: string[];
  lawsApplicable: string[];
  riskFactors: { factor: string; score: number }[];
  recommendedChannels: { agency: string; link: string; contact: string }[];
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  snippet: string;
  link: string;
  category: 'Corruption' | 'Cybercrime' | 'Legal';
}

export interface DirectoryItem {
  id: string;
  name: string;
  type: 'Police' | 'Court' | 'NGO' | 'CyberCell';
  city: string;
  contact: string;
  address: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  outcome: string;
  description: string;
  lawUsed: string;
}

export type Page = 'home' | 'chat' | 'categories' | 'guides' | 'disclaimer' | 'corruption' | 'settings' | 'news' | 'directory';

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9" | "2:3" | "3:2";
export type ImageSize = "1K" | "2K" | "4K";
