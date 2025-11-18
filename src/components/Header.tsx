import { Brain, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  setIsDark: () => void;
}

// Define your new color constants for consistency
const darkAccent = '#5a7f6a'; // New dark mode green/sage color
const orangeAccent = '#f7941d'; // Orange accent for the gradient end
const blueAccent = '#3B82F6'; // Blue accent for brain logo

export default function Header({ isDark, setIsDark }: HeaderProps) {
  // Component to render the Brain icon with rounded square background similar to login page
  const GradientBrainIcon = () => (
    <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[0.75rem] flex items-center justify-center shadow-lg">
      <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-[#141b26] backdrop-blur-sm border-b border-emerald-50 dark:border-[#283647] z-50 transition-colors">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo area - Brain icon with gradient background */}
            <GradientBrainIcon />
            {/* MindShift Text - Split into two parts with separate colors */}
            <span className="text-2xl font-bold tracking-tight transition-colors">
              <span className={`text-[${darkAccent}] dark:text-[${darkAccent}]`}>Mind</span>
              <span className={`text-[${orangeAccent}] dark:text-[${orangeAccent}]`}>Shift</span>
            </span>
          </div>

          {/* Navigation Links - Font size increased to text-lg for better legibility */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Links use the new darkAccent color for hover */}
            <a href="#about" className={`text-lg text-sage-600 dark:text-[#F0F4F8] hover:text-[${darkAccent}] dark:hover:text-[${darkAccent}] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4`}>About Us</a>
            <a href="#services" className={`text-lg text-sage-600 dark:text-[#F0F4F8] hover:text-[${darkAccent}] dark:hover:text-[${darkAccent}] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4`}>Services</a>
            <a href="#resources" className={`text-lg text-sage-600 dark:text-[#F0F4F8] hover:text-[${darkAccent}] dark:hover:text-[${darkAccent}] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4`}>Resources</a>
            <a href="#how-it-works" className={`text-lg text-sage-600 dark:text-[#F0F4F8] hover:text-[${darkAccent}] dark:hover:text-[${darkAccent}] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4`}>How it Works</a>
            <a href="#faqs" className={`text-lg text-sage-600 dark:text-[#F0F4F8] hover:text-[${darkAccent}] dark:hover:text-[${darkAccent}] transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4`}>FAQs</a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button - Changed Moon icon color to match darkAccent in light mode */}
            <button
              onClick={setIsDark}
              className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-[#1c2533] transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-[${darkAccent}]" /> : <Moon className="w-5 h-5 text-sage-500" />}
            </button>
            {/* Login Button - Brighter green with white text */}
            <Link to="/login" className="px-6 py-2 text-[#5a7f6a] dark:text-white text-lg border border-emerald-500 dark:border-mint-500 bg-transparent hover:bg-emerald-500/10 dark:hover:bg-mint-500/10 rounded-[20px] transition-all duration-200 font-medium">
              Login
            </Link>
            {/* Sign Up Button - Brighter green gradient with white text */}
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-mint-500 dark:from-emerald-500 dark:to-mint-500 text-white rounded-[20px] hover:from-emerald-600 hover:to-mint-600 dark:hover:from-emerald-600 dark:hover:to-mint-600 transition-all duration-200 hover:shadow-lg shadow-[0_4px_12px_rgba(16,185,129,0.3)] dark:shadow-[0_4px_16px_rgba(16,185,129,0.4)] font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}