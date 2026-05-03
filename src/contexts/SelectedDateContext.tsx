// src/contexts/SelectedDateContext.tsx
// Global selected date — all tabs read from here
// IST-safe: uses getTodayDateString() never toISOString()

import { createContext, useContext, useState, type ReactNode } from 'react'
import { getTodayDateString } from '../lib/dateUtils'

interface SelectedDateContextType {
  selectedDate: string          // YYYY-MM-DD in local (IST) time
  setSelectedDate: (d: string) => void
}

const SelectedDateContext = createContext<SelectedDateContextType | null>(null)

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  // Lazy init — only computes getTodayDateString() once on mount
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString)

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  )
}

export function useSelectedDate(): SelectedDateContextType {
  const ctx = useContext(SelectedDateContext)
  if (!ctx) throw new Error('useSelectedDate must be used inside SelectedDateProvider')
  return ctx
}