import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-white/6 bg-[#080c14]/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🌤</span>
          <span className="font-semibold text-white tracking-tight">WeatherScope</span>
        </div>
        <nav className="flex items-center gap-1">
          <NavLink to="/"      className={linkClass}>Today</NavLink>
          <NavLink to="/range" className={linkClass}>Historical</NavLink>
        </nav>
      </div>
    </header>
  )
}
