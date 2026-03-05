'use client';

interface ChartData {
  hour: number;
  count: number;
}

interface ChartProps {
  data: ChartData[];
}

export function Chart({ data }: ChartProps) {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));
  const maxHeight = 200;

  return (
    <div className="space-y-2">
      {data.map((item) => {
        const height = maxCount > 0 ? (item.count / maxCount) * maxHeight : 0;
        return (
          <div key={item.hour} className="flex items-end gap-2">
            <div className="w-12 text-xs text-gray-500 text-right">
              {String(item.hour).padStart(2, '0')}h
            </div>
            <div className="flex-1 flex items-end gap-1">
              <div
                className="bg-gray-300 rounded-t transition-all"
                style={{ height: `${height}px`, minHeight: height > 0 ? '4px' : '0' }}
              />
            </div>
            <div className="w-16 text-xs text-gray-600 text-right">
              {item.count.toLocaleString('pt-BR')}
            </div>
          </div>
        );
      })}
    </div>
  );
}

