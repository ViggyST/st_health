// src/hooks/useTodayStats.ts
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface TodayStats {
  gymLogged: boolean
  gymSessionCount: number
  calories: number
  protein: number
  carbs: number
  fat: number
  physioLogged: boolean
  physioAttended: boolean
  sleepLogged: boolean
  sleepDurationMins: number | null
  sleepQuality: number | null
  steps: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  targetWater: number
  morningDone: boolean
  nightDone: boolean
  isLoading: boolean
  error: string | null
}

const DEFAULT_TARGETS = {
  targetCalories: 2000,
  targetProtein: 150,
  targetCarbs: 200,
  targetFat: 65,
  targetWater: 2500,
}

export function useTodayStats(
  userId: string | null,
  selectedDate: string,
  activityVersion: number
): TodayStats {
  const [stats, setStats] = useState<TodayStats>({
    gymLogged: false,
    gymSessionCount: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    physioLogged: false,
    physioAttended: false,
    sleepLogged: false,
    sleepDurationMins: null,
    sleepQuality: null,
    steps: 0,
    ...DEFAULT_TARGETS,
    morningDone: false,
    nightDone: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!userId) return

    const fetchStats = async () => {
      setStats(s => ({ ...s, isLoading: true, error: null }))

      const db = supabase.schema('st_health')

      const [gymRes, foodRes, physioRes, sleepRes, stepsRes, profileRes, checkinRes] =
        await Promise.all([
          db.from('gym_sessions').select('id').eq('user_id', userId).eq('date', selectedDate),
          db.from('food_logs').select('calories, protein, carbs, fat').eq('user_id', userId).eq('date', selectedDate),
          db.from('physio_sessions').select('attended').eq('user_id', userId).eq('date', selectedDate).maybeSingle(),
          db.from('sleep_logs').select('duration_mins, quality').eq('user_id', userId).eq('date', selectedDate).maybeSingle(),
          db.from('activity_logs').select('steps').eq('user_id', userId).eq('date', selectedDate).maybeSingle(),
          db.from('profiles').select('target_calories, target_protein, target_carbs, target_fat, target_water').eq('id', userId).maybeSingle(),
          db.from('daily_checkins').select('morning_text, night_text').eq('user_id', userId).eq('entry_date', selectedDate).maybeSingle(),
        ])

      const errs = [gymRes, foodRes, physioRes, sleepRes, stepsRes, profileRes, checkinRes]
        .map(r => r.error?.message)
        .filter(Boolean)

      if (errs.length > 0) {
        setStats(s => ({ ...s, isLoading: false, error: errs[0] ?? 'Fetch error' }))
        return
      }

      const food = foodRes.data ?? []
      const calories = food.reduce((sum, r) => sum + (r.calories ?? 0), 0)
      const protein  = food.reduce((sum, r) => sum + (r.protein  ?? 0), 0)
      const carbs    = food.reduce((sum, r) => sum + (r.carbs    ?? 0), 0)
      const fat      = food.reduce((sum, r) => sum + (r.fat      ?? 0), 0)

      const p = profileRes.data
      const targets = p ? {
        targetCalories: p.target_calories ?? DEFAULT_TARGETS.targetCalories,
        targetProtein:  p.target_protein  ?? DEFAULT_TARGETS.targetProtein,
        targetCarbs:    p.target_carbs    ?? DEFAULT_TARGETS.targetCarbs,
        targetFat:      p.target_fat      ?? DEFAULT_TARGETS.targetFat,
        targetWater:    p.target_water    ?? DEFAULT_TARGETS.targetWater,
      } : DEFAULT_TARGETS

      setStats({
        gymLogged:        (gymRes.data?.length ?? 0) > 0,
        gymSessionCount:   gymRes.data?.length ?? 0,
        calories:  Math.round(calories),
        protein:   Math.round(protein),
        carbs:     Math.round(carbs),
        fat:       Math.round(fat),
        physioLogged:      physioRes.data !== null,
        physioAttended:    physioRes.data?.attended ?? false,
        sleepLogged:       sleepRes.data !== null,
        sleepDurationMins: sleepRes.data?.duration_mins ?? null,
        sleepQuality:      sleepRes.data?.quality ?? null,
        steps:             stepsRes.data?.steps ?? 0,
        ...targets,
        morningDone: !!checkinRes.data?.morning_text,
        nightDone:   !!checkinRes.data?.night_text,
        isLoading: false,
        error: null,
      })
    }

    fetchStats()
  }, [userId, selectedDate, activityVersion])

  return stats
}