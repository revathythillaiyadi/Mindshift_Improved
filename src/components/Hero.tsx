import { QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-gradient-to-br from-warm-white via-lavender-50/30 to-blush-50/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-lavender-200/30 to-blush-200/20 rounded-full blur-3xl animate-breathing"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-sage-200/25 to-mint-200/25 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-paleblue-200/20 to-lavender-200/20 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="block text-soft-gray mb-3">hey, feeling a little</span>
              <span className="block bg-gradient-to-r from-sage-400 via-lavender-400 to-blush-300 bg-clip-text text-transparent">
                heavy lately?
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gentle-gray/80 leading-relaxed max-w-3xl mx-auto font-serif italic" style={{ animationDelay: '0.2s' }}>
              you're not alone. we're here to listen.
            </p>

            <div className="flex items-center justify-center gap-4 text-soft-gray/60 text-sm font-light pt-2" style={{ animationDelay: '0.4s' }}>
              <span className="hidden sm:block">→</span>
              <span>find your calm</span>
              <span className="hidden sm:block">·</span>
              <span>you're safe here</span>
              <span className="hidden sm:block">←</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-sage-100/30 max-w-xl mx-auto animate-fade-in hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '0.6s' }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-soft-gray">take your first gentle step</h3>
                <p className="text-sm text-gentle-gray/70">we'll be right here with you</p>
              </div>

              <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your email address"
                    className="flex-1 px-6 py-4 rounded-[2rem] border-2 border-sage-200/50 focus:outline-none focus:ring-2 focus:ring-lavender-300/50 focus:border-transparent transition-all text-soft-gray placeholder:text-gentle-gray/40 bg-white/80"
                    required
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group px-8 py-4 bg-gradient-to-r from-sage-400 to-mint-400 text-white rounded-[2rem] hover:from-sage-500 hover:to-mint-500 transition-all hover:shadow-lg font-medium flex items-center justify-center gap-2 relative overflow-hidden"
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
                  <span className="text-xs text-gentle-gray/50 lowercase">or scan to start</span>
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

          <div className="flex items-center justify-center gap-2 text-gentle-gray/50 text-sm animate-pulse-gentle">
            <Sparkles className="w-4 h-4" />
            <span className="lowercase italic">healing starts with kindness</span>
          </div>
        </div>
      </div>
    </section>
  );
}
