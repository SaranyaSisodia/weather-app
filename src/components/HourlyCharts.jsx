import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import ChartWrapper from './ChartWrapper'

// Defined at module level — never recreated on re-render
const AXIS = { fill: '#64748b', fontSize: 11, fontFamily: 'DM Mono' }
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

function toF(c) {
  return c == null ? null : parseFloat((c * 9 / 5 + 32).toFixed(1))
}

export default function HourlyCharts({ hourlyWeather, hourlyAir, tempUnit }) {
  if (!hourlyWeather?.time) return null

  const { time, temperature_2m, relativehumidity_2m, precipitation, visibility, windspeed_10m } = hourlyWeather

  const weatherRows = time.map((t, i) => ({
    hour:     t.slice(11, 16),
    temp:     tempUnit === 'F' ? toF(temperature_2m?.[i]) : temperature_2m?.[i],
    humidity: relativehumidity_2m?.[i],
    precip:   precipitation?.[i],
    vis:      visibility?.[i] != null ? +(visibility[i] / 1000).toFixed(1) : null,
    wind:     windspeed_10m?.[i],
  }))

  const airRows = hourlyAir?.time?.map((t, i) => ({
    hour: t.slice(11, 16),
    pm10: hourlyAir.pm10?.[i],
    pm25: hourlyAir.pm2_5?.[i],
  })) ?? []

  return (
    <div className="space-y-1">

      <ChartWrapper title={`Temperature (°${tempUnit})`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weatherRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="hour" tick={AXIS} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip {...TIP} />
            <Line type="monotone" dataKey="temp" stroke="#60a5fa" strokeWidth={2} dot={false} name={`Temp °${tempUnit}`} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Relative Humidity (%)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weatherRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="hour" tick={AXIS} />
            <YAxis tick={AXIS} domain={[0, 100]} width={36} />
            <Tooltip {...TIP} />
            <Line type="monotone" dataKey="humidity" stroke="#34d399" strokeWidth={2} dot={false} name="Humidity %" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Precipitation (mm)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weatherRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="hour" tick={AXIS} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip {...TIP} />
            <Bar dataKey="precip" fill="#818cf8" radius={[3, 3, 0, 0]} name="Precip mm" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Visibility (km)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weatherRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="hour" tick={AXIS} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip {...TIP} />
            <Line type="monotone" dataKey="vis" stroke="#fbbf24" strokeWidth={2} dot={false} name="Visibility km" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Wind Speed at 10m (km/h)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weatherRows}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="hour" tick={AXIS} />
            <YAxis tick={AXIS} width={36} />
            <Tooltip {...TIP} />
            <Line type="monotone" dataKey="wind" stroke="#f87171" strokeWidth={2} dot={false} name="Wind km/h" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {airRows.length > 0 && (
        <ChartWrapper title="Air Quality — PM10 & PM2.5 (μg/m³)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={airRows}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="hour" tick={AXIS} />
              <YAxis tick={AXIS} width={40} />
              <Tooltip {...TIP} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="pm10" stroke="#a78bfa" strokeWidth={2} dot={false} name="PM10" />
              <Line type="monotone" dataKey="pm25" stroke="#fb923c" strokeWidth={2} dot={false} name="PM2.5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

    </div>
  )
}
