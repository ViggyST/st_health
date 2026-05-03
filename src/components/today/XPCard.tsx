// src/components/today/XPCard.tsx
// XP card on the Today screen.
// Shows: Level | XP bar | Streak | Days active

import { useUserContext } from '../../contexts/UserContext'
import { useActivityStreak } from '../../hooks/useActivityStreak'
import { useXpLevel } from '../../hooks/useXpLevel'

export function XPCard() {
  const { user, activityVersion } = useUserContext()
  const userId = user?.id ?? null

  const { streak, daysActive, isLoading: streakLoading } = useActivityStreak(userId, activityVersion)
  const { level, xpIntoLevel, xpToNextLevel, progressPct, totalXp, isLoading: xpLoading } = useXpLevel(userId, activityVersion)

  if (streakLoading || xpLoading) {
    return <div className="skeleton" style={{ height: 104, borderRadius: 16, marginBottom: 16 }} />
  }

  return (
    <div className="card-accent" style={{ marginBottom: 16 }}>

      {/* Top row: Level + Streak + Days active */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>

        {/* Level */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{
            fontFamily: 'var(--font-metric)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Level
          </span>
          <span style={{
            fontFamily: 'var(--font-metric)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {level}
          </span>
        </div>

        {/* Streak + Days active */}
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-metric)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {streak}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>
              day streak 🔥
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-metric)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {daysActive}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>
              days active
            </div>
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)' }}>
            {xpIntoLevel} / {xpToNextLevel} XP
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' }}>
            {totalXp} total
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

    </div>
  )
}