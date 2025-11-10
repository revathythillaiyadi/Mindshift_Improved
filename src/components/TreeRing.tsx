interface TreeRingProps {
  ringCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function TreeRing({ ringCount = 5, className = '', style }: TreeRingProps) {
  const generateOrganicPath = (baseRadius: number, centerX: number, centerY: number) => {
    const points = 60;
    const irregularity = baseRadius * 0.08;
    let path = '';

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const randomOffset = (Math.sin(angle * 3) * irregularity * 0.5) +
                          (Math.cos(angle * 5) * irregularity * 0.3) +
                          (Math.sin(angle * 7) * irregularity * 0.2);
      const radius = baseRadius + randomOffset;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path + ' Z';
  };

  const rings = [];
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 140;
  const minRadius = 15;

  for (let i = 0; i < ringCount; i++) {
    const progress = i / (ringCount - 1);
    const radius = maxRadius - (maxRadius - minRadius) * progress;
    const strokeClass = i % 3 === 0 ? 'tree-ring-path-bold' :
                       i % 2 === 0 ? 'tree-ring-path-thick' :
                       'tree-ring-path-thin';

    rings.push(
      <path
        key={i}
        d={generateOrganicPath(radius, centerX, centerY)}
        className={`tree-ring-path ${strokeClass}`}
      />
    );
  }

  return (
    <div className={`tree-ring-complex ${className}`} style={style}>
      <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
        {rings}
      </svg>
    </div>
  );
}
