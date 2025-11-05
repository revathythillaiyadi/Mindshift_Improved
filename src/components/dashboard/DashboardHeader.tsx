import { Moon, Sun, User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useState } from 'react';
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
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
            NIRA Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowRegionMenu(!showRegionMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {regions.find(r => r.code === selectedRegion)?.name || 'Select Region'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showRegionMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700 py-2 z-50">
                {regions.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => {
                      onRegionChange(region.code);
                      setShowRegionMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedRegion === region.code ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
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
            className="p-2 rounded-lg border border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 rounded-lg border border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700 py-2 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 flex items-center gap-3">
                  <UserCircle className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </button>
                <hr className="my-2 border-blue-100 dark:border-gray-700" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 flex items-center gap-3 font-medium"
                >
                  <LogOut className="w-4 h-4" />
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
