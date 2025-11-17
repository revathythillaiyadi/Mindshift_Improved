import { useNavigate } from 'react-router-dom';
import TreeRing from './TreeRing';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-neutral-50 dark:bg-[#0a0f16] transition-colors">
      {/* Tree Rings Background */}
      <div className="absolute inset-0 overflow-hidden">
        <TreeRing
          ringCount={12}
          className="absolute top-20 -left-20 w-[400px] h-[400px] animate-breathing opacity-60"
        />
        <TreeRing
          ringCount={10}
          className="absolute -top-10 right-20 w-[300px] h-[300px] animate-breathing opacity-50"
          style={{ animationDelay: '2s' }}
        />
        <TreeRing
          ringCount={8}
          className="absolute bottom-10 right-1/4 w-[250px] h-[250px] animate-breathing opacity-45"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-sage-700 dark:text-white transition-colors">
            Hey, feeling a little heavy lately?
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto text-sage-500 dark:text-[#F0F4F8] font-light transition-colors">
            You're not alone. Let's reframe those thoughts and reshape your world.
          </p>

          {/* Call-to-Action Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="px-12 py-5 bg-gradient-to-r from-emerald to-emerald-600 dark:bg-[#00FFFF] text-white dark:text-[#0a0f16] text-lg font-semibold rounded-[28px] hover:from-emerald-600 hover:to-ocean-light dark:hover:bg-[#00E5E5] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(24,126,95,0.25)] dark:hover:shadow-[0_8px_35px_rgba(0,255,255,0.7)] hover:scale-105 active:scale-98 animate-pulse-gentle shadow-[0_4px_16px_rgba(24,126,95,0.2)] dark:shadow-[0_4px_25px_rgba(0,255,255,0.5)]"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
