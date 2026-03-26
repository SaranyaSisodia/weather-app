export default function StatCard({
  icon,
  label,
  value,
  unit = '',
  colorClass = 'text-blue-400',
  delay = '0s',
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 animate-fade-up"
      style={{
        animationDelay: delay,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
        <span className="text-base leading-none">{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`text-xl font-semibold leading-none ${colorClass}`}>
        {value ?? '—'}
        {value != null && value !== '—' && unit && (
          <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
        )}
      </div>
    </div>
  )
}
