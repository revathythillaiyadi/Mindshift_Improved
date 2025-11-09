import { QrCode, ArrowRight, Heart } from 'lucide-react';
import MoodIcon from './MoodIcon';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const navigate = useNavigate();

  const phrases = ['find your calm', "you're safe here"];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let charIndex = 0;
    setTypingText('');

    const typingInterval = setInterval(() => {
      if (charIndex <= currentPhrase.length) {
        setTypingText(currentPhrase.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentPhraseIndex]);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-gradient-to-br from-warm-white via-sage-50/40 to-mint-50/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-sage-200/30 to-mint-200/25 rounded-full blur-3xl animate-breathing"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-mint-200/30 to-sage-200/25 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-beige-200/15 to-sage-200/20 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '6s' }}></div>

        <div className="absolute top-10 left-1/4 w-16 h-16 opacity-70 animate-float">
          <MoodIcon mood="happy" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute top-32 right-1/4 w-12 h-12 opacity-65 animate-float">
          <MoodIcon mood="calm" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute bottom-20 left-1/3 w-14 h-14 opacity-75 animate-float">
          <MoodIcon mood="creative" style={{ animationDelay: '2.5s' }} />
        </div>
        <div className="absolute bottom-32 right-1/3 w-10 h-10 opacity-60 animate-float">
          <MoodIcon mood="energetic" style={{ animationDelay: '3.5s' }} />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="block text-soft-gray mb-3">hey, feeling a little</span>
              <span className="block text-forest">
                heavy lately?
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-forest leading-relaxed max-w-3xl mx-auto font-serif animate-fade-in" style={{ animationDelay: '0.2s' }}>
              you're not alone. let's reframe those thoughts and reshape your world.
            </p>

            <div className="flex items-center justify-center gap-3 text-forest text-sm font-light pt-2" style={{ animationDelay: '0.4s' }}>
              <Heart className="w-4 h-4" />
              <span className="min-w-[140px] text-center">{typingText}<span className="animate-pulse">|</span></span>
              <Heart className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-sage-100/30 max-w-xl mx-auto animate-fade-in hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '0.6s' }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-forest">take your first gentle step</h3>
                <p className="text-sm text-forest/70">we'll be right here with you</p>
              </div>

              <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your email address"
                    className="flex-1 px-6 py-4 rounded-[2rem] border border-forest focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all text-soft-gray placeholder:text-gentle-gray/50 bg-white"
                    required
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group px-8 py-4 bg-forest text-white rounded-[2rem] hover:bg-forest-light transition-all hover:shadow-lg font-medium flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    <span className={`transition-all duration-300 ${isHovered ? 'transform translate-x-1' : ''}`}>
                      begin
                    </span>
                    <ArrowRight className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} />
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-r from-lavender-400/20 to-blush-300/20 animate-pulse-gentle"></div>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-sage-200/40"></div>
                  <span className="text-xs text-forest/60 lowercase">or scan to start</span>
                  <div className="flex-1 border-t border-sage-200/40"></div>
                </div>

                <div className="flex justify-center">
                  <div className="p-5 bg-sage-50/60 rounded-[2rem] backdrop-blur-sm border border-sage-100/30">
                    <QrCode className="w-20 h-20 text-sage-500/70" strokeWidth={1.5} />
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
