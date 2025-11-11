import { Moon, Sun, User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardHeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
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

export default function DashboardHeader({
  selectedRegion,
  onRegionChange,
  darkMode,
  onDarkModeToggle,
}: DashboardHeaderProps) {
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const regionMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sage-600 to-mint-600 dark:from-sage-400 dark:to-mint-400 bg-clip-text text-transparent lowercase">
            mindshift dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={regionMenuRef}>
            <button
              onClick={() => setShowRegionMenu(!showRegionMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors lowercase"
            >
              <span className="text-sm font-medium text-soft-gray dark:text-gray-200">
                {regions.find(r => r.code === selectedRegion)?.name || 'Select Region'}
              </span>
              <ChevronDown className="w-4 h-4 text-sage-500 dark:text-gray-400" />
            </button>

            {showRegionMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-sage-200 dark:border-gray-600 py-3 z-[1000]">
                {regions.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => {
                      onRegionChange(region.code);
                      setShowRegionMenu(false);
                    }}
                    className={`w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all rounded-xl mx-2 text-base lowercase ${
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
            className="p-2 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-sage-600" />
            )}
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-mint-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-sage-200 dark:border-gray-600 py-3 z-[1000]">
                <button className="w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all text-soft-gray dark:text-gray-200 flex items-center gap-3 rounded-xl mx-2 lowercase text-base">
                  <UserCircle className="w-5 h-5" />
                  <span>my profile</span>
                </button>
                <button className="w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all text-soft-gray dark:text-gray-200 flex items-center gap-3 rounded-xl mx-2 lowercase text-base">
                  <Settings className="w-5 h-5" />
                  <span>account settings</span>
                </button>
                <div className="my-3 h-px bg-sage-200 dark:bg-gray-600 mx-4"></div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-red-600 dark:text-red-400 flex items-center gap-3 font-semibold rounded-xl mx-2 lowercase text-base"
                >
                  <LogOut className="w-5 h-5" />
                  <span>log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
