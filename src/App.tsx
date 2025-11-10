import Header from './components/Header';
import Hero from './components/Hero';
import MeetNira from './components/MeetNira';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import AboutUs from './components/AboutUs';
import Resources from './components/Resources';
import FAQs from './components/FAQs';
import SafetyGuarantee from './components/SafetyGuarantee';
import Footer from './components/Footer';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-warm-white dark:bg-gray-900 transition-colors">
      <Header isDark={isDark} setIsDark={toggleTheme} />
      <main>
        <Hero />
        <MeetNira />
        <HowItWorks />
        <Services />
        <SafetyGuarantee />
        <AboutUs />
        <Resources />
        <FAQs />
      </main>
      <Footer />
    </div>
  );
}

export default App;
