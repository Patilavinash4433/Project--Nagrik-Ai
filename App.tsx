
import React, { useState, useEffect } from 'react';
import { Page, UserSettings, Language } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Categories from './pages/Categories';
import Guides from './pages/Guides';
import Disclaimer from './pages/Disclaimer';
import Corruption from './pages/Corruption';
import Settings from './pages/Settings';
import News from './pages/News';
import LegalDirectory from './pages/LegalDirectory';

const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Citizen',
  preferredLanguage: Language.ENGLISH,
  voiceName: 'Zephyr',
  speechRate: 1.0,
  autoSearch: true,
  deepThinkingDefault: false,
  themeColor: '#2563eb'
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('nagrikai_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('nyaayai_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('nagrikai_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('nyaayai_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FFFFFF';
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      const validPages: Page[] = ['home', 'chat', 'categories', 'guides', 'disclaimer', 'corruption', 'settings', 'news', 'directory'];
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleOpenKeyPicker = async () => {
    const studio = (window as any).aistudio;
    if (studio && typeof studio.openSelectKey === 'function') {
      await studio.openSelectKey();
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-white dark:bg-[#020617]">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        onToggleDark={toggleDarkMode}
        isDarkMode={isDarkMode}
        onOpenKeyPicker={handleOpenKeyPicker}
      />
      
      <main className="flex-grow container mx-auto px-2 md:px-4 py-4 md:py-6">
        {currentPage === 'home' && <Home onNavigate={navigateTo} />}
        {currentPage === 'chat' && (
          <Chat 
            settings={settings} 
            onUpdateSettings={setSettings}
          />
        )}
        {currentPage === 'corruption' && <Corruption />}
        {currentPage === 'categories' && <Categories onNavigate={navigateTo} />}
        {currentPage === 'guides' && <Guides />}
        {currentPage === 'disclaimer' && <Disclaimer />}
        {currentPage === 'news' && <News />}
        {currentPage === 'directory' && <LegalDirectory />}
        {currentPage === 'settings' && (
          <Settings 
            settings={settings} 
            onUpdateSettings={setSettings} 
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Hide footer on Chat page for full-screen feel */}
      {currentPage !== 'chat' && <Footer onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
