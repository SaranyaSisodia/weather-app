import { useState, useEffect } from 'react'
import { fetchDayWeather } from '../api/weather'
import { useLocation } from '../hooks/useLocation'
import { formatTime, formatDate, todayStr, getAqiInfo, fmt } from '../utils/formatters'
import StatCard from '../components/StatCard'
import SectionTitle from '../components/SectionTitle'
import HourlyCharts from '../components/HourlyCharts'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DayPage() {
  const { lat, lon, loading: gpsLoading, error: gpsError } = useLocation()

  const [date, setDate]         = useState(todayStr())
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [tempUnit, setTempUnit] = useState('C')

  // Re-fetch whenever GPS resolves or user picks a new date
  useEffect(() => {
    if (!lat || !lon) return

    setLoading(true)
    fetchDayWeather(lat, lon, date)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [lat, lon, date])

  if (gpsLoading) return <LoadingSpinner message="Detecting your location…" />
  if (loading)    return <LoadingSpinner message="Fetching weather data…" />
  if (!data)      return null

  // Destructure API response
  const daily   = data.weather.daily
  const current = data.weather.current_weather
  const airCurr = data.air.current
  const hourlyW = data.weather.hourly
  const hourlyA = data.air.hourly

  // daily arrays have length 1 — we requested exactly one date
  const maxTemp    = daily.temperature_2m_max?.[0]
  const minTemp    = daily.temperature_2m_min?.[0]
  const precip     = daily.precipitation_sum?.[0]
  const sunrise    = daily.sunrise?.[0]
  const sunset     = daily.sunset?.[0]
  const maxWind    = daily.windspeed_10m_max?.[0]
  const uvIndex    = daily.uv_index_max?.[0]
  const precipProb = daily.precipitation_probability_max?.[0]

  const displayTemp = (c) => {
    if (c == null) return '—'
    return tempUnit === 'F'
      ? String(parseFloat((c * 9 / 5 + 32).toFixed(1)))
      : String(c)
  }

  const aqiInfo = getAqiInfo(airCurr?.pm2_5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up">

      {/* GPS fallback warning */}
      {gpsError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-sm text-yellow-400"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          ⚠️ {gpsError}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">{formatDate(date)}</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-mono">
            {lat?.toFixed(4)}°N &nbsp;{lon?.toFixed(4)}°E
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
            className="text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
            className="text-slate-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Switch to °{tempUnit === 'C' ? 'F' : 'C'}
          </button>
        </div>
      </div>

      {/* ── Current temp hero ── */}
      <div
        className="relative overflow-hidden rounded-3xl mb-6 p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.08) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 rounded-full pointer-events-none"
          style={{ background: 'rgba(96,165,250,0.12)', filter: 'blur(40px)' }} />

        <p className="text-slate-400 text-sm mb-2 relative">Current Temperature</p>
        <p className="text-7xl font-bold text-white relative tracking-tight leading-none">
          {displayTemp(current?.temperature)}
          <span className="text-3xl font-light text-slate-400 ml-1">°{tempUnit}</span>
        </p>
        <p className="text-slate-500 text-sm mt-4 relative font-mono">
          Wind {current?.windspeed} km/h
        </p>
      </div>

      {/* ── Conditions grid ── */}
      <SectionTitle>Conditions</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon="🌡️" label="Max Temp"      value={displayTemp(maxTemp)}  unit={`°${tempUnit}`} colorClass="text-red-400"    delay="0s"     />
        <StatCard icon="❄️"  label="Min Temp"      value={displayTemp(minTemp)}  unit={`°${tempUnit}`} colorClass="text-blue-400"   delay="0.05s"  />
        <StatCard icon="💧"  label="Precipitation" value={fmt(precip)}           unit="mm"             colorClass="text-cyan-400"   delay="0.1s"   />
        <StatCard icon="🌬️" label="Max Wind"       value={fmt(maxWind)}          unit="km/h"           colorClass="text-teal-400"   delay="0.15s"  />
        <StatCard icon="🌅"  label="Sunrise"        value={formatTime(sunrise)}                         colorClass="text-yellow-400" delay="0.2s"   />
        <StatCard icon="🌇"  label="Sunset"         value={formatTime(sunset)}                          colorClass="text-orange-400" delay="0.25s"  />
        <StatCard icon="☀️"  label="UV Index"       value={fmt(uvIndex)}                                colorClass="text-yellow-300" delay="0.3s"   />
        <StatCard icon="🌧️" label="Rain Prob"       value={fmt(precipProb, 0)}   unit="%"              colorClass="text-indigo-400" delay="0.35s"  />
      </div>

      {/* ── Air quality ── */}
      <SectionTitle>Air Quality</SectionTitle>

      <div
        className="rounded-2xl p-4 mb-3 flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="text-3xl">🌫️</span>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Overall AQI</p>
          <p className={`text-xl font-semibold ${aqiInfo.color}`}>{aqiInfo.label}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-slate-500 text-xs">PM2.5</p>
          <p className="text-white font-mono text-sm">{fmt(airCurr?.pm2_5)} μg/m³</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon="🟤" label="PM10"             value={fmt(airCurr?.pm10)}             unit="μg/m³" colorClass="text-amber-400"  delay="0s"    />
        <StatCard icon="🔴" label="PM2.5"            value={fmt(airCurr?.pm2_5)}            unit="μg/m³" colorClass="text-red-400"    delay="0.05s" />
        <StatCard icon="💨" label="Carbon Monoxide"  value={fmt(airCurr?.carbon_monoxide)}  unit="μg/m³" colorClass="text-slate-300"  delay="0.1s"  />
        <StatCard icon="🏭" label="Nitrogen Dioxide" value={fmt(airCurr?.nitrogen_dioxide)} unit="μg/m³" colorClass="text-purple-400" delay="0.15s" />
        <StatCard icon="⚗️" label="Sulphur Dioxide"  value={fmt(airCurr?.sulphur_dioxide)}  unit="μg/m³" colorClass="text-yellow-500" delay="0.2s"  />
        <StatCard icon="🌿" label="CO₂ (global avg)" value="~415"                           unit="ppm"   colorClass="text-green-400"  delay="0.25s" />
      </div>

      {/* ── Hourly charts ── */}
      <SectionTitle>Hourly Breakdown</SectionTitle>
      <HourlyCharts hourlyWeather={hourlyW} hourlyAir={hourlyA} tempUnit={tempUnit} />

    </div>
  )
}
