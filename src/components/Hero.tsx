import { useNavigate } from 'react-router-dom';
import TreeRing from './TreeRing';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-white">
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#1a3a2e]">
            hey, feeling a little heavy lately?
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto text-[#2d5f4f] font-light">
            you're not alone. let's reframe those thoughts and reshape your world.
          </p>

          {/* Call-to-Action Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="px-12 py-5 bg-[#2d5f4f] text-white text-lg font-medium rounded-full hover:bg-[#3d7f6f] transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
