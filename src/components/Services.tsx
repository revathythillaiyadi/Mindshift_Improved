import { Bot, BookText, Heart, Target } from 'lucide-react';

const services = [
  {
    title: 'AI Chatbot NIRA',
    description: 'Your 24/7 companion offering empathetic, judgment-free conversations powered by advanced AI technology trained in cognitive behavioral therapy techniques.',
    icon: Bot,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Guided Journaling',
    description: 'Structured prompts and reflective exercises designed to help you process emotions, track patterns, and gain deeper self-awareness.',
    icon: BookText,
    gradient: 'from-teal-500 to-teal-600',
  },
  {
    title: 'Mood Tracking',
    description: 'Visual insights into your emotional patterns over time, helping you understand triggers and celebrate progress on your wellness journey.',
    icon: Heart,
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    title: 'Personalized Goals',
    description: 'Custom-tailored objectives based on your unique needs, with actionable steps and milestone tracking to keep you motivated and on track.',
    icon: Target,
    gradient: 'from-teal-400 to-blue-500',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-br from-blue-50/50 via-white to-teal-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Comprehensive Mental Wellness Tools
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto">
            Everything you need to support your mental health journey, all in one place
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">{service.title}</h3>
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
