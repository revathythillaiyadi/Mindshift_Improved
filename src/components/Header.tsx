import { Brain, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm z-50 transition-colors">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-1 rounded-lg">
              <Brain className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent tracking-tight" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif" }}>
              MindShift
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">About Us</a>
            <a href="#services" className="text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Services</a>
            <a href="#resources" className="text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Resources</a>
            <a href="#how-it-works" className="text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">How it Works</a>
            <a href="#faqs" className="text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">FAQs</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            <Link to="/login" className="px-4 py-2 text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:shadow-lg font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
