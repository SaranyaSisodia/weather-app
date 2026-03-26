export default function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mt-8 mb-4 flex items-center gap-3">
      <span className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
      {children}
      <span className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
    </h2>
  )
}
