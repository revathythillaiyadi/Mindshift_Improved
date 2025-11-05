import { UserPlus, MessageCircle, RefreshCw, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Sign Up / Log In',
    description: 'Create your secure account and begin your journey to mental wellness in minutes.',
    icon: UserPlus,
  },
  {
    number: 2,
    title: 'Start Chatting',
    description: 'Connect with NIRA, your AI companion who listens without judgment and guides with empathy.',
    icon: MessageCircle,
  },
  {
    number: 3,
    title: 'Reframe Your Thoughts',
    description: 'Learn to transform negative thought patterns into constructive perspectives with AI-powered guidance.',
    icon: RefreshCw,
  },
  {
    number: 4,
    title: 'Record Your Journey',
    description: 'Capture your progress with guided journaling that helps you reflect and grow.',
    icon: BookOpen,
  },
  {
    number: 5,
    title: 'Monitor Growth',
    description: 'Track your progress with visual insights, maintain streaks, and celebrate your achievements.',
    icon: TrendingUp,
  },
  {
    number: 6,
    title: 'Reach Help',
    description: 'Access immediate SOS resources and emergency support whenever you need it most.',
    icon: AlertCircle,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            How MindShift Works
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
            A simple, guided journey to better mental health in six steps
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-teal-200 to-blue-200 dark:from-blue-700 dark:via-teal-700 dark:to-blue-700 hidden md:block transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-all">
                      <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                        <span className="text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                          STEP {step.number}
                        </span>
                        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{step.title}</h3>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
