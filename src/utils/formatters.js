import { format, parseISO } from 'date-fns'

/** "2024-06-15T05:23:00" → "5:23 AM" */
export const formatTime = (iso) => {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'h:mm a') }
  catch { return '—' }
}

/** "2024-06-15" → "Jun 15, 2024" */
export const formatDate = (str) => {
  if (!str) return '—'
  try { return format(parseISO(str), 'MMM d, yyyy') }
  catch { return '—' }
}

/** Today as "YYYY-MM-DD" */
export const todayStr = () => format(new Date(), 'yyyy-MM-dd')

/** 2 years ago as "YYYY-MM-DD" */
export const minDateStr = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 2)
  return format(d, 'yyyy-MM-dd')
}

/** Wind degrees → compass label */
export const degToCompass = (deg) => {
  if (deg == null) return '—'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

/**
 * AQI label + tailwind color class from PM2.5 (μg/m³).
 * Follows US EPA breakpoints.
 */
export const getAqiInfo = (pm25) => {
  if (pm25 == null) return { label: 'N/A',           color: 'text-slate-400',  bg: 'bg-slate-500/10' }
  if (pm25 <= 12)   return { label: 'Good',          color: 'text-emerald-400',bg: 'bg-emerald-500/10' }
  if (pm25 <= 35)   return { label: 'Moderate',      color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
  if (pm25 <= 55)   return { label: 'Unhealthy*',    color: 'text-orange-400', bg: 'bg-orange-500/10' }
  if (pm25 <= 150)  return { label: 'Unhealthy',     color: 'text-red-400',    bg: 'bg-red-500/10' }
  if (pm25 <= 250)  return { label: 'Very Unhealthy',color: 'text-purple-400', bg: 'bg-purple-500/10' }
  return                   { label: 'Hazardous',     color: 'text-rose-400',   bg: 'bg-rose-500/10' }
}

/** Round to N decimal places, returns "—" for null/undefined */
export const fmt = (val, decimals = 1) =>
  val == null ? '—' : parseFloat(val.toFixed(decimals))
