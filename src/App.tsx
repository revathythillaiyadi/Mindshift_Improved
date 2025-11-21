import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import MeetNira from './components/MeetNira';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import LiveStatsCounter from './components/LiveStatsCounter';
import BreathingExercise from './components/BreathingExercise';
import SafetyGuarantee from './components/SafetyGuarantee';
import AboutUs from './components/AboutUs';
import Resources from './components/Resources';
import FAQs from './components/FAQs';
import BetaSignup from './components/BetaSignup';
import Footer from './components/Footer';
import { useTheme } from './contexts/ThemeContext';

// Placeholder components
function DashboardView({ navigate, isDark, toggleTheme }: { navigate: ReturnType<typeof useNavigate>; isDark: boolean; toggleTheme: () => void }) {
  return (
    <div className="min-h-screen bg-warm-white dark:bg-gray-900 transition-colors scroll-smooth">
      <Header isDark={isDark} setIsDark={toggleTheme} />
      <main>
        <Hero />
        <MeetNira />
        <HowItWorks />
        <Services />
        <LiveStatsCounter />
        <BreathingExercise />
        <SafetyGuarantee />
        <AboutUs />
        <Resources />
        <FAQs />
        <BetaSignup />
      </main>
      <Footer />
    </div>
  );
}

function NewEntryView({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="min-h-screen bg-warm-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">New Entry</h1>
        <p className="text-gray-600">New entry view placeholder</p>
      </div>
    </div>
  );
}

function ViewEntryView({ entryId, navigate }: { entryId?: string; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="min-h-screen bg-warm-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">View Entry</h1>
        <p className="text-gray-600">View entry view placeholder</p>
        {entryId && <p className="text-sm text-gray-500 mt-2">Entry ID: {entryId}</p>}
      </div>
    </div>
  );
}

type ViewState = 
  | { name: 'Dashboard' }
  | { name: 'NewEntry' }
  | { name: 'ViewEntry'; entryId: string };

function App() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewState>({ name: 'Dashboard' });

  // Main return block with switch statement
  switch (currentView.name) {
    case 'Dashboard':
      return <DashboardView navigate={navigate} isDark={isDark} toggleTheme={toggleTheme} />;
    
    case 'NewEntry':
      return <NewEntryView navigate={navigate} />;
    
    case 'ViewEntry':
      return <ViewEntryView entryId={currentView.entryId} navigate={navigate} />;
    
    default:
      return <DashboardView navigate={navigate} isDark={isDark} toggleTheme={toggleTheme} />;
  }
}

export default App;
