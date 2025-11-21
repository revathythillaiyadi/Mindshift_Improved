import { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

const affirmations = [
  "You're exactly where you need to be on your journey. 🌱",
  "Every small step forward is worth celebrating. 🌟",
  "Your feelings are valid, and you're not alone. 💙",
  "Progress isn't always linear, and that's okay. 🌊",
  "You're stronger than you know. 💪",
  "Taking care of yourself is an act of courage. ☀️",
  "You deserve kindness, especially from yourself. 🌸",
  "Your journey is unique and valuable. 🦋",
  "It's okay to rest and recharge. 🌙",
  "You're doing better than you think you are. ✨",
];

export default function AffirmationFooter() {
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('affirmation-date');
    const storedAffirmation = localStorage.getItem('daily-affirmation');

    if (storedDate === today && storedAffirmation) {
      setDailyAffirmation(storedAffirmation);
    } else {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const affirmation = affirmations[dayOfYear % affirmations.length];
      setDailyAffirmation(affirmation);
      localStorage.setItem('affirmation-date', today);
      localStorage.setItem('daily-affirmation', affirmation);
    }
  }, []);

  return (
    <>
      <div className="pt-10 pb-10 px-5 text-center bg-gradient-to-b from-transparent to-[#F8FAF9] dark:to-[#2c4943] transition-colors">
        <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
          <Sparkles className="w-6 h-6 text-[#187E5F] dark:text-sage-400 mb-4 animate-pulse-gentle" strokeWidth={2} />
          <p className="text-base italic text-[#315545] dark:text-[#c4d9d3] leading-relaxed">
            {dailyAffirmation}
          </p>
        </div>
      </div>

      <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl transition-colors">
        <div className="px-6 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-forest to-sage-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <span className="font-bold text-lg text-forest dark:text-white lowercase">mindshift</span>
              </div>
              <p className="text-[13px] text-[#66887f] dark:text-gray-400 max-w-xs">
                Your companion for mental wellness
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm font-semibold text-forest dark:text-white mb-3 uppercase tracking-wide">
                Links
              </h3>
              <nav className="flex flex-col gap-2">
                <a
                  href="#"
                  className="text-[13px] text-[#66887f] dark:text-gray-400 hover:text-[#187E5F] dark:hover:text-sage-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-[13px] text-[#66887f] dark:text-gray-400 hover:text-[#187E5F] dark:hover:text-sage-400 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-[13px] text-[#66887f] dark:text-gray-400 hover:text-[#187E5F] dark:hover:text-sage-400 transition-colors"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-[13px] text-[#66887f] dark:text-gray-400 hover:text-[#187E5F] dark:hover:text-sage-400 transition-colors"
                >
                  Contact
                </a>
              </nav>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm font-semibold text-forest dark:text-white mb-3 uppercase tracking-wide">
                Need Help?
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:988"
                  className="text-[13px] text-[#66887f] dark:text-gray-400 hover:text-[#187E5F] dark:hover:text-sage-400 transition-colors font-medium"
                >
                  🇺🇸 US Crisis Line: 988
                </a>
                <a
                  href="sms:741741"
                  className="text-[13px] text-[#66887f] dark:text-gray-400 hover:text-[#187E5F] dark:hover:text-sage-400 transition-colors font-medium"
                >
                  💬 Crisis Text Line: 741741
                </a>
                <p className="text-xs text-[#a4c1c3] dark:text-gray-500 mt-2">
                  Available 24/7 for support
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-[#E8F5F0] dark:border-[#46644e]">
            <p className="text-xs text-[#a4c1c3] dark:text-gray-500">
              © 2025 MindShift. Made with 💚
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
