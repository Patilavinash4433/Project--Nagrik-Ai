
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserSettings, SavedSession } from '../types';
import { getLegalAssistantResponse, generateSessionSummary } from '../services/geminiService';
import { speakText, stopCurrentSpeech } from '../services/ttsService';
import { connectLive } from '../services/liveService';

interface ChatProps {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
}

const Chat: React.FC<ChatProps> = ({ settings, onUpdateSettings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const [storageError, setStorageError] = useState<string | null>(null);
  const [storageUsage, setStorageUsage] = useState<string>('0%');
  
  // Settings UI State
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Summary State
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // History Editing
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Attachments
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Audio Playback State (TTS)
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);

  // Live Voice Mode State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'Connecting' | 'Listening' | 'Speaking' | 'Error'>('Connecting');
  const [liveTranscript, setLiveTranscript] = useState('');
  const liveDisconnectRef = useRef<() => void>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true); 

  // --- Auto-Resize Textarea ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

  // --- Storage Helper ---

  const calculateStorageUsage = (data: SavedSession[]) => {
    const json = JSON.stringify(data);
    const bytes = new Blob([json]).size;
    const limit = 4.5 * 1024 * 1024; 
    const percent = Math.min(100, (bytes / limit) * 100).toFixed(1);
    setStorageUsage(`${percent}%`);
  };

  const safeSaveSessions = (updatedSessions: SavedSession[]) => {
    try {
      const json = JSON.stringify(updatedSessions);
      localStorage.setItem('nagrikai_saved_sessions', json);
      setStorageError(null);
      setSessions(updatedSessions);
      calculateStorageUsage(updatedSessions);
    } catch (e: any) {
      console.error("Storage Error:", e);
      setSessions(updatedSessions); // Update state anyway
      if (e.name === 'QuotaExceededError' || e.code === 22 || e.message?.toLowerCase().includes('quota')) {
        setStorageError('Error saving chat: Local storage limit reached. Please clear old sessions.');
      } else {
        setStorageError('Error saving chat history. Browser storage may be full or restricted.');
      }
    }
  };

  // --- Auto-Save & Initialization ---

  useEffect(() => {
    const saved = localStorage.getItem('nagrikai_saved_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        calculateStorageUsage(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  const createInitialMessage = (): ChatMessage => ({
    role: 'assistant',
    content: `### Namaste ${settings.userName}! 🏛️\nI am **NagrikAi**, your legal assistant.\n\nI can help you with:\n- **Filing FIRs & Police Complaints**\n- **Property & Tenant Disputes**\n- **Cyber Crime Reporting**\n\nI will respond in **${settings.preferredLanguage}**. **How can I help you today?**`,
    timestamp: new Date()
  });

  const startNewChat = () => {
    const newId = Date.now().toString();
    const initialMessage = createInitialMessage();
    
    setMessages([initialMessage]);
    setCurrentSessionId(newId);
    setIsLoading(false);
    setInput('');
    setSelectedImage(null);
    shouldScrollRef.current = true;
    setPlayingMessageId(null);
    stopCurrentSpeech();
    setSummaryText(null);
    setShowSummary(false);

    const newSession: SavedSession = {
      id: newId,
      name: 'New Consultation',
      timestamp: Date.now(),
      messages: [initialMessage]
    };
    
    return newSession;
  };

  const handleStartNewChatAction = () => {
    const newSession = startNewChat();
    const updated = [newSession, ...sessions];
    safeSaveSessions(updated);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  useEffect(() => {
    if (!currentSessionId && messages.length === 0) {
      handleStartNewChatAction();
    }
  }, []);

  // CRITICAL FIX: Added 'sessions' to dependency array to prevent stale closure bugs
  useEffect(() => {
    if (!currentSessionId || messages.length === 0) return;

    const updatedSessions = sessions.map(session => {
      if (session.id === currentSessionId) {
        let sessionName = session.name;
        if (session.name === 'New Consultation') {
           const firstUserMsg = messages.find(m => m.role === 'user');
           if (firstUserMsg) {
             sessionName = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
           }
        }
        return { ...session, messages: messages, name: sessionName };
      }
      return session;
    });

    if (JSON.stringify(updatedSessions) !== JSON.stringify(sessions)) {
      safeSaveSessions(updatedSessions);
    }
  }, [messages, currentSessionId, sessions]);

  useEffect(() => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      shouldScrollRef.current = false;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      stopCurrentSpeech();
      if (liveDisconnectRef.current) liveDisconnectRef.current();
    };
  }, []);

  // --- Rendering Helpers ---

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="text-base md:text-lg font-bold mt-4 mb-2 text-inherit border-l-4 border-current pl-3 leading-tight opacity-90">
            {trimmed.slice(4)}
          </h3>
        );
      }
      
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={i} className="flex gap-2 mb-1 pl-2">
            <span className="font-bold mt-1.5 text-[10px] opacity-70">●</span>
            <span className="leading-relaxed opacity-90">
              {parseInlineStyles(trimmed.substring(2))}
            </span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
         const [num, ...rest] = trimmed.split('.');
         return (
            <div key={i} className="flex gap-2 mb-1 pl-2">
               <span className="font-bold min-w-[1.2rem] tabular-nums opacity-80">{num}.</span>
               <span className="leading-relaxed opacity-90">
                  {parseInlineStyles(rest.join('.').trim())}
               </span>
            </div>
         )
      }

      if (trimmed === '') {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="mb-2 leading-7 opacity-90">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  // --- Actions ---

  const loadSession = (session: SavedSession) => {
    stopCurrentSpeech();
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    shouldScrollRef.current = true;
    setSummaryText(null);
    setShowSummary(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const startEditing = (e: React.MouseEvent, session: SavedSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditName(session.name);
  };

  const saveEdit = (e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editingSessionId) {
      const updated = sessions.map(s => s.id === editingSessionId ? { ...s, name: editName } : s);
      safeSaveSessions(updated);
      setEditingSessionId(null);
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Permanently remove this chat from archive?")) {
      const remainingSessions = sessions.filter(s => s.id !== id);
      
      if (currentSessionId === id) {
        const newSession = startNewChat();
        safeSaveSessions([newSession, ...remainingSessions]);
      } else {
        safeSaveSessions(remainingSessions);
      }
    }
  };

  const clearAllHistory = () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete ALL chat history.\n\nAre you sure you want to proceed?")) {
      const newSession = startNewChat();
      safeSaveSessions([newSession]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({ data: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceMode = async () => {
    setIsVoiceMode(true);
    setLiveStatus('Connecting');
    setLiveTranscript('Connecting to secure node...');
    try {
      const connection = await connectLive(
        settings.voiceName,
        {
          onAudio: () => setLiveStatus('Speaking'),
          onInterrupted: () => { setLiveStatus('Listening'); setLiveTranscript(''); },
          onInputTranscription: (text) => { setLiveStatus('Listening'); setLiveTranscript(`You: ${text}`); },
          onOutputTranscription: (text) => { setLiveStatus('Speaking'); setLiveTranscript(`NagrikAi: ${text}`); },
          onClose: () => { setIsVoiceMode(false); setLiveStatus('Error'); }
        }
      );
      liveDisconnectRef.current = connection.disconnect;
      setLiveStatus('Listening');
    } catch (e) {
      alert("Microphone access denied or API Error.");
      setIsVoiceMode(false);
    }
  };

  const stopVoiceMode = async () => {
    if (liveDisconnectRef.current) {
      await liveDisconnectRef.current();
      liveDisconnectRef.current = null;
    }
    setIsVoiceMode(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleSpeech = (text: string, id: number) => {
    if (playingMessageId === id) {
      stopCurrentSpeech();
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(id);
      speakText(text, settings.voiceName, settings.speechRate, () => setPlayingMessageId(null), () => setPlayingMessageId(id));
    }
  };

  const handleRetry = async (msgIndex: number) => {
    if (msgIndex === 0) return;
    const lastUserMsg = messages[msgIndex - 1];
    if (!lastUserMsg || lastUserMsg.role !== 'user') return;
    setIsLoading(true);
    setPlayingMessageId(null);
    stopCurrentSpeech();
    const keptMessages = messages.slice(0, msgIndex);
    setMessages(keptMessages);
    try {
        const historyContext = keptMessages.slice(0, -1).slice(-5);
        let fileData = undefined;
        if (lastUserMsg.imageUrl && lastUserMsg.imageUrl.startsWith('data:')) {
           const [meta, data] = lastUserMsg.imageUrl.split(',');
           const mime = meta.split(':')[1].split(';')[0];
           fileData = { data, mimeType: mime };
        }
        const result = await getLegalAssistantResponse(
            lastUserMsg.content,
            historyContext,
            { language: settings.preferredLanguage, file: fileData, isThinking: settings.deepThinkingDefault }
        );
        setMessages([...keptMessages, { role: 'assistant', content: result.text, timestamp: new Date(), groundingSources: result.grounding }]);
    } catch (e) {
        setMessages([...keptMessages, { role: 'assistant', content: "Sorry, I couldn't regenerate the response.", timestamp: new Date() }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (messages.length <= 1) return;
    setIsSummarizing(true);
    setShowSummary(true);
    setSummaryText(null);
    try {
      const summary = await generateSessionSummary(messages, settings.preferredLanguage);
      setSummaryText(summary);
    } catch (e) {
      setSummaryText("Failed to generate summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    const text = input;
    const img = selectedImage;
    setInput('');
    setSelectedImage(null);
    stopCurrentSpeech();
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date(), imageUrl: img ? `data:${img.mimeType};base64,${img.data}` : undefined }]);
    setIsLoading(true);
    shouldScrollRef.current = true;
    try {
      const result = await getLegalAssistantResponse(
        text, messages.slice(-5), { language: settings.preferredLanguage, file: img ? img : undefined, isThinking: settings.deepThinkingDefault }
      );
      setMessages(prev => [...prev, { role: 'assistant', content: result.text, timestamp: new Date(), groundingSources: result.grounding }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] w-full max-w-[1600px] mx-auto bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans relative">
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-100/50 dark:bg-slate-800/50">
          <h2 className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide">NagrikAi Chat Archive</h2>
          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
               <button 
                  onClick={clearAllHistory}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline uppercase tracking-wider bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded"
                  title="Delete All History"
               >
                 Clear All
               </button>
            )}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">✕</button>
          </div>
        </div>
        
        <div className="p-4">
          <button 
            onClick={handleStartNewChatAction}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            <span className="text-brand-600 text-lg">+</span> New Consultation
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
          {sessions.map(session => {
            const hasMedia = session.messages.some(m => m.imageUrl || m.videoUrl);
            const userSnippets = session.messages.filter(m => m.role === 'user').slice(0, 5);
            
            return (
              <div 
                key={session.id}
                onClick={() => loadSession(session)}
                className={`group relative p-4 rounded-xl border cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700'
                }`}
              >
                {editingSessionId === session.id ? (
                  <form onSubmit={saveEdit} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-brand-500 rounded px-2 py-1 text-xs outline-none"
                      autoFocus
                    />
                    <button type="submit" className="text-green-500 hover:text-green-600 p-1 bg-green-50 dark:bg-green-900/20 rounded">✓</button>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-1">
                       <div className={`font-bold text-sm truncate pr-2 ${
                         currentSessionId === session.id ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'
                       }`}>
                         {session.name}
                       </div>
                       {hasMedia && (
                         <span className="text-xs" title="Contains Images/Media">🖼️</span>
                       )}
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-semibold mb-3">
                      {new Date(session.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    
                    {/* Delete/Edit Option - Always visible on active or hover */}
                    <div className={`
                       absolute right-2 top-2 flex items-center gap-1 transition-opacity bg-white/90 dark:bg-slate-900/90 rounded-md p-0.5 shadow-sm
                       ${currentSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    `}>
                      <button 
                        onClick={(e) => startEditing(e, session)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Title"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={(e) => deleteSession(e, session.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors z-20 relative"
                        title="Remove Chat"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
           <div className="px-1 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Storage Used</span>
              <span>{storageUsage}</span>
           </div>
           <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className={`h-full rounded-full transition-all duration-500 ${parseFloat(storageUsage) > 90 ? 'bg-red-500' : 'bg-brand-500'}`} style={{ width: storageUsage }}></div>
           </div>

           <button 
             onClick={() => window.location.hash = 'settings'}
             className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/10 hover:text-brand-600 text-slate-600 dark:text-slate-400 rounded-xl transition-all font-bold text-sm border border-transparent hover:border-brand-200 dark:hover:border-brand-800/50"
           >
             <span className="text-lg">⚙️</span> Settings & Language
           </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-grow flex flex-col h-full relative w-full bg-white dark:bg-slate-950">
        
        {/* Error Banner */}
        {storageError && (
          <div className="bg-red-500 text-white px-4 py-2 text-center text-xs font-bold uppercase tracking-widest animate-pulse z-50">
            {storageError}
          </div>
        )}

        {/* Header */}
        <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm z-10 relative">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            {/* 3D Dynamic Logo Mini */}
            <div className="w-10 h-10 flex items-center justify-center [perspective:500px] group">
              <div className="relative w-8 h-8 [transform-style:preserve-3d] animate-[float_4s_ease-in-out_infinite]">
                 <div className="absolute inset-0 border border-brand-500/50 rounded-full [transform:rotateX(70deg)] animate-[spin_3s_linear_infinite]"></div>
                 <svg viewBox="0 0 100 100" className="w-full h-full text-brand-600 dark:text-white drop-shadow-lg [transform:translateZ(5px)]" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M50 20v60 M30 80h40" />
                   <path d="M25 40h50 M25 40v10 M75 40v10" />
                 </svg>
              </div>
            </div>

            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none">NagrikAi Assistant</h1>
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
                {isLoading ? (
                  <>Processing <span className="animate-pulse">...</span></>
                ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online ({settings.preferredLanguage})</>
                )}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
               onClick={handleSummarize}
               className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white transition-all border border-transparent hover:border-brand-500/30"
               title="Summarize Chat"
            >
              <span className="text-base">📝</span>
            </button>
            
            <div className="relative">
              <button 
                 onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                 className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border ${showVoiceSettings ? 'bg-brand-600 text-white border-brand-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white border-transparent'}`}
                 title="Voice Control Center"
              >
                <span className="text-base">{isVoiceMode ? '🎙️' : '🔊'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">{settings.voiceName}</span>
              </button>
              
              {/* Voice Control Popup */}
              {showVoiceSettings && (
                 <div className="absolute top-full right-0 mt-3 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                       <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Audio Protocol</h3>
                       <button onClick={() => setShowVoiceSettings(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                    
                    <div className="space-y-5">
                       <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase">Select Persona</label>
                          <div className="grid grid-cols-3 gap-2">
                             {['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Aoide'].map(voice => (
                                <button 
                                  key={voice}
                                  onClick={() => onUpdateSettings({...settings, voiceName: voice as any})}
                                  className={`px-2 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                     settings.voiceName === voice 
                                     ? 'bg-brand-600 text-white shadow-lg scale-105' 
                                     : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {voice}
                                </button>
                             ))}
                          </div>
                       </div>
                       
                       <div>
                          <div className="flex justify-between mb-2">
                             <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Speech Rate</label>
                             <span className="text-[10px] font-black text-brand-600 dark:text-brand-400">{settings.speechRate}x</span>
                          </div>
                          <input 
                            type="range" min="0.5" max="2.0" step="0.1" 
                            value={settings.speechRate}
                            onChange={(e) => onUpdateSettings({...settings, speechRate: parseFloat(e.target.value)})}
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600"
                          />
                       </div>

                       <button 
                          onClick={() => { setShowVoiceSettings(false); startVoiceMode(); }}
                          className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-brand-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                          <span className="animate-pulse">●</span> Start Live Session
                       </button>
                    </div>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-entrance gap-2`}>
              
              {/* Assistant Avatar */}
              {msg.role === 'assistant' && (
                <div className={`
                  shrink-0 rounded-2xl flex items-center justify-center 
                  bg-slate-900 dark:bg-white text-white dark:text-slate-900 
                  shadow-md border border-brand-200 dark:border-brand-900
                  w-8 h-8 mt-1 transition-all duration-300 z-10 self-start
                  ${playingMessageId === idx ? 'shadow-[0_0_25px_rgba(99,102,241,0.6)] scale-110 ring-2 ring-brand-500' : ''}
                `}>
                   <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M50 25v50 M30 45l20-10 20 10" />
                     <path d="M25 80c0-5 10-5 25-5s25 0 25 5" />
                   </svg>
                </div>
              )}

              <div className={`flex flex-col max-w-[85%] md:max-w-[70%] group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.imageUrl && (
                  <div className="mb-2 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={msg.imageUrl} alt="Uploaded" className="max-h-64 object-contain" />
                  </div>
                )}

                <div className={`
                  relative px-5 py-3 shadow-sm transition-all text-sm md:text-base
                  ${msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-2xl rounded-br-sm shadow-brand-500/20' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-sm'}
                  ${playingMessageId === idx ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-950' : ''}
                `}>
                  {msg.role === 'user' ? (
                     <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                     <div>{renderMessageContent(msg.content)}</div>
                  )}
                </div>
                
                {/* Metadata Row: Timestamp + Actions */}
                <div className={`flex items-center gap-3 mt-1.5 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   <span className="text-[10px] font-bold text-slate-400 opacity-60">
                      {formatTime(msg.timestamp)}
                   </span>
                   
                   {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleCopy(msg.content)} className="text-slate-400 hover:text-brand-600 transition-colors p-1" title="Copy Text">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                         </button>
                         <button 
                            onClick={() => toggleSpeech(msg.content, idx)} 
                            className={`hover:text-brand-600 transition-colors p-1 ${playingMessageId === idx ? 'text-brand-600' : 'text-slate-400'}`} 
                            title={playingMessageId === idx ? "Stop Speaking" : "Read Aloud"}
                         >
                            {playingMessageId === idx ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 17a9.99 9.99 0 002.993-8.68 5.502 5.502 0 00-1.053-2.673 1 1 0 00-1.664 1.114 3.502 3.502 0 01.66 1.764c.068.736-.023 1.493-.264 2.21a1 1 0 101.896.633c.338-1.004.464-2.071.37-3.125a7.99 7.99 0 00-2.39-5.467 1 1 0 10-1.415 1.414 5.99 5.99 0 011.792 4.1c.07.79-.024 1.59-.278 2.353a1 1 0 101.896.633A7.98 7.98 0 0017.5 8c0-.36-.023-.716-.067-1.066a1 1 0 10-1.982.266c.03.235.045.474.045.714 0 1.968-.948 3.737-2.427 4.887a1 1 0 101.214 1.59zM10 17a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            )}
                         </button>
                         <button onClick={() => handleRetry(idx)} className="text-slate-400 hover:text-brand-600 transition-colors p-1" title="Regenerate">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         </button>
                      </div>
                   )}
                </div>
                
                {/* Grounding Sources */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-2 px-1">
                     {msg.groundingSources.map((s, i) => (
                       <a key={i} href={s.uri} target="_blank" className="text-[9px] font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                         {s.title} ↗
                       </a>
                     ))}
                   </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full message-entrance gap-2">
               <div className="shrink-0 rounded-2xl flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md w-8 h-8 mt-1 self-end">
                   <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M50 25v50 M30 45l20-10 20 10" />
                     <path d="M25 80c0-5 10-5 25-5s25 0 25 5" />
                   </svg>
               </div>
               <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                 <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 relative z-20">
          {selectedImage && (
             <div className="flex items-center gap-3 mb-3 bg-slate-50 dark:bg-slate-900 p-2 pl-3 rounded-xl w-fit border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center text-brand-600">🖼️</div>
                <div className="flex flex-col pr-4">
                   <span className="text-[10px] text-slate-700 dark:text-slate-200 font-bold uppercase">Image Attached</span>
                </div>
                <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-red-500 p-1">✕</button>
             </div>
          )}
          
          <div className="relative max-w-4xl mx-auto flex items-end gap-2">
             <div className="flex-grow relative bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-end shadow-inner focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500/50 transition-all">
               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 mb-1 ml-1 text-slate-400 hover:text-brand-600 rounded-full transition-colors"
                  title="Attach"
                >
                  <span className="text-xl leading-none">＋</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
               
               <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder="Ask a legal question..."
                  className="w-full bg-transparent border-none py-4 px-2 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 resize-none max-h-32 min-h-[56px] text-sm leading-relaxed"
                  rows={1}
               />
               
               {/* Spacer for right padding if needed */}
               <div className="w-2"></div>
             </div>
             
             <button
               onClick={handleSend}
               disabled={!input.trim() && !selectedImage}
               className={`h-[56px] w-[56px] rounded-full flex items-center justify-center transition-all shadow-lg ${
                 input.trim() || selectedImage 
                   ? 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 active:scale-95' 
                   : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
               }`}
             >
               <svg className="w-6 h-6 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
             </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
            NagrikAi can make mistakes. Verify critical info with a lawyer.
          </p>
        </div>

        {/* Live Voice Overlay */}
        {isVoiceMode && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
             <button onClick={stopVoiceMode} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10">
               <span className="text-xs font-bold uppercase tracking-widest">Close Session</span>
               <span>✕</span>
             </button>
             
             <div className="relative mb-10">
               <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${liveStatus === 'Speaking' ? 'bg-brand-500 shadow-[0_0_60px_#6366f1] scale-110' : 'bg-emerald-500 shadow-[0_0_60px_#10b981]'}`}>
                 <span className="text-4xl">{liveStatus === 'Speaking' ? '🔊' : '🎙️'}</span>
               </div>
               {liveStatus === 'Listening' && (
                 <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping opacity-20"></div>
               )}
             </div>

             <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{liveStatus}</h2>
             
             <div className="h-16 flex items-end justify-center gap-1 mb-8">
               {[...Array(5)].map((_, i) => (
                 <div 
                    key={i} 
                    className={`w-2 bg-white rounded-full transition-all duration-150 ${liveStatus === 'Speaking' ? 'animate-wave' : 'h-2 opacity-20'}`} 
                    style={{ height: liveStatus === 'Speaking' ? '40px' : '8px', animationDelay: `${i * 0.1}s` }}
                 ></div>
               ))}
             </div>

             <p className="text-slate-300 text-lg font-medium max-w-xl text-center px-6 min-h-[3rem] leading-relaxed">
               "{liveTranscript}"
             </p>
             
             <button 
               onClick={stopVoiceMode} 
               className="mt-12 px-8 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
             >
               End Voice Channel
             </button>
          </div>
        )}

        {/* Summary Modal */}
        {showSummary && (
          <div className="absolute inset-0 z-40 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-xl flex items-center justify-center text-xl">📝</div>
                  <div>
                    <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">Consultation Brief</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Generated Summary</p>
                  </div>
                </div>
                <button onClick={() => setShowSummary(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">✕</button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                {isSummarizing ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-4">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Compressing Legal Data...</p>
                  </div>
                ) : summaryText ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-sm text-slate-700 dark:text-slate-300">
                      {renderMessageContent(summaryText)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">Failed to generate summary.</div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-3xl">
                <button onClick={() => setShowSummary(false)} className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
                <button 
                  onClick={() => { if(summaryText) handleCopy(summaryText); }}
                  className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-700 transition-colors shadow-lg active:scale-95"
                >
                  Copy Brief
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Chat;
