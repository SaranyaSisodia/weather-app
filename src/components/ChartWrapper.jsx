/**
 * ChartWrapper
 * Every chart in the app lives inside this shell.
 * It provides:
 *   - a glass-morphism card container
 *   - overflow-x-auto so charts scroll horizontally on mobile
 *   - a minimum inner width so charts never squish below readability
 */
export default function ChartWrapper({ title, children, height = 220, minWidth = 560 }) {
  return (
    <div
      className="rounded-2xl p-4 mb-4 animate-fade-up"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <p className="text-xs font-medium text-slate-500 mb-4 uppercase tracking-wider">
        {title}
      </p>
      <div className="overflow-x-auto">
        <div style={{ minWidth, height }}>
          {children}
        </div>
      </div>
    </div>
  )
}
