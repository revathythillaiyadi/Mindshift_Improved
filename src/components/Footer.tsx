import { Brain, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-blue-950 text-white pt-16 pb-8 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-10 h-10 text-teal-400" strokeWidth={2} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">MindShift</span>
                <span className="text-sm text-blue-300">Reframe your thoughts, Reshape your world</span>
              </div>
            </div>
            <p className="text-blue-200 leading-relaxed mb-6">
              Empowering mental wellness through AI-driven support and evidence-based therapeutic techniques.
              Your journey to better mental health starts here.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@mindshift.com"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-blue-200 hover:text-teal-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-blue-200 hover:text-teal-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-blue-200 hover:text-teal-400 transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#resources" className="text-blue-200 hover:text-teal-400 transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#faqs" className="text-blue-200 hover:text-teal-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-blue-200 hover:text-teal-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-teal-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-teal-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-teal-400 transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} MindShift. All rights reserved.</p>
          <p className="mt-2">
            MindShift is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
