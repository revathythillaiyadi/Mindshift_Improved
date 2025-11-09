import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/unnamed copy copy.jpg"
          alt="Person sitting peacefully on bench in serene park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-amber-950/30"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-amber-50 drop-shadow-lg">
            hey, feeling a little heavy lately?
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto text-amber-50/95 font-light drop-shadow">
            you're not alone. let's reframe those thoughts and reshape your world.
          </p>

          {/* Call-to-Action Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="px-12 py-5 bg-amber-700 text-amber-50 text-lg font-medium rounded-full hover:bg-amber-600 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/30 hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
