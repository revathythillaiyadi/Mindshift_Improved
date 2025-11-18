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
  // Component to render the Brain icon with the defined horizontal gradient
  const GradientBrainIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {/* Start color: Green (Left side) */}
          <stop offset="0%" style={{ stopColor: darkAccent, stopOpacity: 1 }} />
          {/* End color: Blue (Right side) */}
          <stop offset="100%" style={{ stopColor: blueAccent, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Use Brain from lucide-react, but apply the SVG structure and fill property */}
      <Brain className="w-9 h-9" strokeWidth={2.5} style={{ stroke: 'url(#brainGradient)' }} />
    </svg>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-[#141b26] backdrop-blur-sm border-b border-emerald-50 dark:border-[#283647] z-50 transition-colors">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo area - Container for the gradient icon */}
            <div className="p-1 rounded-pebble transition-colors shadow-lg">
              <GradientBrainIcon />
            </div>
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
            {/* Login Button - Uses the new darkAccent color for text and border */}
            <Link to="/login" className={`px-6 py-2 text-emerald dark:text-[${darkAccent}] border border-emerald dark:border-[${darkAccent}] hover:bg-emerald-50 dark:hover:bg-[#1c2533] rounded-[20px] transition-all duration-200 font-medium`}>
              Login
            </Link>
            {/* Sign Up Button - Uses the new darkAccent color for background */}
            <Link to="/signup" className={`px-6 py-2 bg-emerald dark:bg-[${darkAccent}] text-white dark:text-[#0a0f16] rounded-[20px] hover:bg-emerald-600 dark:hover:bg-[${darkAccent}] transition-all duration-200 hover:shadow-lg dark:shadow-[0_0_20px_rgba(90,127,106,0.5)] font-medium`}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}