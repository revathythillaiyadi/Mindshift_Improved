import { useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const moods = [
  { emoji: '😢', value: 1, label: 'Very Sad', color: '#EF4444' },
  { emoji: '😟', value: 2, label: 'Sad', color: '#F97316' },
  { emoji: '😐', value: 3, label: 'Neutral', color: '#FBBF24' },
  { emoji: '🙂', value: 4, label: 'Happy', color: '#84CC16' },
  { emoji: '😊', value: 5, label: 'Very Happy', color: '#10B981' },
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
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-1">
          <h3 className="text-sm font-medium text-[#66887f] dark:text-gray-400">
            How are you feeling?
          </h3>

          {showConfirmation && (
            <div className="flex items-center gap-2 text-mint-600 dark:text-mint-400 animate-fade-in">
              <Check className="w-4 h-4 animate-bounce" />
              <span className="text-sm font-medium">Logged!</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-3">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodClick(mood.value)}
              disabled={showConfirmation}
              className={`text-[32px] transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none rounded-full p-1.5 relative ${
                selectedMood === mood.value
                  ? 'scale-115'
                  : ''
              } ${showConfirmation ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                boxShadow: selectedMood === mood.value
                  ? `0 0 0 3px ${mood.color}40, 0 4px 12px ${mood.color}30`
                  : 'none',
                transform: selectedMood === mood.value ? 'scale(1.15)' : undefined,
              }}
              onMouseEnter={(e) => {
                if (!showConfirmation && selectedMood !== mood.value) {
                  e.currentTarget.style.boxShadow = `0 4px 8px rgba(0,0,0,0.15)`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMood !== mood.value) {
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              title={mood.label}
              aria-label={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
