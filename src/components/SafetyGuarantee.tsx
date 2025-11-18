import { Shield, Phone, Heart, Star } from 'lucide-react';

export default function SafetyGuarantee() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-forest via-forest-dark to-forest relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse-gentle" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/20 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-pulse-gentle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse-gentle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-pulse-gentle" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 rounded-full mb-4 shadow-lg animate-pulse-gentle">
            <Shield className="w-10 h-10 text-sage-600" strokeWidth={2} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            We're Here to Keep You Safe
          </h2>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] border-2 border-white/50 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-gentle-gray text-lg leading-relaxed text-center mb-8 font-serif">
            At MindShift, we understand that mental health is deeply personal and requires the highest level of care.
            While NIRA provides compassionate support and gentle guidance, we want you to know that help is always
            available when you need it most.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-[2rem] hover:shadow-lg hover:-translate-y-1 transition-all group animate-fade-in" style={{ backgroundColor: '#2c3e50', animationDelay: '0.3s' }}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-sage-500 to-mint-500 rounded-full mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sage-400 font-bold text-lg mb-2">24/7 Crisis Access</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Immediate support connects you to emergency resources anytime, day or night
              </p>
            </div>

            <div className="text-center p-6 rounded-[2rem] hover:shadow-lg hover:-translate-y-1 transition-all group animate-fade-in" style={{ backgroundColor: '#2c3e50', animationDelay: '0.4s' }}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-mint-500 to-sage-500 rounded-full mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sage-400 font-bold text-lg mb-2">Protected & Private</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Your conversations are encrypted and completely confidential, always
              </p>
            </div>

            <div className="text-center p-6 rounded-[2rem] hover:shadow-lg hover:-translate-y-1 transition-all group animate-fade-in" style={{ backgroundColor: '#2c3e50', animationDelay: '0.5s' }}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-sage-500 to-mint-500 rounded-full mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sage-400 font-bold text-lg mb-2">Professional Support</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Guidance to connect with licensed therapists when you need more
              </p>
            </div>
          </div>

          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-forest font-semibold mb-4 text-lg">
              If you're experiencing a crisis or thoughts of self-harm:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:988"
                className="bg-gradient-to-r from-sage-600 to-mint-600 text-white px-8 py-4 rounded-[2rem] font-bold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 group"
              >
                <Phone className="w-5 h-5 group-hover:animate-pulse" />
                Call 988 (US)
              </a>
              <a
                href="tel:911"
                className="bg-gradient-to-r from-mint-600 to-sage-600 text-white px-8 py-4 rounded-[2rem] font-bold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 group"
              >
                <Phone className="w-5 h-5 group-hover:animate-pulse" />
                Emergency: 911
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
