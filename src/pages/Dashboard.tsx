import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/dashboard/Sidebar';
import ChatArea from '../components/dashboard/ChatArea';
import JournalArea from '../components/dashboard/JournalArea';
import RightPanel from '../components/dashboard/RightPanel';
import SettingsPanel from '../components/dashboard/SettingsPanel';
import QuickMoodInput from '../components/dashboard/QuickMoodInput';
import AffirmationFooter from '../components/dashboard/AffirmationFooter';
import TreeRing from '../components/TreeRing';
import { useTheme } from '../contexts/ThemeContext';

type View = 'chat' | 'journal' | 'settings' | 'goals';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<View>('chat');
  const [selectedRegion, setSelectedRegion] = useState('US');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const tab = searchParams.get('tab');
    const view = searchParams.get('view');

    if (tab === 'journal') {
      setCurrentView('journal');
      setTimeout(() => {
        const textarea = document.querySelector('textarea[placeholder="Write your thoughts..."]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
        }
      }, 100);
    } else if (view === 'settings') {
      setCurrentView('settings');
    }
  }, [searchParams]);

  useEffect(() => {
    const mainContent = document.querySelector('main.flex-1.overflow-y-auto');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [currentView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainContent = document.querySelector('main.flex-1.overflow-y-auto');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="flex h-screen bg-gradient-to-br from-warm-white via-mint-50/20 to-sage-50/30 dark:from-[#0a0f16] dark:via-[#0a0f16] dark:to-[#0a0f16] transition-colors relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 dark:opacity-70 z-0">
          <TreeRing
            ringCount={15}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rotate-12"
          />
          <TreeRing
            ringCount={10}
            className="absolute top-1/4 -right-20 w-[350px] h-[350px] -rotate-6"
          />
          <TreeRing
            ringCount={12}
            className="absolute -bottom-28 left-1/4 w-[400px] h-[400px] rotate-45"
          />
          <TreeRing
            ringCount={8}
            className="absolute bottom-1/3 right-1/4 w-[280px] h-[280px] -rotate-12"
          />
          <TreeRing
            ringCount={6}
            className="absolute top-2/3 left-1/3 w-[200px] h-[200px] rotate-90"
          />
        </div>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <DashboardHeader
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            darkMode={isDark}
            onDarkModeToggle={toggleTheme}
            onJournalClick={() => setCurrentView('journal')}
          />

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6 flex flex-col">
              <div className="flex-1">
                {currentView === 'chat' && (
                  <div className="mb-6">
                    <QuickMoodInput />
                  </div>
                )}
                {currentView === 'chat' && <ChatArea />}
                {currentView === 'journal' && <JournalArea />}
                {currentView === 'settings' && <SettingsPanel />}
                {currentView === 'goals' && (
                  <div className="text-center text-gray-600 dark:text-white mt-20">
                    Goals & Progress view coming soon...
                  </div>
                )}
              </div>

              <AffirmationFooter />
            </main>

            <RightPanel selectedRegion={selectedRegion} />
          </div>
        </div>
      </div>
    </div>
  );
}
