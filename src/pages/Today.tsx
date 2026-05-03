// src/pages/Today.tsx
// Sprint 1 stub — skeleton structure of the Today screen
// Real content added in tasks 1.4–1.12

export function Today() {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--bg-base)',
        padding: '56px 16px 0',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}>
        {/* Date selector skeleton */}
        <div className="skeleton" style={{ width: 220, height: 36, borderRadius: 9999, marginBottom: 20 }} />
  
        {/* Greeting skeleton */}
        <div className="skeleton" style={{ width: 180, height: 22, marginBottom: 6 }} />
  
        {/* XP Card skeleton */}
        <div className="skeleton" style={{ height: 100, borderRadius: 16, marginBottom: 16 }} />
  
        {/* Today's Progress skeleton */}
        <div className="skeleton" style={{ height: 24, width: 130, marginBottom: 12 }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 52, borderRadius: 12, marginBottom: 8 }} />
        ))}
  
        {/* Discipline card skeleton */}
        <div className="skeleton" style={{ height: 100, borderRadius: 16, marginTop: 8, marginBottom: 16 }} />
  
        {/* Check-in cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
        </div>
  
        {/* Quote skeleton */}
        <div className="skeleton" style={{ height: 72, borderRadius: 14 }} />
      </div>
    )
  }