import { Moon, Sun, User, ChevronDown, LogOut, Settings, UserCircle, BookOpen, Flag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface DashboardHeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onJournalClick?: () => void;
}

const regions = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];

function getTimeBasedGreeting(name: string): { text: string; emoji: string } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { text: `Good morning, ${name}!`, emoji: '👋' };
  } else if (hour >= 12 && hour < 17) {
    return { text: `Good afternoon, ${name}!`, emoji: '👋' };
  } else if (hour >= 17 && hour < 21) {
    return { text: `Good evening, ${name}!`, emoji: '🌙' };
  } else {
    return { text: `Still up, ${name}? Take care of yourself`, emoji: '💙' };
  }
}

export default function DashboardHeader({
  selectedRegion,
  onRegionChange,
  darkMode,
  onDarkModeToggle,
  onJournalClick,
}: DashboardHeaderProps) {
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [greeting, setGreeting] = useState<{ text: string; emoji: string }>({ text: '', emoji: '' });
  const [fadeIn, setFadeIn] = useState(false);
  const regionMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavigateToProfile = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleNavigateToSettings = () => {
    setShowProfileMenu(false);
    navigate('/dashboard?view=settings');
  };

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (data && data.full_name) {
          const firstName = data.full_name.split(' ')[0];
          setUserName(firstName);
          setGreeting(getTimeBasedGreeting(firstName));
        } else {
          setUserName('there');
          setGreeting(getTimeBasedGreeting('there'));
        }

        setTimeout(() => setFadeIn(true), 50);
      }
    }

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionMenuRef.current && !regionMenuRef.current.contains(event.target as Node)) {
        setShowRegionMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-6 py-4 transition-colors relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-sage-600 to-mint-600 dark:from-sage-400 dark:to-mint-400 bg-clip-text text-transparent">
            MindShift: Your Space for Growth
          </h1>
          {greeting.text && (
            <p
              className={`text-base font-normal text-soft-gray dark:text-gray-300 transition-opacity duration-700 flex items-center gap-1 ${
                fadeIn ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span>{greeting.text}</span>
              <span className="ml-1">{greeting.emoji}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onJournalClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 hover:from-[#0B5844] hover:to-[#187E5F] font-medium"
            title="Open Journal"
          >
            <BookOpen className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm">Journal</span>
          </button>

          <div className="relative" ref={regionMenuRef}>
            <button
              onClick={() => setShowRegionMenu(!showRegionMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Flag className="w-4 h-4 text-sage-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-sm font-medium text-soft-gray dark:text-gray-200">
                {regions.find(r => r.code === selectedRegion)?.name || 'Select Region'}
              </span>
              <ChevronDown className="w-4 h-4 text-sage-500 dark:text-gray-400" strokeWidth={2} />
            </button>

            {showRegionMenu && (
              <div className="fixed right-6 mt-14 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-sage-200 dark:border-gray-600 py-3 z-[1000]">
                {regions.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => {
                      onRegionChange(region.code);
                      setShowRegionMenu(false);
                    }}
                    className={`w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all rounded-xl mx-2 text-base ${
                      selectedRegion === region.code ? 'bg-sage-100 dark:bg-gray-700 text-forest dark:text-sage-400 font-semibold' : 'text-soft-gray dark:text-gray-200'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onDarkModeToggle}
            className="w-10 h-10 flex items-center justify-center rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2} />
            ) : (
              <Moon className="w-5 h-5 text-sage-600" strokeWidth={2} />
            )}
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50/50 dark:hover:bg-gray-700/50 transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-mint-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
            </button>

            {showProfileMenu && (
              <div className="fixed right-6 mt-14 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-sage-200 dark:border-gray-600 py-3 z-[1000]">
                <button
                  onClick={handleNavigateToProfile}
                  className="w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all text-soft-gray dark:text-gray-200 flex items-center gap-3 rounded-xl mx-2 text-base"
                >
                  <UserCircle className="w-5 h-5" strokeWidth={2} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleNavigateToSettings}
                  className="w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all text-soft-gray dark:text-gray-200 flex items-center gap-3 rounded-xl mx-2 text-base"
                >
                  <Settings className="w-5 h-5" strokeWidth={2} />
                  <span>Account Settings</span>
                </button>
                <div className="my-3 h-px bg-sage-200 dark:bg-gray-600 mx-4"></div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-red-600 dark:text-red-400 flex items-center gap-3 font-semibold rounded-xl mx-2 text-base"
                >
                  <LogOut className="w-5 h-5" strokeWidth={2} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
