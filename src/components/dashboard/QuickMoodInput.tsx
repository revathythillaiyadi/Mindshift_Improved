import { useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const moods = [
  { emoji: '😢', value: 1, label: 'Very Sad' },
  { emoji: '😟', value: 2, label: 'Sad' },
  { emoji: '😐', value: 3, label: 'Neutral' },
  { emoji: '🙂', value: 4, label: 'Happy' },
  { emoji: '😊', value: 5, label: 'Very Happy' },
];

interface QuickMoodInputProps {
  onMoodLogged?: () => void;
}

export default function QuickMoodInput({ onMoodLogged }: QuickMoodInputProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  const handleMoodClick = async (moodValue: number) => {
    if (!user) return;

    setSelectedMood(moodValue);

    const { error } = await supabase.from('mood_logs').insert({
      user_id: user.id,
      mood_value: moodValue,
    });

    if (!error) {
      setShowConfirmation(true);

      if (onMoodLogged) {
        onMoodLogged();
      }

      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedMood(null);
      }, 2000);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-sage-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-forest dark:text-gray-200">
          How are you feeling right now?
        </h3>

        {showConfirmation && (
          <div className="flex items-center gap-2 text-mint-600 dark:text-mint-400 animate-fade-in">
            <Check className="w-5 h-5 animate-bounce" />
            <span className="font-medium">Logged!</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodClick(mood.value)}
            disabled={showConfirmation}
            className={`text-5xl transition-all duration-200 hover:scale-125 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sage-300 dark:focus:ring-sage-600 rounded-2xl p-2 ${
              selectedMood === mood.value
                ? 'scale-125 animate-pulse'
                : ''
            } ${showConfirmation ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sage-50 dark:hover:bg-gray-700'}`}
            title={mood.label}
            aria-label={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
