import { Shield, Award, Users } from 'lucide-react';
import TreeRing from './TreeRing';

export default function AboutUs() {
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-b from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <TreeRing
          ringCount={9}
          className="absolute top-1/3 -right-20 w-[250px] h-[250px] opacity-40 animate-breathing"
        />
      </div>
      <div className="container mx-auto max-w-7xl relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-forest dark:text-sage-100 transition-colors">
                About MindShift
              </h2>
            </div>
            <div className="space-y-4 text-lg text-warm-gray/80 leading-relaxed">
              <p>
                MindShift is your personal space for growth and well-being. We’ve dedicated ourselves to making compassionate, evidence-based mental health support readily available to everyone, right when you need it. Our unique platform seamlessly integrates thoughtful artificial intelligence with time-tested therapeutic techniques like Neural Linguistic Programming and Positive Psychology.
              </p>
              <p>
                At the heart of MindShift is NIRA, your empathetic AI companion. Designed by mental health professionals and researchers, NIRA provides a safe, judgment-free space where you can explore your feelings, reframe your thoughts, build resilience, and develop healthier thinking patterns. We believe true wellness flourishes when you feel understood and empowered, and NIRA is here to support every step of your journey with personalized care and unwavering empathy
              </p>
            
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border-2 border-sage-100/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest mb-2">Privacy First</h3>
                  <p className="text-gentle-gray/70 leading-relaxed">
                    Your data is encrypted and protected with bank-level security. We never share your personal information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border-2 border-mint-100/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 bg-gradient-to-br from-mint-500 to-sage-500 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest mb-2">Science-Backed</h3>
                  <p className="text-gentle-gray/70 leading-relaxed">
                    Built on proven therapeutic methods and validated by mental health experts and researchers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm p-6 rounded-[2rem] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 bg-gradient-to-br from-beige-500 to-sage-500 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest mb-2">Community Support</h3>
                  <p className="text-gentle-gray/70 leading-relaxed">
                    Join thousands of users on their wellness journey, supported by our dedicated team of professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
