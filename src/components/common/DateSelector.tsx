// src/pages/Today.tsx
// Sprint 1.2 — DateSelector + useTodayStats wired in.
// XP card, Progress rows, Discipline card, Check-in cards: still skeleton (built in 1.3+).

import { DateSelector } from '../components/common/DateSelector'
import { useTodayStats } from '../hooks/useTodayStats'
import { useUserContext } from '../contexts/UserContext'
import { useSelectedDate } from '../contexts/SelectedDateContext'

function Greeting() {
  const hour = new Date().getHours()
  const timeOfDay =
    hour < 12 ? 'morning' :
    hour < 17 ? 'afternoon' : 'evening'

  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '18px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      margin: '0 0 16px',
    }}>
      Good {timeOfDay}, ST. 👋
    </p>
  )
}

export function Today() {
  const { user, activityVersion } = useUserContext()
  const { selectedDate }          = useSelectedDate()
  const stats                     = useTodayStats(user?.id ?? null, selectedDate, activityVersion)

  return (
    <div className="page" style={{ paddingTop: 56 }}>

      {/* Date selector */}
      <div style={{ marginBottom: 20 }}>
        <DateSelector />
      </div>

      {/* Greeting — always visible */}
      <Greeting />

      {/* XP Card skeleton — replaced in Sprint 1.3 */}
      <div className="skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 16 }} />

      {/* Today's Progress — skeleton until 1.4 */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        Today's Progress
      </p>

      {stats.isLoading
        ? [...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 12, marginBottom: 8 }} />
          ))
        : (
          // Temporary debug card — shows live data to confirm hook works.
          // Replace with real ProgressRow components in Sprint 1.4.
          <div className="card" style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <div>🍽 {stats.calories} / {stats.targetCalories} kcal · {stats.protein}g protein</div>
            <div>💪 Gym: {stats.gymLogged ? `${stats.gymSessionCount} session(s)` : 'not logged'}</div>
            <div>🦵 Physio: {stats.physioLogged ? (stats.physioAttended ? 'attended' : 'missed') : 'not logged'}</div>
            <div>😴 Sleep: {stats.sleepLogged ? `${stats.sleepDurationMins}m` : 'not logged'}</div>
            <div>🏃 Steps: {stats.steps}</div>
          </div>
        )
      }

      {/* Discipline card skeleton — Sprint 1.5 */}
      <div className="skeleton" style={{ height: 100, borderRadius: 16, marginTop: 8, marginBottom: 16 }} />

      {/* Check-in cards skeleton — Sprint 1.6 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
      </div>

      {/* Quote skeleton — Sprint 1.7 */}
      <div className="skeleton" style={{ height: 72, borderRadius: 14 }} />
    </div>
  )
}