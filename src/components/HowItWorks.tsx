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
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

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
        { threshold: 0.6 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const ringPositions = [
    { cx: 50, cy: 50, r: 3, distance: 50 },
    { cx: 50, cy: 50, r: 10, distance: 120 },
    { cx: 50, cy: 50, r: 17, distance: 190 },
    { cx: 50, cy: 50, r: 24, distance: 260 },
    { cx: 50, cy: 50, r: 31, distance: 330 },
    { cx: 50, cy: 50, r: 38, distance: 400 },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-32 px-6 bg-warm-white overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 0, width: '1000px', height: '1000px' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full opacity-20"
          style={{ filter: 'drop-shadow(0 0 2px rgba(71, 91, 71, 0.1))' }}
        >
          <defs>
            <filter id="roughen">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" />
            </filter>
          </defs>

          {ringPositions.map((ring, i) => {
            const wobble = i * 0.15;
            const isVisible = i <= activeStep;
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={ring.r}
                fill="none"
                stroke="#475b47"
                strokeWidth={i % 2 === 0 ? "0.3" : "0.2"}
                opacity={isVisible ? 0.4 - i * 0.02 : 0}
                filter="url(#roughen)"
                className="transition-all duration-1000 ease-out"
                style={{
                  strokeDasharray: `${wobble} ${wobble * 0.5}`,
                  strokeLinecap: 'round',
                  transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                  transformOrigin: 'center',
                }}
              />
            );
          })}
        </svg>

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {ringPositions.map((pos, index) => {
            const isActive = index === activeStep;
            const isPassed = index < activeStep;

            return (
              <g key={index}>
                <circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={pos.r}
                  fill={isActive ? "#475b47" : isPassed ? "#8ba98b" : "transparent"}
                  className="transition-all duration-700"
                  style={{
                    opacity: isActive ? 1 : isPassed ? 0.6 : 0,
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(71, 91, 71, 0.8))' : 'none',
                  }}
                />
                {isActive && (
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r={pos.r + 2}
                    fill="none"
                    stroke="#475b47"
                    strokeWidth="0.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            Your Path to Growth
          </h2>
          <p className="text-xl text-gentle-gray/70 max-w-2xl mx-auto">
            Like tree rings marking seasons of growth, each step expands your journey toward wellness
          </p>
        </div>

        <div className="space-y-[25vh]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            const ringDistance = ringPositions[index].distance;

            return (
              <div
                key={step.number}
                ref={(el) => (stepRefs.current[index] = el)}
                className="flex justify-center items-center relative"
                style={{ minHeight: '20vh' }}
              >
                <div
                  className={`absolute ${isEven ? 'left-0' : 'right-0'}`}
                  style={{
                    [isEven ? 'left' : 'right']: `calc(50% - ${ringDistance}px)`,
                  }}
                >
                  <div className="bg-warm-white p-6 rounded-2xl shadow-xl border-2 border-forest/10 hover:shadow-2xl hover:border-forest/20 transition-all relative w-72">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-forest rounded-full flex items-center justify-center shadow-lg border-3 border-warm-white">
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>

                    <div className="flex items-center gap-2 mb-3 pt-4">
                      <span className="text-xs font-bold text-forest/40 uppercase tracking-wider">
                        Step {step.number}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-forest mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gentle-gray/80 leading-relaxed text-base">
                      {step.description}
                    </p>

                    <svg
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isEven ? '-right-12' : '-left-12'
                      } w-12 h-1 hidden lg:block`}
                      style={{
                        opacity: activeStep === index ? 1 : 0,
                        transition: 'opacity 0.7s ease',
                      }}
                    >
                      <line
                        x1={isEven ? "0" : "12"}
                        y1="0.5"
                        x2={isEven ? "12" : "0"}
                        y2="0.5"
                        stroke="#475b47"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        className="animate-pulse-gentle"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-[20vh]"></div>
      </div>
    </section>
  );
}
