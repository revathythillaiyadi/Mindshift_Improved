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

function App() {
  const { isDark, toggleTheme } = useTheme();

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

export default App;
