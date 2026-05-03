// src/hooks/useActivityStreak.ts
// Duolingo grace-day streak logic.
// Also returns daysActive (total distinct active days — used by XPCard).
// Streak = consecutive days with ANY fitness activity logged.
// Today is always a grace day — streak only breaks once yesterday passes with zero activity.

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getTodayDateString, getYesterdayDateString, getLocalDateKey } from '../lib/dateUtils'

interface StreakResult {
  streak: number
  daysActive: number
  isLoading: boolean
  error: string | null
}

export function useActivityStreak(
  userId: string | null,
  activityVersion: number
): StreakResult {
  const [result, setResult] = useState<StreakResult>({
    streak: 0,
    daysActive: 0,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!userId) return

    const fetchStreak = async () => {
      setResult(r => ({ ...r, isLoading: true, error: null }))

      const db = supabase.schema('st_health')

      const lookback = new Date()
      lookback.setDate(lookback.getDate() - 180)
      const startStr = getLocalDateKey(lookback)

      const [gymRes, physioRes, foodRes, sleepRes] = await Promise.all([
        db.from('gym_sessions').select('date').eq('user_id', userId).gte('date', startStr),
        db.from('physio_sessions').select('date').eq('user_id', userId).eq('attended', true).gte('date', startStr),
        db.from('food_logs').select('date').eq('user_id', userId).gte('date', startStr),
        db.from('sleep_logs').select('date').eq('user_id', userId).gte('date', startStr),
      ])

      // Build Set of all active date keys
      const activeDates = new Set<string>()
      gymRes.data?.forEach(r  => r.date && activeDates.add(r.date))
      physioRes.data?.forEach(r => r.date && activeDates.add(r.date))
      foodRes.data?.forEach(r  => r.date && activeDates.add(r.date))
      sleepRes.data?.forEach(r => r.date && activeDates.add(r.date))

      const today     = getTodayDateString()
      const yesterday = getYesterdayDateString()

      const isTodayActive     = activeDates.has(today)
      const isYesterdayActive = activeDates.has(yesterday)

      // Duolingo grace-day: if yesterday was inactive, streak is 1 if today active else 0
      let streak = 0
      if (!isYesterdayActive) {
        streak = isTodayActive ? 1 : 0
      } else {
        for (let i = 1; i <= 180; i++) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          if (activeDates.has(getLocalDateKey(d))) {
            streak++
          } else {
            break
          }
        }
        if (isTodayActive) streak++
      }

      setResult({
        streak,
        daysActive: activeDates.size,
        isLoading: false,
        error: null,
      })
    }

    fetchStreak()
  }, [userId, activityVersion])

  return result
}