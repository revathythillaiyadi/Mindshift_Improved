import { Bot, BookText, Heart, Target, Radio } from 'lucide-react';
import TreeRing from './TreeRing';

const services = [
  {
    title: 'Meet NIRA, your empathetic companion',
    description: 'A warm presence available 24/7, offering gentle conversations and compassionate support whenever you need someone to listen.',
    icon: Bot,
  },
  {
    title: 'A quiet place for your thoughts',
    description: 'Gentle prompts and reflective exercises help you process emotions and discover insights at your own pace.',
    icon: BookText,
  },
  {
    title: 'Understand your feelings',
    description: 'Visual insights into your emotional patterns help you recognize what you\'re experiencing and celebrate your progress.',
    icon: Heart,
  },
  {
    title: 'Map your unique journey',
    description: 'Personalized objectives based on your needs, with gentle milestones to keep you motivated and moving forward.',
    icon: Target,
  },
  {
    title: 'Guided Audio Reframing',
    description: 'Go beyond typing. Talk to NIRA with our new voice chat option. You can engage in 5-minute guided audio sessions where NIRA helps you actively challenge and shift difficult thought patterns, just by listening and speaking.',
    icon: Radio,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-sage-50/30 via-warm-white to-mint-50/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <TreeRing
          ringCount={7}
          className="absolute bottom-1/4 -left-20 w-[200px] h-[200px] opacity-35 animate-breathing"
          style={{ animationDelay: '1s' }}
        />
      </div>
      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-forest">
              Your Personal Space for Growth
            </h2>
          </div>
          <p className="text-xl text-gentle-gray/70 max-w-3xl mx-auto font-serif italic">
            Everything you need to nurture your mental wellness, thoughtfully designed for your journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 hover:shadow-xl transition-all hover:-translate-y-2 group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >

                <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-md relative">
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-forest mb-3 relative">{service.title}</h3>
                <p className="text-gentle-gray/70 leading-relaxed text-sm relative">{service.description}</p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sage-400/20 via-mint-400/20 to-sage-400/20 rounded-b-[2rem]">
                  <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-sage-500 to-mint-500 transition-all duration-500 ease-out" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
