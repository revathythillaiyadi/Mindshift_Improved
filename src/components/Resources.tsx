import { ExternalLink, FileText, Phone, BookMarked, Video } from 'lucide-react';

const resources = [
  {
    title: 'Understanding Cognitive Reframing',
    description: 'Learn the science behind thought transformation and how it can improve your mental health.',
    icon: FileText,
    link: '#',
  },
  {
    title: 'Crisis Helplines & Support',
    description: 'Immediate access to mental health crisis lines and emergency support services worldwide.',
    icon: Phone,
    link: '#',
  },
  {
    title: 'Mental Health Research',
    description: 'Evidence-based articles and studies on mental wellness, CBT, and positive psychology.',
    icon: BookMarked,
    link: '#',
  },
  {
    title: 'Guided Meditation Videos',
    description: 'Calming exercises and mindfulness practices to complement your mental health journey.',
    icon: Video,
    link: '#',
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-20 px-6 bg-gradient-to-br from-blue-50/50 via-teal-50/30 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Mental Health Resources
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto">
            Curated, vetted resources to support your wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <a
                key={resource.title}
                href={resource.link}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1 group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{resource.title}</h3>
                    <ExternalLink className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-blue-700 dark:text-blue-300">{resource.description}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-teal-500 p-8 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Need to Talk to Someone Now?</h3>
          <p className="text-blue-50 mb-6 max-w-2xl mx-auto">
            If you're experiencing a mental health crisis, please reach out to a trained professional immediately.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:988" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all">
              Call 988 (US Crisis Line)
            </a>
            <a href="#" className="bg-blue-800 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-all">
              International Resources
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
