export default function LoadingSpinner({ message = 'Fetching data…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-blue-400 animate-spin" />
      </div>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  )
}
