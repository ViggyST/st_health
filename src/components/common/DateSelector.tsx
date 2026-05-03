// src/components/common/DateSelector.tsx
import { useRef } from 'react'
import { useSelectedDate } from '../../contexts/SelectedDateContext'
import { getTodayDateString, getYesterdayDateString, getRelativeDateLabel } from '../../lib/dateUtils'

export function DateSelector() {
  const { selectedDate, setSelectedDate } = useSelectedDate()
  const dateInputRef = useRef<HTMLInputElement>(null)

  const today     = getTodayDateString()
  const yesterday = getYesterdayDateString()
  const isToday     = selectedDate === today
  const isYesterday = selectedDate === yesterday
  const isCustom    = !isToday && !isYesterday

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

      <button
        className={`pill ${isToday ? 'active' : ''}`}
        onClick={() => setSelectedDate(today)}
      >
        Today
      </button>

      <button
        className={`pill ${isYesterday ? 'active' : ''}`}
        onClick={() => setSelectedDate(yesterday)}
      >
        Yesterday
      </button>

      <button
        className={`pill ${isCustom ? 'active' : ''}`}
        onClick={() => dateInputRef.current?.click()}
        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {isCustom ? getRelativeDateLabel(selectedDate) : 'Pick'}
      </button>

      <input
        ref={dateInputRef}
        type="date"
        value={selectedDate}
        max={today}
        onChange={e => { if (e.target.value) setSelectedDate(e.target.value) }}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        tabIndex={-1}
      />
    </div>
  )
}