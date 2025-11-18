import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Is my data private and secure?',
    answer: 'Absolutely. We use bank-level encryption to protect your data. All conversations are confidential, and we never share your personal information with third parties. Your privacy is our highest priority.',
  },
  {
    question: 'What does Mindshift do?',
    answer: 'Mindshift is an AI companion that helps you quickly shift unhelpful thoughts and make better decisions using conversational reframing. Just open the web app, chat or talk with NIRA, and get instant mindset clarity in minutes — no downloads needed, works perfectly on phone or laptop browsers.',
  },
  {
    question: 'Who or what is NIRA?',
    answer: 'NIRA (Neural Insight & Reframing Assistant) is the friendly AI companion inside the Mindshift app. It\'s your 24×7 pocket buddy that listens to whatever\'s on your mind and uses smart, gentle questions (based on NLP "sleight of mouth" techniques) to help you instantly see things from a clearer, more helpful angle. No lectures, no judgment — just quick, natural mindset shifts that feel like talking to a wise friend who always knows the right question to ask. Chat or speak with NIRA anytime.',
  },
  {
    question: 'How does NIRA differ from a human therapist?',
    answer: 'NIRA is an always-available, on-demand tool for everyday thought shifts, using AI-driven questions for quick insights. It\'s not a replacement for human therapists, who offer deeper emotional support, diagnosis, and personalized strategies through empathy and expertise. Think of NIRA as a daily "mind gym" complement to professional care.',
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
    <section id="faqs" className="py-20 px-6 bg-gradient-to-b from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-gray mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-warm-gray/70">
            Everything you need to know about MindShift.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-sage-100/50 rounded-pebble overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-sage-50 dark:bg-gray-700/50/50 transition-colors"
              >
                <span className="text-lg font-bold pr-4" style={{ color: '#4a6b59' }}>{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-sage-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="leading-relaxed" style={{ color: '#1e2936' }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
