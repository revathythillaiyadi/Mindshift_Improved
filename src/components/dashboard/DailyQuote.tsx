import { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    text: "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
    author: "Unknown"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay"
  },
  {
    text: "Sometimes the most important thing in a whole day is the rest we take between two deep breaths.",
    author: "Etty Hillesum"
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
    author: "Julian Seifter"
  },
  {
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia"
  },
  {
    text: "It's okay to not be okay. It's okay to ask for help. It's okay to take time for yourself.",
    author: "Unknown"
  },
  {
    text: "The strongest people are not those who show strength in front of us but those who win battles we know nothing about.",
    author: "Unknown"
  },
  {
    text: "Talk to yourself like you would to someone you love.",
    author: "Brené Brown"
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush"
  },
  {
    text: "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with.",
    author: "Adam Ant"
  },
  {
    text: "There is hope, even when your brain tells you there isn't.",
    author: "John Green"
  },
  {
    text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.",
    author: "Glenn Close"
  },
  {
    text: "You are enough just as you are. Each emotion you feel, everything in your life, everything you do or do not do... where you are and who you are right now is enough.",
    author: "Haemin Sunim"
  }
];

function getDailyQuoteIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % quotes.length;
}

export default function DailyQuote() {
  const [quote, setQuote] = useState<Quote>(quotes[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const index = getDailyQuoteIndex();
    setQuote(quotes[index]);
  }, []);

  const handleShare = async () => {
    const textToShare = `"${quote.text}" - ${quote.author}`;

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-sage-50/80 to-mint-50/80 dark:from-gray-800/80 dark:to-gray-700/80 rounded-2xl p-5 shadow-lg border-2 border-sage-200 dark:border-gray-600 overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="quote-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-sage-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quote-pattern)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-sage-700 dark:text-sage-300 uppercase tracking-wide">
            Daily Inspiration
          </h3>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:bg-sage-200/50 dark:hover:bg-gray-600/50 transition-colors"
            title="Copy quote"
          >
            {copied ? (
              <Check className="w-4 h-4 text-mint-600 dark:text-mint-400" />
            ) : (
              <Share2 className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            )}
          </button>
        </div>

        <blockquote className="mb-3">
          <p className="text-base font-medium leading-relaxed bg-gradient-to-r from-forest to-sage-700 dark:from-sage-300 dark:to-mint-300 bg-clip-text text-transparent italic">
            "{quote.text}"
          </p>
        </blockquote>

        <p className="text-sm text-soft-gray dark:text-gray-400 font-medium">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
