# WeatherScope 🌤

A responsive weather dashboard built with React + Vite that auto-detects your GPS location and displays real-time and historical weather data using the free [Open-Meteo API](https://open-meteo.com).

## Features

- **Auto GPS detection** on page load with Delhi fallback
- **Page 1 — Today:** current conditions, 8 stat cards, AQI breakdown, 6 hourly charts
- **Page 2 — Historical:** date range picker (max 2 years), 5 trend charts
- **°C / °F toggle** on the day view
- **Horizontal scrolling charts** — fully mobile responsive
- **Dark glass-morphism UI** with smooth fade-in animations

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| Tailwind CSS | Utility-first styling |
| Recharts | All data visualisations |
| Axios | API requests |
| date-fns | Date formatting |
| React Router v6 | Client-side navigation |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for Production

```bash
npm run build
# Output goes to /dist — ready to deploy on Vercel, Netlify, etc.
```

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy** — done

## Project Structure

```
src/
├── api/
│   └── weather.js          # All Open-Meteo API calls
├── components/
│   ├── ChartWrapper.jsx     # Scrollable chart shell
│   ├── HourlyCharts.jsx     # 6 hourly charts for Page 1
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   ├── RangeCharts.jsx      # 5 historical charts for Page 2
│   ├── SectionTitle.jsx
│   └── StatCard.jsx
├── hooks/
│   └── useLocation.js       # Browser GPS hook
├── pages/
│   ├── DayPage.jsx          # Page 1
│   └── RangePage.jsx        # Page 2
├── utils/
│   └── formatters.js        # Date/unit/AQI helpers
├── App.jsx                  # Router root
├── index.css                # Tailwind + global styles
└── main.jsx                 # Entry point
```

## API Reference

This project uses two free Open-Meteo endpoints — no API key required:

- `https://api.open-meteo.com/v1/forecast` — weather data
- `https://air-quality-api.open-meteo.com/v1/air-quality` — air quality data
