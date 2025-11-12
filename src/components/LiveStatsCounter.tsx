import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  label: string;
}

const stats: Stat[] = [
  { value: 2847, label: 'Users Feeling Better' },
  { value: 15234, label: 'Negative Thoughts Reframed' },
  { value: 10000, label: 'Daily Check-ins Completed' },
];

function StatCounter({ targetValue, label }: { targetValue: number; label: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500;
    const steps = 60;
    const increment = targetValue / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newValue = Math.floor(easeProgress * targetValue);
      setCount(newValue);

      if (currentStep >= steps) {
        setCount(targetValue);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, targetValue]);

  return (
    <div
      ref={elementRef}
      className={`text-center transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-5xl md:text-6xl font-bold text-sage-400 dark:text-sage-300 mb-3">
        {count.toLocaleString()}+
      </div>
      <div className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
        {label}
      </div>
    </div>
  );
}

export default function LiveStatsCounter() {
  return (
    <section className="py-20 bg-sage-700 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Making a Real Difference
          </h2>
          <p className="text-lg text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands who are already on their journey to better mental wellness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <StatCounter key={index} targetValue={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
