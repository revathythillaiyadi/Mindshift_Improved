import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Is my data private and secure?',
    answer: 'Absolutely. We use bank-level encryption to protect your data. All conversations are confidential, and we never share your personal information with third parties. Your privacy is our highest priority.',
  },
  {
    question: 'What is NIRA and how does it help me reframe my thoughts?',
    answer: 'NIRA (Neural Insight and Reframing Assistant) is your personal AI guide designed to shift perspective. By leveraging Neuro Linguistic Programming (NLP) and powerful reframing methods, NIRA actively assists you in identifying and consciously turning negative thoughts into positive, actionable affirmations for mindful growth, all within a supportive, conversational environment.',
  },
  {
    question: 'How does NIRA differ from a human therapist?',
    answer: 'NIRA is an AI companion designed to provide immediate support and guidance using evidence-based techniques. While NIRA can help with thought reframing and daily mental wellness, it\'s not a replacement for professional therapy. We recommend using MindShift as a complement to professional care when needed.',
  },
  {
    question: 'Is MindShift effective for managing anxiety and depression?',
    answer: 'MindShift uses cognitive behavioral therapy (CBT) techniques that have been proven effective in managing anxiety and depression symptoms. Many users report improved mood and reduced stress. However, for clinical conditions, we recommend working with a licensed mental health professional.',
  },
  {
    question: 'How often should I use MindShift?',
    answer: 'You can use MindShift as often as you need. Many users find daily check-ins helpful for building consistent mental health habits. The app adapts to your usage patterns and provides personalized recommendations based on your engagement.',
  },
  {
    question: 'What happens if I\'m in crisis?',
    answer: 'MindShift includes an SOS feature that immediately connects you to crisis resources and emergency helplines. If you\'re experiencing thoughts of self-harm or suicide, please call 988 (US) or your local emergency services immediately.',
  },
  {
    question: 'Can I use MindShift alongside medication or therapy?',
    answer: 'Yes! MindShift is designed to complement existing mental health treatments. Many users find it helpful for practicing skills learned in therapy and tracking progress between sessions. Always consult with your healthcare provider about your treatment plan.',
  },
  {
    question: 'How much does MindShift cost?',
    answer: 'We offer a free tier with core features, and premium plans with advanced tools and unlimited access. Join our waitlist to receive special early-bird pricing when we launch.',
  },
  {
    question: 'Is MindShift suitable for teens?',
    answer: 'MindShift is designed for users 18 and older. We\'re developing a version specifically for teens with parental consent features, launching soon. Mental health support for younger users requires special considerations and safeguards.',
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-20 px-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300">
            Everything you need to know about MindShift
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
