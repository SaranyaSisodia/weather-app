import axios from 'axios'

const WEATHER_BASE = 'https://api.open-meteo.com/v1'
const AIR_BASE = 'https://air-quality-api.open-meteo.com/v1'

/**
 * Page 1 — single date.
 * Fires both API calls in parallel with Promise.all so we only wait
 * as long as the slower of the two, not the sum of both.
 */
export async function fetchDayWeather(lat, lon, date) {
  const [weatherRes, airRes] = await Promise.all([
    axios.get(`${WEATHER_BASE}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'sunrise',
          'sunset',
          'windspeed_10m_max',
          'uv_index_max',
          'precipitation_probability_max',
        ].join(','),
        hourly: [
          'temperature_2m',
          'relativehumidity_2m',
          'precipitation',
          'visibility',
          'windspeed_10m',
          'apparent_temperature',
        ].join(','),
        current_weather: true,
        timezone: 'auto',
        start_date: date,
        end_date: date,
      },
    }),
    axios.get(`${AIR_BASE}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: [
          'pm10',
          'pm2_5',
          'carbon_monoxide',
          'nitrogen_dioxide',
          'sulphur_dioxide',
        ].join(','),
        current: [
          'pm10',
          'pm2_5',
          'carbon_monoxide',
          'nitrogen_dioxide',
          'sulphur_dioxide',
        ].join(','),
        timezone: 'auto',
        start_date: date,
        end_date: date,
      },
    }),
  ])

  return { weather: weatherRes.data, air: airRes.data }
}

/**
 * Page 2 — date range up to 2 years.
 * Open-Meteo's /forecast endpoint supports historical dates via
 * start_date / end_date params without needing a separate archive URL.
 */
export async function fetchRangeWeather(lat, lon, startDate, endDate) {
  const [weatherRes, airRes] = await Promise.all([
    axios.get(`${WEATHER_BASE}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'temperature_2m_mean',
          'sunrise',
          'sunset',
          'precipitation_sum',
          'windspeed_10m_max',
          'winddirection_10m_dominant',
        ].join(','),
        timezone: 'auto',
        start_date: startDate,
        end_date: endDate,
      },
    }),
    axios.get(`${AIR_BASE}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: ['pm10_max', 'pm2_5_max'].join(','),
        timezone: 'auto',
        start_date: startDate,
        end_date: endDate,
      },
    }),
  ])

  return { weather: weatherRes.data, air: airRes.data }
}
