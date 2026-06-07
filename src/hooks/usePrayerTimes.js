// src/hooks/usePrayerTimes.js
//
// Fetches today's prayer times from the free Aladhan API.
// Falls back to mock data in demo mode or if the fetch fails.
// Aladhan docs: https://aladhan.com/prayer-times-api

import { useState, useEffect } from 'react'
import { DEMO_MODE } from '../lib/supabase'
import { MOCK_PRAYER_TIMES } from '../lib/mockData'

export function usePrayerTimes(latitude = 43.7, longitude = -79.4) {
  const [times, setTimes]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (DEMO_MODE) {
      setTimes(MOCK_PRAYER_TIMES)
      setLoading(false)
      return
    }

    async function fetchTimes() {
      try {
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()

        // Method 2 = ISNA (Islamic Society of North America) — good for Canada
        const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=2`
        const res = await fetch(url)
        const json = await res.json()

        if (json.code !== 200) throw new Error('Aladhan API error')

        const t = json.data.timings
        // Strip timezone annotations like "(EET)" from the time strings
        const clean = (str) => str.split(' ')[0]

        setTimes({
          Fajr:    clean(t.Fajr),
          Sunrise: clean(t.Sunrise),
          Dhuhr:   clean(t.Dhuhr),
          Asr:     clean(t.Asr),
          Maghrib: clean(t.Maghrib),
          Isha:    clean(t.Isha),
        })
      } catch (err) {
        setError(err.message)
        setTimes(MOCK_PRAYER_TIMES) // graceful fallback
      } finally {
        setLoading(false)
      }
    }

    fetchTimes()
  }, [latitude, longitude])

  return { times, loading, error }
}
