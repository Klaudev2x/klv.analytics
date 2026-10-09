interface Props {
  label: string;
  value: string | number;
  trend?: number;
  icon?: string;
}

const ICON_STYLES: Record<string, string> = {
  U: "from-cyan-500 to-blue-600",
  P: "from-emerald-500 to-teal-600",
  T: "from-amber-500 to-orange-600",
  S: "from-violet-500 to-purple-600",
  $: "from-green-500 to-emerald-600",
  O: "from-sky-500 to-cyan-600",
  A: "from-rose-500 to-pink-600",
  "%": "from-indigo-500 to-blue-600",
  R: "from-teal-500 to-emerald-600",
  E: "from-red-500 to-orange-600",
  M: "from-fuchsia-500 to-purple-600",
};

export default function MetricCard({ label, value, trend, icon }: Props) {
  const hasTrend = trend !== undefined && trend !== 0;
  const isPositive = (trend ?? 0) > 0;
  const badge = icon ? ICON_STYLES[icon] ?? "from-slate-600 to-slate-700" : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 hover:border-slate-600 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        {icon && badge && (
          <span
            aria-hidden="true"
            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${badge} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{value}</div>
        {trend !== undefined &&
          (hasTrend ? (
            <div
              className={`text-sm font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                isPositive ? "text-emerald-300 bg-emerald-500/10" : "text-red-300 bg-red-500/10"
              }`}
            >
              <span aria-hidden="true">{isPositive ? "↑" : "↓"}</span> {Math.abs(trend)}%
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-500 px-2 py-0.5">— 0%</div>
          ))}
      </div>
    </div>
  );
}
