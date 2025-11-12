import { useState, useEffect } from 'react';

type Phase = 'idle' | 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [breathCount, setBreatheCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isActive || showSuccess) return;

    let timer: NodeJS.Timeout;

    const runCycle = () => {
      setPhase('inhale');

      timer = setTimeout(() => {
        setPhase('hold-in');

        timer = setTimeout(() => {
          setPhase('exhale');

          timer = setTimeout(() => {
            setPhase('hold-out');

            timer = setTimeout(() => {
              const newCount = breathCount + 1;
              setBreatheCount(newCount);

              if (newCount >= 5) {
                setShowSuccess(true);
                setIsActive(false);
                setPhase('idle');
              } else {
                runCycle();
              }
            }, 2000);
          }, 4000);
        }, 2000);
      }, 4000);
    };

    runCycle();

    return () => clearTimeout(timer);
  }, [isActive, breathCount, showSuccess]);

  const handleStart = () => {
    setIsActive(true);
    setBreatheCount(0);
    setShowSuccess(false);
  };

  const handlePause = () => {
    setIsActive(false);
    setPhase('idle');
  };

  const handleReset = () => {
    setShowSuccess(false);
    setBreatheCount(0);
    setPhase('idle');
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold-in':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      case 'hold-out':
        return 'Hold...';
      default:
        return 'Ready to begin?';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'hold-in') return 'scale-150';
    return 'scale-100';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-sage-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-sage-700 dark:text-white mb-4">
            Try a Quick Calm Exercise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Take 60 seconds to center yourself
          </p>
        </div>

        {!showSuccess ? (
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-8 flex items-center justify-center">
              <div
                className={`breathing-circle absolute w-48 h-48 rounded-full transition-all duration-[4000ms] ease-in-out ${getCircleScale()} ${
                  isActive ? 'breathing-active' : ''
                }`}
                style={{
                  background:
                    phase === 'inhale' || phase === 'hold-in'
                      ? 'linear-gradient(135deg, #60a5fa 0%, #7fa68d 100%)'
                      : 'linear-gradient(135deg, #7fa68d 0%, #4e824f 100%)',
                  boxShadow: isActive
                    ? '0 0 40px rgba(127, 166, 141, 0.6), 0 0 80px rgba(127, 166, 141, 0.3)'
                    : '0 0 20px rgba(127, 166, 141, 0.3)',
                }}
              />
              <div className="relative z-10 text-center">
                <div className="text-2xl font-semibold text-white mb-2">
                  {getPhaseText()}
                </div>
                {isActive && (
                  <div className="text-lg text-white opacity-90">
                    Breath {breathCount + 1} of 5
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              {!isActive ? (
                <button
                  onClick={handleStart}
                  className="px-8 py-4 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Exercise
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  Pause
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="mb-6 inline-block">
              <div className="checkmark-circle">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-sage-700 dark:text-white mb-3">
              Great job! 🌟
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Feeling calmer?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full transition-all"
              >
                Try Again
              </button>
              <a
                href="#beta-signup"
                className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Sign Up to Continue
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
