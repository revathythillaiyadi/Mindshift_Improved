import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import AboutUs from './components/AboutUs';
import Resources from './components/Resources';
import FAQs from './components/FAQs';
import SafetyGuarantee from './components/SafetyGuarantee';
import Footer from './components/Footer';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header isDark={isDark} setIsDark={setIsDark} />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <AboutUs />
        <Resources />
        <FAQs />
        <SafetyGuarantee />
      </main>
      <Footer />
    </div>
  );
}

export default App;
