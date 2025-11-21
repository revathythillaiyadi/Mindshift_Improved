import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Maximize2, Minimize2, X } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/dashboard/Sidebar';
import ChatArea from '../components/dashboard/ChatArea';
import JournalArea from '../components/dashboard/JournalArea';
import SettingsPanel from '../components/dashboard/SettingsPanel';
import QuickMoodInput from '../components/dashboard/QuickMoodInput';
import AffirmationFooter from '../components/dashboard/AffirmationFooter';
import DashboardStats from '../components/dashboard/DashboardStats';
import RightPanelSections from '../components/dashboard/RightPanelSections';
import TreeRing from '../components/TreeRing';
import { useTheme } from '../contexts/ThemeContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { registerBackgroundAudio, updateOriginalVolume } from '../lib/audioDucking';

type View = 'chat' | 'journal' | 'settings';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<View>('chat');
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [isChatPoppedOut, setIsChatPoppedOut] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { preferences } = useUserPreferences();
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Handle ambient audio playback at Dashboard level (persists across views)
  useEffect(() => {
    if (!preferences) return;

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Play custom audio or preset sound
    const audioUrl = preferences.custom_audio_url && preferences.ambient_sound === 'custom'
      ? preferences.custom_audio_url
      : preferences.ambient_sound
        ? `/audio/${preferences.ambient_sound}.mp3` // Preset audio files
        : null;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      const volume = (preferences.sound_volume || 50) / 100;
      audio.volume = volume;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      audioRef.current = audio;
      
      // Register audio for ducking when AI speaks
      registerBackgroundAudio(audio);
      updateOriginalVolume(volume);

      return () => {
        audio.pause();
        audioRef.current = null;
        registerBackgroundAudio(null); // Unregister
      };
    } else {
      // No audio, unregister
      registerBackgroundAudio(null);
    }
  }, [preferences?.ambient_sound, preferences?.custom_audio_url, preferences?.sound_volume]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="flex h-screen bg-gradient-to-br from-warm-white via-mint-50/20 to-sage-50/30 dark:from-[#0a0f16] dark:via-[#0a0f16] dark:to-[#0a0f16] transition-colors relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 dark:opacity-70 z-0" style={{ zIndex: 0 }}>
          {/* Centered Tree Ring */}
          <TreeRing
            ringCount={15}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
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
        </div>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 flex flex-col overflow-hidden relative" style={{ zIndex: 10 }}>
          <DashboardHeader
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            darkMode={isDark}
            onDarkModeToggle={toggleTheme}
            onJournalClick={() => setCurrentView('journal')}
          />

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto flex flex-col">
              {/* Chat Window Section */}
              <div className="flex-shrink-0 p-6 pb-8">
                {currentView === 'chat' && !isChatPoppedOut && (
                  <div className="flex flex-col items-center max-w-5xl mx-auto">
                    {/* Centered Mood Board */}
                    <div className="mb-6 w-full max-w-md mx-auto">
                      <QuickMoodInput />
                    </div>
                    
                    {/* Chat Window with maximize button */}
                    <div className="w-full max-w-4xl relative">
                      <button
                        onClick={() => setIsChatPoppedOut(true)}
                        className="absolute -top-12 right-0 p-2 rounded-xl bg-sage-100 dark:bg-[#1c2533] hover:bg-sage-200 dark:hover:bg-[#2d3e52] transition-all text-sage-700 dark:text-[#00FFC8] hover:scale-105 shadow-md z-10"
                        title="Pop out chat window"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                      <ChatArea />
                    </div>
                  </div>
                )}
                {currentView === 'chat' && isChatPoppedOut && (
                  <div className="mb-6">
                    <QuickMoodInput />
                  </div>
                )}
                {currentView === 'journal' && <JournalArea />}
                {currentView === 'settings' && <SettingsPanel />}
              </div>

              {/* Dashboard Stats Section (Streak, Inspiration, Milestones) */}
              {currentView === 'chat' && (
                <div className="flex-shrink-0 border-t-2 border-sage-200/50 dark:border-[#283647] bg-gradient-to-b from-warm-white to-sage-50/30 dark:from-[#0a0f16] dark:to-[#0a0f16]">
                  <DashboardStats />
                </div>
              )}

              {/* Right Panel Sections (Mood Tracker, Weekly Reflection, Goals, Reminder, Achievements) */}
              {currentView === 'chat' && (
                <div className="flex-shrink-0 border-t-2 border-sage-200/50 dark:border-[#283647] bg-gradient-to-b from-sage-50/30 to-warm-white dark:from-[#0a0f16] dark:to-[#0a0f16]">
                  <RightPanelSections selectedRegion={selectedRegion} />
                </div>
              )}

              {/* Footer Section */}
              <div className="flex-shrink-0 border-t-2 border-sage-200/50 dark:border-[#283647] bg-white dark:bg-[#0a0f16]">
                <AffirmationFooter />
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Popup Chat Modal */}
      {isChatPoppedOut && currentView === 'chat' && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998] backdrop-blur-sm transition-opacity"
            onClick={() => setIsChatPoppedOut(false)}
          />
          
          {/* Popup Chat Window */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-4xl h-[90vh] max-h-[900px] pointer-events-auto animate-scale-in">
              <div className="relative w-full h-full">
                {/* Close/Pop-in Button */}
                <button
                  onClick={() => setIsChatPoppedOut(false)}
                  className="absolute -top-12 right-0 p-2 rounded-xl bg-white dark:bg-[#1c2533] hover:bg-sage-100 dark:hover:bg-[#2d3e52] transition-all text-sage-700 dark:text-[#00FFC8] shadow-lg hover:scale-110 z-10"
                  title="Pop in chat window"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                
                {/* Chat Area in Popup */}
                <div className="w-full h-full">
                  <ChatArea />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
