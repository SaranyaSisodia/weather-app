import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import ChartWrapper from './ChartWrapper'
import { degToCompass } from '../utils/formatters'

const AXIS = { fill: '#64748b', fontSize: 10, fontFamily: 'DM Mono' }
const GRID = { stroke: 'rgba(255,255,255,0.05)', strokeDasharray: '3 3' }
const TIP  = {
  contentStyle: {
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    fontSize: 12,
  },
  labelStyle: { color: '#94a3b8', marginBottom: 4 },
  itemStyle:  { color: '#e2e8f0' },
}

// Convert "2024-06-15T05:47" → decimal hour 5.78 for a numeric Y axis
function parseHour(iso) {
  if (!iso) return null
  const [h, m] = iso.slice(11, 16).split(':').map(Number)
  return parseFloat((h + m / 60).toFixed(2))
}

export default function RangeCharts({ weatherData, airData }) {
  if (!weatherData?.daily?.time) return null

  const {
    time,
    temperature_2m_max,
    temperature_2m_min,
    temperature_2m_mean,
    sunrise,
    sunset,
    precipitation_sum,
    windspeed_10m_max,
    winddirection_10m_dominant,
  } = weatherData.daily

  // Show roughly one x-axis label per 30 days so it stays readable
  const tickInterval = Math.max(1, Math.floor(time.length / 30))

  // Chart width scales with data density — more days = wider chart
  const chartMinW = Math.max(800, time.length * 4)

  const tempRows = time.map((d, i) => ({
    date: d.slice(5),
    max:  temperature_2m_max?.[i],
    min:  temperature_2m_min?.[i],
    mean: temperature_2m_mean?.[i],
  }))

  const sunRows = time.map((d, i) => ({
    date:    d.slice(5),
    sunrise: parseHour(sunrise?.[i]),
    sunset:  parseHour(sunset?.[i]),
  }))

  const precipRows = time.map((d, i) => ({
    date:   d.slice(5),
    precip: precipitation_sum?.[i],
  }))

  const windRows = time.map((d, i) => ({
    date:   d.slice(5),
    speed:  windspeed_10m_max?.[i],
    dirDeg: winddirection_10m_dominant?.[i],
  }))

  const airRows = airData?.daily?.time?.map((d, i) => ({
    date: d.slice(5),
    pm10: airData.daily.pm10_max?.[i],
    pm25: airData.daily.pm2_5_max?.[i],
  })) ?? []

  return (
    <div className="space-y-1">

      {/* 1 — Temperature: 3 lines on one chart */}
      <ChartWrapper title="Temperature — Max / Mean / Min (°C)" height={260} minWidth={chartMinW}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tempRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="date" tick={AXIS} interval={tickInterval} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip {...TIP} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="max"  stroke="#f87171" strokeWidth={1.5} dot={false} name="Max °C"  />
            <Line type="monotone" dataKey="mean" stroke="#fbbf24" strokeWidth={1.5} dot={false} name="Mean °C" />
            <Line type="monotone" dataKey="min"  stroke="#60a5fa" strokeWidth={1.5} dot={false} name="Min °C"  />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* 2 — Sunrise & Sunset (decimal hour on Y, formatted in tooltip) */}
      <ChartWrapper title="Sunrise & Sunset — IST (decimal hour)" height={240} minWidth={chartMinW}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sunRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="date" tick={AXIS} interval={tickInterval} />
            <YAxis tick={AXIS} domain={[4, 21]} width={36} unit="h" />
            <Tooltip
              {...TIP}
              formatter={(val, name) => {
                if (val == null) return ['—', name]
                const h = Math.floor(val)
                const m = String(Math.round((val - h) * 60)).padStart(2, '0')
                return [`${h}:${m}`, name]
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="sunrise" stroke="#fde68a" strokeWidth={1.5} dot={false} name="Sunrise" />
            <Line type="monotone" dataKey="sunset"  stroke="#f97316" strokeWidth={1.5} dot={false} name="Sunset"  />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* 3 — Precipitation — bars because values are discrete daily totals */}
      <ChartWrapper title="Daily Precipitation (mm)" height={240} minWidth={chartMinW}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={precipRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="date" tick={AXIS} interval={tickInterval} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip {...TIP} />
            <Bar dataKey="precip" fill="#818cf8" radius={[2, 2, 0, 0]} name="Precip mm" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* 4 — Wind speed bars, direction shown in tooltip */}
      <ChartWrapper title="Max Wind Speed (km/h) — hover for direction" height={240} minWidth={chartMinW}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={windRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="date" tick={AXIS} interval={tickInterval} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip
              {...TIP}
              formatter={(val, _name, props) => [
                `${val} km/h · ${degToCompass(props.payload.dirDeg)}`,
                'Wind',
              ]}
            />
            <Bar dataKey="speed" fill="#34d399" radius={[2, 2, 0, 0]} name="Max Wind" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* 5 — PM10 & PM2.5 daily max */}
      {airRows.length > 0 && (
        <ChartWrapper title="Air Quality — Daily Max PM10 & PM2.5 (μg/m³)" height={240} minWidth={chartMinW}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={airRows}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="date" tick={AXIS} interval={tickInterval} />
              <YAxis tick={AXIS} width={40} />
              <Tooltip {...TIP} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="pm10" stroke="#a78bfa" strokeWidth={1.5} dot={false} name="PM10"  />
              <Line type="monotone" dataKey="pm25" stroke="#fb923c" strokeWidth={1.5} dot={false} name="PM2.5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

    </div>
  )
}
