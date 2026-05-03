// src/hooks/useXpLevel.ts
// Computes total XP from all activity then derives level + progress bar values.
// XP events: gym session +30 | physio attended +20 | sleep logged +10
//            morning checkin +5 | daily cal+protein goal hit +25
//            7-day activity bonus +100 per 7 active days

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface XpLevel {
  totalXp: number
  level: number
  xpIntoLevel: number    // XP earned within current level
  xpToNextLevel: number  // XP needed to complete current level
  progressPct: number    // 0–100 for the XP bar fill
  isLoading: boolean
  error: string | null
}

// BRD triangular curve: totalXpForLevel(n) = (100 × n × (n-1)) / 2
// L1=0  L2=100  L3=300  L4=600  L5=1000  L10=4500
function totalXpForLevel(n: number): number {
  return (100 * n * (n - 1)) / 2
}

function computeLevel(totalXp: number) {
  let level = 1
  while (totalXpForLevel(level + 1) <= totalXp) level++
  const xpAtCurrent  = totalXpForLevel(level)
  const xpAtNext     = totalXpForLevel(level + 1)
  const xpIntoLevel  = totalXp - xpAtCurrent
  const xpToNextLevel = xpAtNext - xpAtCurrent
  const progressPct  = Math.min(100, Math.round((xpIntoLevel / xpToNextLevel) * 100))
  return { level, xpIntoLevel, xpToNextLevel, progressPct }
}

export function useXpLevel(
  userId: string | null,
  activityVersion: number
): XpLevel {
  const [result, setResult] = useState<XpLevel>({
    totalXp: 0,
    level: 1,
    xpIntoLevel: 0,
    xpToNextLevel: 100,
    progressPct: 0,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!userId) return

    const fetchXp = async () => {
      setResult(r => ({ ...r, isLoading: true, error: null }))

      const db = supabase.schema('st_health')

      const [gymRes, physioRes, sleepRes, checkinRes, foodRes, profileRes] = await Promise.all([
        // Each row = 1 session = +30 XP
        db.from('gym_sessions').select('date').eq('user_id', userId),
        // Each row = 1 attended session = +20 XP
        db.from('physio_sessions').select('date').eq('user_id', userId).eq('attended', true),
        // Each row = 1 sleep log = +10 XP
        db.from('sleep_logs').select('date').eq('user_id', userId),
        // Filter morning_text not null in JS = +5 XP each
        db.from('daily_checkins').select('morning_text').eq('user_id', userId),
        // Used for goal-hit days (+25 each) AND active days for streak bonus
        db.from('food_logs').select('date, calories, protein').eq('user_id', userId),
        db.from('profiles').select('target_calories, target_protein').eq('id', userId).maybeSingle(),
      ])

      const errs = [gymRes, physioRes, sleepRes, checkinRes, foodRes, profileRes]
        .map(r => r.error?.message).filter(Boolean)
      if (errs.length > 0) {
        setResult(r => ({ ...r, isLoading: false, error: errs[0] ?? 'XP fetch error' }))
        return
      }

      // Simple XP counts
      const gymXp     = (gymRes.data?.length ?? 0) * 30
      const physioXp  = (physioRes.data?.length ?? 0) * 20
      const sleepXp   = (sleepRes.data?.length ?? 0) * 10
      const checkinXp = (checkinRes.data?.filter(r => r.morning_text !== null).length ?? 0) * 5

      // Goal-hit days: days where both cal + protein targets were met
      const targetCal  = profileRes.data?.target_calories ?? 2000
      const targetProt = profileRes.data?.target_protein  ?? 150

      const byDate = new Map<string, { cal: number; prot: number }>()
      for (const row of foodRes.data ?? []) {
        const prev = byDate.get(row.date) ?? { cal: 0, prot: 0 }
        byDate.set(row.date, {
          cal:  prev.cal  + (row.calories ?? 0),
          prot: prev.prot + (row.protein  ?? 0),
        })
      }
      let goalHitDays = 0
      byDate.forEach(({ cal, prot }) => {
        if (cal >= targetCal && prot >= targetProt) goalHitDays++
      })
      const goalXp = goalHitDays * 25

      // 7-day bonus: union all activity dates, award +100 per complete 7 active days
      const activeDates = new Set<string>()
      gymRes.data?.forEach(r    => activeDates.add(r.date))
      physioRes.data?.forEach(r => activeDates.add(r.date))
      sleepRes.data?.forEach(r  => activeDates.add(r.date))
      foodRes.data?.forEach(r   => activeDates.add(r.date))
      const streakBonusXp = Math.floor(activeDates.size / 7) * 100

      const totalXp = gymXp + physioXp + sleepXp + checkinXp + goalXp + streakBonusXp
      setResult({ totalXp, ...computeLevel(totalXp), isLoading: false, error: null })
    }

    fetchXp()
  }, [userId, activityVersion])

  return result
}