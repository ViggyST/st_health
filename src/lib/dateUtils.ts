export function getLocalDateKey(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  
  export const getTodayDateString = () => getLocalDateKey(new Date())
  
  export const getYesterdayDateString = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return getLocalDateKey(d)
  }
  
  export const parseDateKey = (k: string): Date => {
    const [y, m, d] = k.split('-').map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0)
  }
  
  export const toDateKey = (d: Date): string => getLocalDateKey(d)
  
  export function getRelativeDateLabel(dateKey: string): string {
    const today = getTodayDateString()
    const yesterday = getYesterdayDateString()
    if (dateKey === today) return 'Today'
    if (dateKey === yesterday) return 'Yesterday'
    const date = parseDateKey(dateKey)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }