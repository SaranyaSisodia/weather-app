import { useState, useEffect } from 'react'

/**
 * useLocation — asks the browser for GPS once on mount.
 * Falls back to New Delhi (28.6139, 77.2090) if the user denies
 * permission or the browser doesn't support Geolocation.
 */
export function useLocation() {
  const [coords, setCoords] = useState({ lat: null, lon: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: 28.6139, lon: 77.209 })
      setError('Geolocation not supported — showing New Delhi.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLoading(false)
      },
      () => {
        setCoords({ lat: 28.6139, lon: 77.209 })
        setError('Location access denied — showing New Delhi.')
        setLoading(false)
      },
      { timeout: 8000 }
    )
  }, []) // empty array = run only once when component first mounts

  return { ...coords, loading, error }
}
