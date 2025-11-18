import { UserPlus, MessageCircle, RefreshCw, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const steps = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create your secure space and begin your journey to mental wellness in minutes.',
    icon: UserPlus,
  },
  {
    number: 2,
    title: 'Start Chatting',
    description: 'Connect with NIRA, your companion who listens without judgment and guides with empathy.',
    icon: MessageCircle,
  },
  {
    number: 3,
    title: 'Reframe',
    description: 'Learn to transform negative thought patterns into constructive perspectives.',
    icon: RefreshCw,
  },
  {
    number: 4,
    title: 'Record Your Journey',
    description: 'Capture your progress with gentle journaling that helps you reflect and grow.',
    icon: BookOpen,
  },
  {
    number: 5,
    title: 'Monitor Growth',
    description: 'Track your progress and celebrate your achievements along the way.',
    icon: TrendingUp,
  },
  {
    number: 6,
    title: 'Reach Help',
    description: 'Access immediate support and emergency resources whenever you need it.',
    icon: AlertCircle,
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
            }
          });
        },
        { threshold: 0.5, rootMargin: '-100px 0px' }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pathLength = pathRef.current?.getTotalLength() || 1000;

  const getPathPointAtDistance = (distance: number) => {
    if (!pathRef.current) return { x: 50, y: 20 };
    const point = pathRef.current.getPointAtLength(distance);
    return { x: (point.x / 1000) * 100, y: (point.y / 1000) * 100 };
  };

  const getStepPosition = (index: number) => {
    const isLeft = index % 2 === 0;
    return {
      isLeft
    };
  };

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-32 px-6 bg-gradient-to-b from-warm-white via-sage-50/30 to-mint-50/20 overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: '100%', maxWidth: '1200px', height: '100%' }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(107, 138, 107, 0.15))' }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#88a788" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#5dd4ac" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6b8a6b" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path
            ref={pathRef}
            d="M 200 50 Q 150 120, 180 180 Q 210 240, 350 280 Q 490 320, 600 380 Q 710 440, 750 520 Q 790 600, 720 660 Q 650 720, 580 750 Q 510 780, 460 840 Q 410 900, 480 940 Q 550 980, 500 1000"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 5"
            opacity="0.3"
            className="transition-all duration-700"
          />

          <path
            d="M 200 50 Q 150 120, 180 180 Q 210 240, 350 280 Q 490 320, 600 380 Q 710 440, 750 520 Q 790 600, 720 660 Q 650 720, 580 750 Q 510 780, 460 840 Q 410 900, 480 940 Q 550 980, 500 1000"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - scrollProgress)}
            filter="url(#glow)"
            className="transition-all duration-300 ease-out"
            style={{ opacity: 0.7 }}
          />

          {steps.map((_, index) => {
            const position = getStepPosition(index);
            const isActive = index <= activeStep;
            const progress = (index + 1) / (steps.length + 1);
            const isVisible = scrollProgress >= progress - 0.1;
            const pathProgress = progress * pathLength;
            const footprintPoint = getPathPointAtDistance(pathProgress);

            return (
              <g key={index} className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <circle
                  cx={(position.x / 100) * 1000}
                  cy={(position.y / 100) * 1000}
                  r="8"
                  fill={isActive ? '#6b8a6b' : '#d1ddd1'}
                  className="transition-all duration-500"
                />
                <circle
                  cx={(position.x / 100) * 1000}
                  cy={(position.y / 100) * 1000}
                  r="14"
                  fill="none"
                  stroke={isActive ? '#6b8a6b' : '#d1ddd1'}
                  strokeWidth="2"
                  opacity="0.4"
                  className="transition-all duration-500"
                  style={{
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${(position.x / 100) * 1000}px ${(position.y / 100) * 1000}px`,
                  }}
                />
                {isActive && (
                  <>
                    <circle
                      cx={(position.x / 100) * 1000 - 10}
                      cy={(position.y / 100) * 1000 - 15}
                      r="4"
                      fill="#fbbf24"
                      opacity="0.7"
                      className="animate-unfurl-leaf"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <circle
                      cx={(position.x / 100) * 1000 + 12}
                      cy={(position.y / 100) * 1000 - 10}
                      r="4"
                      fill="#60a5fa"
                      opacity="0.7"
                      className="animate-unfurl-leaf"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </>
                )}
              </g>
            );
          })}

          {/* Footprints along the path */}
          {Array.from({ length: 18 }).map((_, idx) => {
            const stepProgress = (idx + 0.5) / 18;
            const distance = stepProgress * pathLength;
            const point = getPathPointAtDistance(distance);
            const isLeft = idx % 2 === 0;
            const offset = isLeft ? -25 : 25;
            const isVisible = scrollProgress >= stepProgress - 0.05;
            const rotation = isLeft ? -30 : 30;

            return (
              <g
                key={`footprint-${idx}`}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transformOrigin: `${(point.x / 100) * 1000 + offset}px ${(point.y / 100) * 1000}px`,
                  animation: isVisible ? 'footprintAppear 0.6s ease-out' : 'none',
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                {/* Main footprint sole */}
                <ellipse
                  cx={(point.x / 100) * 1000 + offset}
                  cy={(point.y / 100) * 1000}
                  rx="10"
                  ry="16"
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="1"
                  className="dark:fill-emerald-500 dark:stroke-emerald-600"
                  transform={`rotate(${rotation} ${(point.x / 100) * 1000 + offset} ${(point.y / 100) * 1000})`}
                />

                {/* Heel */}
                <ellipse
                  cx={(point.x / 100) * 1000 + offset}
                  cy={(point.y / 100) * 1000 + 12}
                  rx="9"
                  ry="8"
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="1"
                  className="dark:fill-emerald-500 dark:stroke-emerald-600"
                  transform={`rotate(${rotation} ${(point.x / 100) * 1000 + offset} ${(point.y / 100) * 1000 + 12})`}
                />

                {/* Toes - more defined */}
                {[-4, 0, 4].map((toeOffset, toeIdx) => (
                  <ellipse
                    key={`toe-${toeIdx}`}
                    cx={(point.x / 100) * 1000 + offset + toeOffset}
                    cy={(point.y / 100) * 1000 - 14}
                    rx="3"
                    ry="4"
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth="0.5"
                    className="dark:fill-emerald-500 dark:stroke-emerald-600"
                    transform={`rotate(${rotation} ${(point.x / 100) * 1000 + offset + toeOffset} ${(point.y / 100) * 1000 - 14})`}
                  />
                ))}

                {/* Arch detail */}
                <ellipse
                  cx={(point.x / 100) * 1000 + offset}
                  cy={(point.y / 100) * 1000 + 2}
                  rx="6"
                  ry="10"
                  fill="rgba(255, 255, 255, 0.15)"
                  className="dark:fill-white/10"
                  transform={`rotate(${rotation} ${(point.x / 100) * 1000 + offset} ${(point.y / 100) * 1000 + 2})`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="container mx-auto max-w-7xl relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-forest dark:text-[#1e2936] transition-colors">
              Your Path to Growth
            </h2>
          </div>
          <p className="text-lg text-gentle-gray/70 dark:text-[#1e2936] max-w-2xl mx-auto font-serif italic">
            Like a vine reaching toward the sun, each step winds naturally along your journey toward wellness.
          </p>
        </div>

        <div className="space-y-0 pb-32 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const position = getStepPosition(index);
            const isActive = index === activeStep;
            const hasBeenActive = index <= activeStep;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative">
                <div
                  ref={(el) => (stepRefs.current[index] = el)}
                  className="flex justify-center items-center relative"
                  style={{ minHeight: '40vh', paddingTop: index === 0 ? '0' : '8vh', paddingBottom: '8vh' }}
                >
                  <div
                    className="transition-all duration-700 ease-out relative z-10"
                    style={{
                      transform: `translateX(${position.isLeft ? '-25%' : '25%'}) scale(${isActive ? 1 : hasBeenActive ? 0.95 : 0.85})`,
                      opacity: hasBeenActive ? 1 : 0.3,
                    }}
                  >
                  <div
                    className={`bg-white/80 dark:bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-xl border-2 transition-all relative w-80 group hover:shadow-2xl hover:-translate-y-1 ${
                      isActive
                        ? 'border-sage-400/60 shadow-sage-200/50'
                        : hasBeenActive
                        ? 'border-sage-300/30'
                        : 'border-sage-200 dark:border-gray-600/20'
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="absolute -top-5 -left-5 w-16 h-16 bg-gradient-to-br from-sage-500 to-mint-500 dark:from-emerald-500 dark:to-mint-500 rounded-[1.5rem] flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>


                    <div className="flex items-center gap-2 mb-4 pt-6">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          isActive ? 'bg-sage-50 dark:bg-emerald-400 animate-pulse' : hasBeenActive ? 'bg-sage-400 dark:bg-emerald-500' : 'bg-sage-200 dark:bg-emerald-300'
                        }`} />
                        <span className="text-xs font-bold text-forest/50 dark:text-[#1e2936]/70 uppercase tracking-wider">
                          Step {step.number}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-forest dark:text-[#1e2936] mb-4 leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-gentle-gray/80 dark:text-[#1e2936]/80 leading-relaxed text-base">
                      {step.description}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sage-400/20 via-mint-400/20 to-sage-400/20 dark:from-emerald-400/20 dark:via-mint-400/20 dark:to-emerald-400/20 rounded-b-[2rem] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sage-500 to-mint-500 dark:from-emerald-500 dark:to-mint-500 transition-all duration-700 ease-out"
                        style={{ width: isActive ? '100%' : hasBeenActive ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="absolute left-1/2 -translate-x-1/2 z-0" style={{ top: '70%', width: '200px', height: '160px' }}>
                    <svg width="200" height="160" viewBox="0 0 200 160" className="overflow-visible">
                      <defs>
                        <linearGradient id={`connector-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#6b8a6b" stopOpacity={hasBeenActive ? "0.8" : "0.2"} />
                          <stop offset="50%" stopColor="#7fb69e" stopOpacity={hasBeenActive ? "0.8" : "0.2"} />
                          <stop offset="100%" stopColor="#6b8a6b" stopOpacity={hasBeenActive ? "0.8" : "0.2"} />
                        </linearGradient>
                      </defs>

                      <path
                        d={position.isLeft
                          ? "M 60 0 Q 20 40, 40 80 Q 60 120, 100 160"
                          : "M 140 0 Q 180 40, 160 80 Q 140 120, 100 160"
                        }
                        fill="none"
                        stroke={`url(#connector-gradient-${index})`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="transition-all duration-700"
                        style={{
                          strokeDasharray: hasBeenActive ? "none" : "10 5",
                          filter: hasBeenActive ? "drop-shadow(0 2px 4px rgba(107, 138, 107, 0.3))" : "none",
                        }}
                      />

                      <circle
                        cx={position.isLeft ? "60" : "140"}
                        cy="0"
                        r="5"
                        fill="#6b8a6b"
                        className="transition-all duration-500"
                        style={{ opacity: hasBeenActive ? 1 : 0.3 }}
                      />

                      <circle
                        cx="100"
                        cy="160"
                        r="5"
                        fill="#7fb69e"
                        className="transition-all duration-500"
                        style={{
                          opacity: hasBeenActive && index < activeStep ? 1 : 0.3,
                          transform: `scale(${hasBeenActive && index < activeStep ? 1.2 : 1})`,
                          transformOrigin: 'center',
                        }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
