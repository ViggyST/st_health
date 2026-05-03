// src/pages/Fuel.tsx — Sprint 2

export function Fuel() {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}>
        <span style={{ fontSize: 32 }}>🍽</span>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
          Fuel module — Sprint 2
        </p>
      </div>
    )
  }