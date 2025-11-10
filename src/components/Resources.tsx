import { ExternalLink, FileText, Phone, BookMarked, Video } from 'lucide-react';

const resources = [
  {
    title: 'Understanding Cognitive Reframing',
    description: 'Learn the science behind thought transformation and how it can improve your mental health.',
    icon: FileText,
    link: '#',
    gradient: 'from-sage-400 to-mint-400',
  },
  {
    title: 'Crisis Helplines & Support',
    description: 'Immediate access to mental health crisis lines and emergency support services worldwide.',
    icon: Phone,
    link: '#',
    gradient: 'from-peach-400 to-sunrise-400',
  },
  {
    title: 'Mental Health Research',
    description: 'Evidence-based articles and studies on mental wellness, CBT, and positive psychology.',
    icon: BookMarked,
    link: '#',
    gradient: 'from-mint-400 to-sage-500',
  },
  {
    title: 'Guided Meditation Videos',
    description: 'Calming exercises and mindfulness practices to complement your mental health journey.',
    icon: Video,
    link: '#',
    gradient: 'from-lavender-400 to-sage-400',
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-20 px-6 bg-warm-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            Mental Health Resources
          </h2>
          <p className="text-xl text-warm-gray/70 max-w-3xl mx-auto">
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
                className="bg-white/80 backdrop-blur-sm p-6 rounded-pebble shadow-lg border border-sage-100/50 hover:shadow-xl transition-all hover:-translate-y-1 group flex items-start gap-4"
              >
                <div className="w-14 h-14 bg-forest rounded-pebble flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-warm-gray dark:text-gray-400 transition-colors">{resource.title}</h3>
                    <ExternalLink className="w-5 h-5 text-sage-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-warm-gray/70 leading-relaxed">{resource.description}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 bg-forest p-8 rounded-pebble-lg text-white text-center shadow-xl">
          <div>
            <h3 className="text-2xl font-bold mb-3">Need to Talk to Someone Now?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
              If you're experiencing a mental health crisis, please reach out to a trained professional immediately.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:988" className="bg-white text-forest px-8 py-3 rounded-pebble font-bold hover:bg-white/90 hover:shadow-lg transition-all border-2 border-white">
                Call 988 (US)
              </a>
              <a href="tel:911" className="bg-white text-forest px-8 py-3 rounded-pebble font-bold hover:bg-white/90 hover:shadow-lg transition-all border-2 border-white">
                Emergency: 911
              </a>
              <a href="#" className="bg-white text-forest px-8 py-3 rounded-pebble font-bold hover:bg-white/90 transition-all border-2 border-white">
                International Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
