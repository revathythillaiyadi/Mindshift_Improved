import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden hero-section">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <img
          src="/unnamed copy copy.jpg"
          alt="Person sitting peacefully on bench in serene park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-amber-800/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-transparent to-transparent"></div>

        {/* Liquid glass overlay effect */}
        <div className="absolute inset-0 liquid-glass-overlay"></div>
      </div>

      {/* Floating liquid glass orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 liquid-glass-orb animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-32 right-20 w-40 h-40 liquid-glass-orb animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 liquid-glass-orb animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline with liquid glass backing */}
          <div className="liquid-glass-content-card p-8 rounded-[3rem]">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-amber-50 drop-shadow-2xl">
              hey, feeling a little heavy lately?
            </h1>
          </div>

          {/* Sub-headline */}
          <div className="liquid-glass-content-card p-6 rounded-[2.5rem]">
            <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto text-amber-50/95 font-light drop-shadow-lg">
              you're not alone. let's reframe those thoughts and reshape your world.
            </p>
          </div>

          {/* Call-to-Action Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="liquid-glass-cta-button"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Seamless transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-amber-50/30 to-amber-50/80 pointer-events-none"></div>
    </section>
  );
}
