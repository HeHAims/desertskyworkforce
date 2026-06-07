export default function TimelineSvg({ tasks }) {
  const width = 1200;
  const height = 260;
  const rows = tasks.slice(0, 4);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id="trackGradient" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#18a999" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} rx="28" fill="rgba(255,255,255,0.03)" />
      <line x1="80" y1="130" x2="1120" y2="130" stroke="url(#trackGradient)" strokeWidth="6" strokeLinecap="round" />

      {rows.map((task, index) => {
        const x = 150 + index * 250;
        const y = 130 + (index % 2 === 0 ? -42 : 42);
        return (
          <g key={task.id}>
            <circle cx={x} cy="130" r="14" fill="#f97316" />
            <circle cx={x} cy="130" r="8" fill="#0e1b27" />
            <path d={`M ${x} 130 C ${x} 130, ${x} ${y}, ${x + 75} ${y}`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
            <rect x={x + 75} y={y - 26} width="220" height="52" rx="16" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" />
            <text x={x + 92} y={y - 2} fill="#fff" fontSize="18" fontWeight="600">{task.carrier}</text>
            <text x={x + 92} y={y + 18} fill="rgba(255,255,255,0.72)" fontSize="13">{task.milestone}</text>
          </g>
        );
      })}
    </svg>
  );
}
