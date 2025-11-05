import { Shield, Phone, Heart } from 'lucide-react';

export default function SafetyGuarantee() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-900 to-blue-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Safety is Our Priority
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <p className="text-white text-lg leading-relaxed text-center mb-8">
            At MindShift, we understand that mental health is deeply personal and requires the highest level of care
            and protection. While NIRA provides compassionate support and evidence-based guidance, we want you to know
            that help is always available when you need it most.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-400 rounded-full mb-3">
                <Phone className="w-6 h-6 text-blue-900" strokeWidth={2} />
              </div>
              <h3 className="text-white font-bold mb-2">24/7 Crisis Access</h3>
              <p className="text-blue-100 text-sm">
                Immediate SOS feature connects you to emergency resources anytime
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-400 rounded-full mb-3">
                <Shield className="w-6 h-6 text-blue-900" strokeWidth={2} />
              </div>
              <h3 className="text-white font-bold mb-2">Protected & Private</h3>
              <p className="text-blue-100 text-sm">
                Your conversations are encrypted and completely confidential
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-400 rounded-full mb-3">
                <Heart className="w-6 h-6 text-blue-900" strokeWidth={2} />
              </div>
              <h3 className="text-white font-bold mb-2">Professional Support</h3>
              <p className="text-blue-100 text-sm">
                Guidance to connect with licensed therapists when you need more
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-white font-semibold mb-3">
              If you're experiencing a crisis or thoughts of self-harm:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:988"
                className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call 988 (US)
              </a>
              <a
                href="tel:911"
                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Emergency: 911
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
