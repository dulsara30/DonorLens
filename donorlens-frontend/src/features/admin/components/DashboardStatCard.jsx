export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgClass = "bg-slate-100",
  iconTextClass = "text-slate-700",
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[1.05rem] font-semibold text-slate-700">{title}</p>
          <h3 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`grid h-14 w-14 place-items-center rounded-2xl ${iconBgClass} ${iconTextClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}