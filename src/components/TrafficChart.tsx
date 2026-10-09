interface TrafficDataPoint {
  time: string;
  views: number;
}

interface Props {
  data: TrafficDataPoint[];
}

export default function TrafficChart({ data }: Props) {
  const views = data.map((d) => d.views);
  const maxViews = views.length > 0 ? Math.max(...views, 1) : 1;
  const total = views.reduce((sum, v) => sum + v, 0);
  const average = data.length > 0 ? Math.round(total / data.length) : 0;
  const peak = data.length > 0 ? Math.max(...views) : 0;
  const isEmpty = total === 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Traffic Last 24 Hours</h3>
        {!isEmpty && (
          <span className="text-xs text-slate-400 bg-slate-800/70 px-2.5 py-1 rounded-full tabular-nums">
            {total.toLocaleString()} views
          </span>
        )}
      </div>

      {data.length === 0 || isEmpty ? (
        <div className="h-64 flex flex-col items-center justify-center text-center gap-2">
          <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 15l4-6 4 3 4-7" />
          </svg>
          <p className="text-slate-500 text-sm">No traffic in the last 24 hours</p>
        </div>
      ) : (
        <div
          className="flex items-end gap-1.5 sm:gap-2 h-64"
          role="img"
          aria-label={`Hourly traffic, peak ${peak} views, average ${average} views`}
        >
          {data.map((point) => {
            const heightPercent = Math.max((point.views / maxViews) * 100, 3);
            return (
              <div
                key={point.time}
                className="flex-1 h-full flex flex-col items-center justify-end group min-w-0"
                title={`${point.time}: ${point.views} views`}
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80 group-hover:opacity-100 group-hover:from-cyan-500 group-hover:to-cyan-300 transition"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] sm:text-xs text-slate-500 mt-2 group-hover:text-slate-200 transition">
                  {point.time}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4 mt-2 border-t border-slate-800 text-xs text-slate-500 flex gap-4 tabular-nums">
        <p>Highest: <span className="text-slate-300 font-medium">{peak}</span> views</p>
        <p>Average: <span className="text-slate-300 font-medium">{average}</span> views</p>
      </div>
    </div>
  );
}
