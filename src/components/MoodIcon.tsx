type MoodType = 'happy' | 'calm' | 'energetic' | 'peaceful' | 'confident' | 'creative';

interface MoodIconProps {
  mood: MoodType;
  className?: string;
  style?: React.CSSProperties;
}

const moodConfig = {
  happy: {
    emoji: '😊',
    colors: 'text-yellow-400',
    gradient: 'from-yellow-400 to-amber-400',
    shadow: 'shadow-yellow-200/50',
  },
  calm: {
    emoji: '😌',
    colors: 'text-blue-400',
    gradient: 'from-blue-400 to-cyan-400',
    shadow: 'shadow-blue-200/50',
  },
  energetic: {
    emoji: '🤩',
    colors: 'text-orange-400',
    gradient: 'from-orange-400 to-rose-400',
    shadow: 'shadow-orange-200/50',
  },
  peaceful: {
    emoji: '😇',
    colors: 'text-emerald-400',
    gradient: 'from-emerald-400 to-teal-400',
    shadow: 'shadow-emerald-200/50',
  },
  confident: {
    emoji: '😎',
    colors: 'text-red-400',
    gradient: 'from-red-400 to-pink-400',
    shadow: 'shadow-red-200/50',
  },
  creative: {
    emoji: '🤗',
    colors: 'text-violet-400',
    gradient: 'from-violet-400 to-fuchsia-400',
    shadow: 'shadow-violet-200/50',
  },
};

export default function MoodIcon({ mood, className = '', style }: MoodIconProps) {
  const config = moodConfig[mood];

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={style}
      role="img"
      aria-label={`${mood} mood`}
    >
      <span className="text-4xl leading-none select-none">
        {config.emoji}
      </span>
    </div>
  );
}

export { moodConfig };
export type { MoodType };
