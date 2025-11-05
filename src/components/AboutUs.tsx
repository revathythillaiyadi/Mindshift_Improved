import { Shield, Award, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="about" className="py-20 px-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-6">
              About MindShift
            </h2>
            <div className="space-y-4 text-lg text-blue-800 dark:text-blue-200 leading-relaxed">
              <p>
                MindShift is dedicated to making evidence-based mental health support accessible to everyone.
                Our platform combines cutting-edge artificial intelligence with proven therapeutic techniques
                to help you navigate life's challenges with confidence and clarity.
              </p>
              <p>
                Founded by mental health professionals and AI researchers, MindShift is built on the principles
                of cognitive behavioral therapy and positive psychology. Our AI companion, NIRA, is trained on
                thousands of therapeutic conversations and continuously refined to provide empathetic,
                personalized support.
              </p>
              <p>
                We believe that mental wellness should be within reach for everyone, which is why we've created
                a safe, judgment-free space where you can explore your thoughts, build resilience, and develop
                healthier thinking patterns at your own pace.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Privacy First</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Your data is encrypted and protected with bank-level security. We never share your personal information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-gray-800 p-6 rounded-2xl border border-teal-100 dark:border-gray-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-600 dark:bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Science-Backed</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Built on proven therapeutic methods and validated by mental health experts and researchers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Community Support</h3>
                  <p className="text-blue-700 dark:text-blue-300">
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
