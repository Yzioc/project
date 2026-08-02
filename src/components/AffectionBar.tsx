interface AffectionBarProps {
  affection: number;
}

export function AffectionBar({ affection }: AffectionBarProps) {
  const percentage = Math.max(0, Math.min(100, ((affection + 50) / 150) * 100));

  const getColor = () => {
    if (affection < 0) return '#ef4444';
    if (affection < 50) return '#eab308';
    if (affection < 80) return '#3b82f6';
    return '#22c55e';
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm text-gray-500 whitespace-nowrap">💗 好感度</span>
      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
          }}
        />
      </div>
    </div>
  );
}
