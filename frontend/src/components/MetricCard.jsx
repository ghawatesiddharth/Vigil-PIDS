function MetricCard({
  label,
  value,
  unit,
  description,
  icon,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.04]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
            {label}
          </p>

          <div className="mt-3 flex items-baseline gap-1">

            <span className="text-3xl font-semibold text-white">
              {value}
            </span>

            {unit && (
              <span className="text-sm text-slate-500">
                {unit}
              </span>
            )}

          </div>

          {description && (
            <p className="mt-2 text-xs text-slate-500">
              {description}
            </p>
          )}

        </div>

        {icon && (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-cyan-400">
            {icon}
          </div>
        )}

      </div>

    </div>
  );
}

export default MetricCard;