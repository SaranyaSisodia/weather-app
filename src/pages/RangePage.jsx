import { useState } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { fetchRangeWeather } from '../api/weather'
import { useLocation } from '../hooks/useLocation'
import { minDateStr, todayStr } from '../utils/formatters'
import RangeCharts from '../components/RangeCharts'
import LoadingSpinner from '../components/LoadingSpinner'
import SectionTitle from '../components/SectionTitle'

export default function RangePage() {
  const { lat, lon, loading: gpsLoading, error: gpsError } = useLocation()

  const [startDate, setStartDate] = useState('')
  const [endDate,   setEndDate]   = useState('')
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleFetch = async () => {
    // Validate before hitting the API
    if (!startDate || !endDate) {
      setError('Please select both a start and end date.')
      return
    }

    const days = differenceInCalendarDays(parseISO(endDate), parseISO(startDate))

    if (days < 1) {
      setError('End date must be after start date.')
      return
    }
    if (days > 730) {
      setError('Maximum range is 2 years (730 days). Please shorten the selection.')
      return
    }

    setError('')
    setLoading(true)
    setData(null)

    try {
      const res = await fetchRangeWeather(lat, lon, startDate, endDate)
      setData(res)
    } catch {
      setError('Failed to fetch data. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (gpsLoading) return <LoadingSpinner message="Detecting your location…" />

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up">

      {gpsError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-sm text-yellow-400"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          ⚠️ {gpsError}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-white mb-1">Historical Weather</h1>
      <p className="text-slate-500 text-sm mb-6">Select a date range — maximum 2 years back</p>

      {/* ── Date range picker ── */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-wrap gap-4 items-end">

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-500 text-xs uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={startDate}
              min={minDateStr()}
              max={todayStr()}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-500 text-xs uppercase tracking-wider">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate || minDateStr()}
              max={todayStr()}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-40"
            style={{ background: 'rgba(59,130,246,0.7)', border: '1px solid rgba(59,130,246,0.4)' }}
          >
            {loading ? 'Loading…' : 'Fetch Data'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        {/* Helper text showing how many days selected */}
        {startDate && endDate && !error && (() => {
          const days = differenceInCalendarDays(parseISO(endDate), parseISO(startDate))
          if (days > 0) return (
            <p className="text-slate-500 text-xs mt-3">
              {days} day{days !== 1 ? 's' : ''} selected
            </p>
          )
          return null
        })()}
      </div>

      {loading && <LoadingSpinner message="Fetching historical data…" />}

      {data && !loading && (
        <>
          <SectionTitle>Charts</SectionTitle>
          <RangeCharts weatherData={data.weather} airData={data.air} />
        </>
      )}

    </div>
  )
}
