interface SectionDividerProps {
  variant?: 'wave' | 'curve';
  flip?: boolean;
  color?: string;
}

export default function SectionDivider({ variant = 'wave', flip = false, color = '#FAF9F7' }: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div className={`w-full ${flip ? 'rotate-180' : ''}`}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path
            d="M0,0 C300,80 600,80 900,40 C1050,20 1125,10 1200,0 L1200,120 L0,120 Z"
            fill={color}
            opacity="0.3"
          />
          <path
            d="M0,20 C300,100 600,100 900,60 C1050,40 1125,30 1200,20 L1200,120 L0,120 Z"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M0,40 C300,120 600,120 900,80 C1050,60 1125,50 1200,40 L1200,120 L0,120 Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20">
        <path
          d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
