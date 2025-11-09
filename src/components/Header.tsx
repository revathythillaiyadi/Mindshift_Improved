import { Brain, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="liquid-glass-header">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="liquid-glass-logo-container">
                <Brain className="w-9 h-9 text-sage-700" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-forest to-sage-700 bg-clip-text text-transparent tracking-tight">
                MindShift
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="liquid-glass-nav-link">About Us</a>
              <a href="#services" className="liquid-glass-nav-link">Services</a>
              <a href="#resources" className="liquid-glass-nav-link">Resources</a>
              <a href="#how-it-works" className="liquid-glass-nav-link">How it Works</a>
              <a href="#faqs" className="liquid-glass-nav-link">FAQs</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-sage-100/30 transition-all duration-300 liquid-glass-icon-button"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-sage-700" /> : <Moon className="w-5 h-5 text-sage-700" />}
              </button>
              <Link to="/login" className="px-4 py-2 text-forest/80 hover:text-sage-700 transition-all duration-300 font-medium relative overflow-hidden group">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-sage-100/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></div>
              </Link>
              <Link to="/signup" className="liquid-glass-button">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
